import io
import os
import re
import uuid
import base64
import asyncio
from typing import List, Optional

import numpy as np
import cv2
import torch
import torch.nn as nn
import torch.nn.functional as F
from fastapi import FastAPI, File, UploadFile, HTTPException, Form, Request
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from fastapi import status

from utils.video import (
    extract_uniform_frames,
    compute_mfcc_from_video,
    extract_audio_waveform,
    get_video_props,
    compute_audio_rms_series,
    compute_mouth_open_series,
)
from utils.visualize import grad_cam_heatmap
from models.pinpoint import load_model, normalize_frames, Config
from models.ensemble import create_ensemble
from dotenv import load_dotenv
from utils.s3 import S3Client
from utils.credits import CreditsClient
from utils.auth import VERIFIER
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()
app = FastAPI(title="Deepfake Detector (Pinpoint Transformer)")

# serve static frontend
app.mount("/static", StaticFiles(directory="static"), name="static")
ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "*")
origins = [o.strip() for o in ALLOWED_ORIGINS.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Optional: allow serving under a path prefix (e.g., behind an ALB rule /engine/*)
# When BASE_PATH_PREFIX is set to something like "/engine", incoming requests to
# "/engine/predict" will be treated as "/predict" by the app.
BASE_PATH_PREFIX = os.environ.get("BASE_PATH_PREFIX", "").rstrip("/")

class _StripPrefixMiddleware:
    def __init__(self, app, prefix: str) -> None:
        self.app = app
        # ensure leading slash and no trailing slash
        self.prefix = ("/" + prefix.lstrip("/")).rstrip("/") if prefix else ""

    async def __call__(self, scope, receive, send):
        if self.prefix and scope and scope.get("type") in {"http", "websocket"}:
            path = scope.get("path", "") or ""
            if path.startswith(self.prefix + "/") or path == self.prefix:
                new_path = path[len(self.prefix):] or "/"
                # Copy scope to avoid mutating shared dict
                scope = dict(scope)
                scope["path"] = new_path
        return await self.app(scope, receive, send)

"""
Note: Do not wrap `app` with `_StripPrefixMiddleware` before route definitions.
Doing so would replace the FastAPI instance and break decorator usage (e.g., @app.get).
We apply the middleware at the end of the module, after all routes are registered.
"""


class ModelSection(BaseModel):
    score: float
    label: str
    frame_indices: List[int]
    per_frame_scores: List[float]
    attention_map: Optional[List[List[float]]] = None
    heatmaps: Optional[List[str]] = None  # base64 PNGs (Grad-CAM)
    waveform: Optional[List[float]] = None
    mel_spectrogram: Optional[List[List[float]]] = None
    lip_heatmaps: Optional[List[str]] = None
    sync_metric: Optional[float] = None
    sync_series_audio: Optional[List[float]] = None
    sync_series_mouth: Optional[List[float]] = None


class LaplacianSection(BaseModel):
    score: float  # heuristic probability of fake from blur fraction
    label: str
    sharpness_series: List[float]
    sharpness_mean: float
    sharpness_threshold: float
    blur_fraction: float
    overlay_heatmaps: Optional[List[str]] = None  # base64 PNGs of Laplacian magnitude on sample frames
    explain: Optional[str] = None


class PredictResponse(BaseModel):
    audio_present: bool
    video_meta: Optional[dict] = None  # {fps,total_frames,duration_sec}
    model_pred: Optional[ModelSection] = None
    laplacian_pred: LaplacianSection
    # Multi-model ensemble results
    ensemble_enabled: bool = False
    manipulation_percentage: Optional[float] = None
    ensemble_confidence: Optional[float] = None
    ensemble_label: Optional[str] = None
    model_predictions: Optional[List[dict]] = None
    consensus_details: Optional[dict] = None
    agreement_matrix: Optional[List[dict]] = None
    # Allow field names starting with 'model_' without triggering protected namespace warnings
    model_config = {"protected_namespaces": ()}


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/models/info")
async def get_models_info():
    """Get information about loaded models in the ensemble"""
    global _ensemble_loading, _ensemble_error
    
    if not USE_ENSEMBLE:
        return {
            "success": True,
            "ensemble_enabled": False,
            "model": "Pinpoint Transformer (Single Model)",
            "message": "Ensemble not enabled. Set USE_ENSEMBLE=true to enable multi-model detection."
        }
    
    if _ensemble_loading:
        return {
            "success": True,
            "ensemble_enabled": True,
            "status": "loading",
            "message": f"Loading {ENSEMBLE_CONFIG} ensemble models in background... Please check again in a few moments."
        }
    
    if _ensemble_error:
        return {
            "success": False,
            "ensemble_enabled": True,
            "status": "error",
            "error": _ensemble_error,
            "message": "Ensemble failed to load. Falling back to single Pinpoint model."
        }
    
    ensemble = get_ensemble()
    if ensemble:
        info = ensemble.get_model_info()
        return {
            "success": True,
            "ensemble_enabled": True,
            "status": "ready",
            "ensemble_config": info["ensemble_config"],
            "num_models": info["num_models"],
            "models": info["models"]
        }
    
    return {
        "success": True,
        "ensemble_enabled": False,
        "model": "Pinpoint Transformer (Single Model)",
        "message": "Ensemble not enabled."
    }


# lazy global model
_model = None
_ensemble = None
_ensemble_loading = False
_ensemble_error = None
_device = "cuda" if torch.cuda.is_available() else "cpu"
MAX_UPLOAD_MB = int(os.environ.get("MAX_UPLOAD_MB", "200"))  # adjustable via env var
MODEL_PATH = os.environ.get("MODEL_PATH", "model/best_pinpoint_model_antisocial.pth")
USER_DATA_ROOT = os.environ.get("USER_DATA_ROOT", "user_data")
S3_CLIENT = S3Client()
CREDITS = CreditsClient.from_env()

# Multi-model ensemble configuration
USE_ENSEMBLE = os.environ.get("USE_ENSEMBLE", "false").lower() == "true"
ENSEMBLE_CONFIG = os.environ.get("ENSEMBLE_CONFIG", "default")  # default, fast, maximum_accuracy, visual_only

# S3-only persistence policy: when S3 is enabled, do not use local filesystem for user data.
# If S3 is not enabled, we will not expose any local user_data via static routes to avoid
# accidentally persisting user content on the EC2 instance.


def sanitize_user_id(uid: Optional[str]) -> Optional[str]:
    if not uid:
        return None
    # Allow only alphanum, dash, underscore; limit length
    safe = re.sub(r"[^A-Za-z0-9_-]", "_", uid)[:64]
    return safe or None


def get_model():
    global _model
    if _model is None:
        _model = load_model(MODEL_PATH, device=_device)
    return _model


def get_ensemble():
    """Return ensemble if loaded, None if still loading or disabled"""
    return _ensemble


async def _load_ensemble_async():
    """Background task to load ensemble models"""
    global _ensemble, _ensemble_loading, _ensemble_error
    
    if not USE_ENSEMBLE:
        logger.info("Ensemble disabled (USE_ENSEMBLE=false)")
        return
    
    _ensemble_loading = True
    _ensemble_error = None
    
    try:
        logger.info(f"🔄 Starting background ensemble initialization with config: {ENSEMBLE_CONFIG}")
        # Run blocking create_ensemble in thread pool to avoid blocking event loop
        loop = asyncio.get_event_loop()
        _ensemble = await loop.run_in_executor(None, create_ensemble, ENSEMBLE_CONFIG)
        logger.info(f"✅ Ensemble initialized with {len(_ensemble.detectors)} models")
    except Exception as e:
        logger.error(f"❌ Failed to initialize ensemble: {e}")
        logger.warning("Falling back to single Pinpoint model")
        _ensemble_error = str(e)
        _ensemble = None
    finally:
        _ensemble_loading = False


@app.on_event("startup")
async def startup_event():
    """Initialize ensemble in background on server startup"""
    if USE_ENSEMBLE:
        logger.info("Triggering background ensemble loading...")
        asyncio.create_task(_load_ensemble_async())
    else:
        logger.info("Ensemble disabled - using single Pinpoint model")


@app.post("/predict", response_model=PredictResponse)
async def predict(
    request: Request,
    file: UploadFile = File(...),
    explain: bool = Form(default=True),
    user_id: str | None = Form(default=None),
):
    if not file.filename.lower().endswith((".mp4", ".mov", ".avi", ".mkv", ".webm")):
        raise HTTPException(status_code=400, detail="Please upload a video file.")

    # Optional credit pre-check: only enforced when credits are enabled AND user_id is provided
    # If Cognito enforcement is enabled, derive user_id from JWT and ignore provided user_id
    uid_pre = None
    if VERIFIER.is_enabled():
        try:
            claims = VERIFIER.verify_bearer(request.headers.get("Authorization"))
            uid_pre = VERIFIER.derive_user_id(claims)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_or_missing_token")
    else:
        uid_pre = sanitize_user_id(user_id)
    if CREDITS.is_enabled() and uid_pre:
        # Auto-register user to grant welcome credits (idempotent)
        try:
            CREDITS.register(uid_pre)
        except Exception:
            pass
        price = max(1, CREDITS.get_price())
        if not CREDITS.ensure_balance(uid_pre, price):
            raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="insufficient_credits")

    # save to tmp
    tmp_dir = "tmp"
    os.makedirs(tmp_dir, exist_ok=True)
    tmp_path = os.path.join(tmp_dir, f"{uuid.uuid4()}_{file.filename}")
    # Stream upload to disk to avoid loading entire file into memory
    bytes_limit = MAX_UPLOAD_MB * 1024 * 1024
    total = 0
    CHUNK = 8 * 1024 * 1024  # 8 MB
    try:
        with open(tmp_path, "wb") as out:
            while True:
                chunk = await file.read(CHUNK)
                if not chunk:
                    break
                total += len(chunk)
                if total > bytes_limit:
                    raise HTTPException(status_code=413, detail=f"File too large. Max allowed is {MAX_UPLOAD_MB} MB")
                out.write(chunk)
    finally:
        # Ensure the underlying SpooledTemporaryFile is closed
        try:
            await file.close()
        except Exception:
            pass

    try:
        cfg = Config()
        # 1) Extract frames and audio features (waveform, MFCC, mel)
        frames_rgb = extract_uniform_frames(tmp_path, num_frames=cfg.NUM_FRAMES, size=cfg.VIDEO_SIZE)
        if len(frames_rgb) != cfg.NUM_FRAMES:
            raise HTTPException(status_code=422, detail="Could not extract enough frames from video.")
        frames_tensor = torch.from_numpy(np.stack([normalize_frames(fr) for fr in frames_rgb])).float()  # T,C,H,W
        # waveform and mel spectrogram
        y, sr = extract_audio_waveform(tmp_path, target_sr=16000)
        audio_present = bool(y.size > 0 and sr)
        mfcc = compute_mfcc_from_video(tmp_path, n_mfcc=cfg.NUM_MFCC) if audio_present else np.zeros((0, cfg.NUM_MFCC), dtype=np.float32)
        mel = None
        if audio_present:
            import librosa
            S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=64, fmax=sr//2)
            mel = librosa.power_to_db(S, ref=np.max).astype(np.float32)

        # 1b) Compute per-frame sharpness (variance of Laplacian) as in the Streamlit example
        sharp_vals: List[float] = []
        for fr in frames_rgb:
            gray = cv2.cvtColor(fr, cv2.COLOR_RGB2GRAY)
            var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
            sharp_vals.append(var)
        sharp_arr = np.array(sharp_vals, dtype=np.float32)
        sharp_mean = float(sharp_arr.mean()) if sharp_arr.size else 0.0
        sharp_thresh = 100.0  # from Streamlit sample
        blur_fraction = float(((sharp_arr < sharp_thresh).sum() / max(1, len(sharp_vals))))
        # Prepare model section (only if audio present)
        model_section: Optional[ModelSection] = None
        attn = None
        frame_ids = [cfg.NUM_FRAMES // 4, cfg.NUM_FRAMES // 2, 3 * cfg.NUM_FRAMES // 4]
        if audio_present:
            model = get_model()
            model.eval()
            with torch.no_grad():
                video = frames_tensor.unsqueeze(0).to(_device)  # B,T,C,H,W
                audio = torch.from_numpy(mfcc).unsqueeze(0).to(_device)  # B,Ta,NUM_MFCC
                video_mask = torch.zeros(cfg.NUM_FRAMES, dtype=torch.bool, device=_device).unsqueeze(0)
                cls_logits, offset_logits, attn = model(video, audio, video_mask)
                prob_fake = float(torch.sigmoid(cls_logits).item())

            # per-frame scores from attention energy
            if attn is not None:
                att = attn.squeeze(0).detach().cpu().numpy()  # Ta x Tv
                per_frame = (att.sum(axis=0) / (att.sum() + 1e-8)).tolist()
            else:
                per_frame = [prob_fake] * cfg.NUM_FRAMES

            heatmaps_b64 = None
            lip_hmaps_b64 = None
            if explain:
                heatmaps_b64 = []
                lip_hmaps_b64 = []
                for idx in frame_ids:
                    hm = grad_cam_heatmap(model, frames_tensor, torch.from_numpy(mfcc), idx, _device, cfg)
                    hm_color = cv2.applyColorMap((hm * 255).astype(np.uint8), cv2.COLORMAP_JET)
                    _, png = cv2.imencode('.png', hm_color)
                    heatmaps_b64.append(base64.b64encode(png.tobytes()).decode('utf-8'))
                    # MediaPipe-based lip overlay (if possible)
                    try:
                        import mediapipe as mp
                        mp_face = mp.solutions.face_mesh
                        frame_np = (frames_tensor[idx].permute(1,2,0).cpu().numpy())
                        frame_vis = ((frame_np * np.array(Config.NORM_STD)) + np.array(Config.NORM_MEAN))
                        frame_vis = np.clip(frame_vis, 0, 1)
                        H, W, _ = frame_vis.shape
                        with mp_face.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=True, min_detection_confidence=0.5) as fm:
                            res = fm.process(cv2.cvtColor((frame_vis*255).astype(np.uint8), cv2.COLOR_RGB2BGR))
                            img_bgr = cv2.cvtColor((frame_vis*255).astype(np.uint8), cv2.COLOR_RGB2BGR)
                            if res.multi_face_landmarks:
                                lm = res.multi_face_landmarks[0].landmark
                                lip_idx = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95, 78, 191, 80, 81, 82, 13]
                                pts = [(int(lm[i].x*W), int(lm[i].y*H)) for i in lip_idx if i < len(lm)]
                                for i in range(len(pts)):
                                    cv2.line(img_bgr, pts[i-1], pts[i], (0,255,0), 2)
                            _, png2 = cv2.imencode('.png', img_bgr)
                            lip_hmaps_b64.append(base64.b64encode(png2.tobytes()).decode('utf-8'))
                    except Exception:
                        frame_np = (frames_tensor[idx].permute(1,2,0).cpu().numpy())
                        frame_vis = ((frame_np * np.array(Config.NORM_STD)) + np.array(Config.NORM_MEAN))
                        frame_vis = np.clip(frame_vis, 0, 1)
                        H, W, _ = frame_vis.shape
                        x1, y1 = int(W*0.3), int(H*0.55)
                        x2, y2 = int(W*0.7), int(H*0.85)
                        rect = (np.array(frame_vis)*255).astype(np.uint8).copy()
                        rect = cv2.cvtColor(rect, cv2.COLOR_RGB2BGR)
                        cv2.rectangle(rect, (x1,y1), (x2,y2), (0,255,0), 2)
                        _, png2 = cv2.imencode('.png', rect)
                        lip_hmaps_b64.append(base64.b64encode(png2.tobytes()).decode('utf-8'))

            model_section = ModelSection(
                score=float(prob_fake),
                label="fake" if prob_fake >= 0.5 else "real",
                frame_indices=list(range(cfg.NUM_FRAMES)),
                per_frame_scores=[float(x) for x in per_frame],
                attention_map=attn.squeeze(0).detach().cpu().tolist() if attn is not None else None,
                heatmaps=heatmaps_b64,
                waveform=y.tolist() if audio_present and y is not None else None,
                mel_spectrogram=mel.tolist() if audio_present and mel is not None else None,
                lip_heatmaps=lip_hmaps_b64,
                sync_metric=None,
                sync_series_audio=None,
                sync_series_mouth=None,
            )

            # Compute AV sync metric for model section
            fps, total, duration = get_video_props(tmp_path)
            times = np.linspace(0, max(1e-6, duration), cfg.NUM_FRAMES, endpoint=False)
            mouth_open = compute_mouth_open_series(frames_rgb)
            audio_rms = compute_audio_rms_series(y, sr, times)
            sync_metric = 0.0
            if len(mouth_open) == len(audio_rms) and len(audio_rms) > 1:
                m = mouth_open - mouth_open.mean() if mouth_open.max() > 0 else mouth_open
                a = audio_rms - audio_rms.mean() if audio_rms.max() > 0 else audio_rms
                denom = (np.linalg.norm(m) * np.linalg.norm(a))
                sync_metric = float((m @ a) / (denom + 1e-8))
            model_section.sync_metric = sync_metric
            model_section.sync_series_audio = audio_rms.tolist()
            model_section.sync_series_mouth = mouth_open.tolist()

        # Multi-model ensemble prediction (if enabled)
        ensemble_result = None
        if USE_ENSEMBLE:
            try:
                ensemble = get_ensemble()
                if ensemble:
                    logger.info("Running multi-model ensemble prediction...")
                    # Save audio temporarily if present
                    audio_tmp_path = None
                    if audio_present:
                        audio_tmp_path = os.path.join(tmp_dir, f"{uuid.uuid4()}_audio.wav")
                        import soundfile as sf
                        sf.write(audio_tmp_path, y, sr)
                    
                    # Run ensemble prediction
                    # Convert frames_rgb list to format expected by ensemble
                    frames_list = [frame for frame in frames_rgb]
                    ensemble_result = ensemble.predict_ensemble(frames_list, audio_tmp_path)
                    
                    # Clean up temp audio file
                    if audio_tmp_path and os.path.exists(audio_tmp_path):
                        try:
                            os.remove(audio_tmp_path)
                        except Exception:
                            pass
                    
                    logger.info(f"Ensemble prediction: {ensemble_result['manipulation_percentage']:.2f}% ({ensemble_result['label']})")
            except Exception as e:
                logger.error(f"Ensemble prediction failed: {e}")
                ensemble_result = None

        # Laplacian section (always available)
        # Heuristic fake score from blur: more blur -> more likely fake
        heur_fake = blur_fraction
        fps, total, duration = get_video_props(tmp_path)
        lap_explain = f"blur_fraction={blur_fraction:.2f} with threshold={sharp_thresh:.0f}"
        lap_heatmaps = None
        if explain:
            lap_heatmaps = []
            sample_ids = [cfg.NUM_FRAMES // 4, cfg.NUM_FRAMES // 2, 3 * cfg.NUM_FRAMES // 4]
            for idx in sample_ids:
                gray = cv2.cvtColor(frames_rgb[idx], cv2.COLOR_RGB2GRAY)
                lap = cv2.Laplacian(gray, cv2.CV_64F)
                ab = np.absolute(lap)
                if ab.max() > 0:
                    norm = (ab / ab.max()) * 255.0
                else:
                    norm = ab
                norm8 = norm.astype(np.uint8)
                # Use a vibrant colormap for clearer visualization (similar to Streamlit look)
                color = cv2.applyColorMap(norm8, cv2.COLORMAP_TURBO)
                _, png = cv2.imencode('.png', color)
                lap_heatmaps.append(base64.b64encode(png.tobytes()).decode('utf-8'))

        lap_label = "fake" if heur_fake >= 0.5 else "real"
        lap_section = LaplacianSection(
            score=float(heur_fake),
            label=lap_label,
            sharpness_series=[float(v) for v in sharp_vals],
            sharpness_mean=sharp_mean,
            sharpness_threshold=sharp_thresh,
            blur_fraction=blur_fraction,
            overlay_heatmaps=lap_heatmaps,
            explain=lap_explain,
        )

        # Persist per-user outputs (S3-only). When S3 is disabled, skip persistence.
        # If Cognito enforcement is enabled, derive user_id from token claims.
        uid = uid_pre if VERIFIER.is_enabled() else sanitize_user_id(user_id)
        if uid:
            try:
                # Always S3-first: if S3 is enabled, do not persist locally
                import json
                session_id = str(uuid.uuid4())
                s3_base = f"user-data/{uid}/{session_id}"
                if S3_CLIENT.is_enabled():
                    # Upload original video bytes from temp file
                    try:
                        if os.path.isfile(tmp_path):
                            S3_CLIENT.upload_file(tmp_path, f"{s3_base}/{file.filename}", content_type="video/mp4")
                    except Exception:
                        pass
                    # Upload artifacts as bytes directly
                    if model_section and model_section.heatmaps:
                        for i, b64 in enumerate(model_section.heatmaps):
                            S3_CLIENT.put_bytes(base64.b64decode(b64), f"{s3_base}/model_gradcam_{i}.png", content_type="image/png")
                    if model_section and model_section.lip_heatmaps:
                        for i, b64 in enumerate(model_section.lip_heatmaps):
                            S3_CLIENT.put_bytes(base64.b64decode(b64), f"{s3_base}/lip_{i}.png", content_type="image/png")
                    if lap_heatmaps:
                        for i, b64 in enumerate(lap_heatmaps):
                            S3_CLIENT.put_bytes(base64.b64decode(b64), f"{s3_base}/lap_{i}.png", content_type="image/png")
                    response_preview = PredictResponse(
                        audio_present=audio_present,
                        video_meta={"fps": float(fps), "total_frames": int(total), "duration_sec": float(duration)},
                        model_pred=model_section,
                        laplacian_pred=lap_section,
                    )
                    S3_CLIENT.put_bytes(json.dumps(response_preview.model_dump(), ensure_ascii=False, indent=2).encode("utf-8"), f"{s3_base}/result.json", content_type="application/json")
            except Exception:
                pass

        resp = PredictResponse(
            audio_present=audio_present,
            video_meta={"fps": float(fps), "total_frames": int(total), "duration_sec": float(duration)},
            model_pred=model_section,
            laplacian_pred=lap_section,
            ensemble_enabled=ensemble_result is not None,
            manipulation_percentage=ensemble_result["manipulation_percentage"] if ensemble_result else None,
            ensemble_confidence=ensemble_result["confidence"] if ensemble_result else None,
            ensemble_label=ensemble_result["label"] if ensemble_result else None,
            model_predictions=ensemble_result["model_predictions"] if ensemble_result else None,
            consensus_details=ensemble_result["consensus_details"] if ensemble_result else None,
            agreement_matrix=ensemble_result["agreement_matrix"] if ensemble_result else None,
        )
        # Attempt to charge credits after successful processing (best-effort)
        if CREDITS.is_enabled() and uid:
            try:
                price = max(1, CREDITS.get_price())
                CREDITS.charge(uid, price, reason="video_analysis")
            except Exception:
                pass
        return resp
    finally:
        try:
            os.remove(tmp_path)
        except Exception:
            pass


@app.get("/", response_class=HTMLResponse)
async def index():
    with open(os.path.join("static", "index.html"), "r", encoding="utf-8") as f:
        return HTMLResponse(f.read())


class ImageLaplacianResponse(BaseModel):
    label: str
    sharpness_value: float
    sharpness_threshold: float
    explain: Optional[str] = None
    heatmap: Optional[str] = None


@app.post("/predict-image", response_model=ImageLaplacianResponse)
async def predict_image(
    request: Request,
    file: UploadFile = File(...),
    user_id: str | None = Form(default=None),
):
    if not file.filename.lower().endswith((".jpg", ".jpeg", ".png", ".bmp", ".webp")):
        raise HTTPException(status_code=400, detail="Please upload an image file.")
    # Optional credit pre-check
    uid_pre = None
    if VERIFIER.is_enabled():
        try:
            claims = VERIFIER.verify_bearer(request.headers.get("Authorization"))
            uid_pre = VERIFIER.derive_user_id(claims)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_or_missing_token")
    else:
        uid_pre = sanitize_user_id(user_id)
    if CREDITS.is_enabled() and uid_pre:
        try:
            CREDITS.register(uid_pre)
        except Exception:
            pass
        price = max(1, CREDITS.get_price())
        if not CREDITS.ensure_balance(uid_pre, price):
            raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="insufficient_credits")
    data = await file.read()
    image_array = np.frombuffer(data, np.uint8)
    img = cv2.imdecode(image_array, cv2.IMREAD_COLOR)
    if img is None or img.size == 0:
        raise HTTPException(status_code=422, detail="Invalid or empty image uploaded.")
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    gray = cv2.cvtColor(img_rgb, cv2.COLOR_RGB2GRAY)
    var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    threshold = 100.0
    label = "fake" if var < threshold else "real"
    explain = f"variance={var:.1f}, threshold={threshold:.1f}"
    # heatmap visualization from Laplacian magnitude
    lap = cv2.Laplacian(gray, cv2.CV_64F)
    ab = np.absolute(lap)
    if ab.max() > 0:
        norm = (ab / ab.max()) * 255.0
    else:
        norm = ab
    # Use TURBO colormap for a colorful Laplacian heatmap
    heat = cv2.applyColorMap(norm.astype(np.uint8), cv2.COLORMAP_TURBO)
    _, png = cv2.imencode('.png', heat)
    b64 = base64.b64encode(png.tobytes()).decode('utf-8')
    resp = ImageLaplacianResponse(
        label=label,
        sharpness_value=var,
        sharpness_threshold=threshold,
        explain=explain,
        heatmap=b64,
    )
    # persist user outputs if requested (S3-only). When S3 is disabled, skip persistence.
    # If Cognito enforcement is enabled, derive user_id from token claims.
    uid = uid_pre if VERIFIER.is_enabled() else sanitize_user_id(user_id)
    if uid:
        try:
            import json
            session_id = str(uuid.uuid4())
            s3_base = f"user-data/{uid}/{session_id}"
            if S3_CLIENT.is_enabled():
                # Upload original image and artifacts directly to S3
                S3_CLIENT.put_bytes(data, f"{s3_base}/{file.filename}", content_type="image/jpeg" if file.filename.lower().endswith((".jpg",".jpeg")) else "image/png")
                S3_CLIENT.put_bytes(base64.b64decode(b64), f"{s3_base}/lap_heatmap.png", content_type="image/png")
                S3_CLIENT.put_bytes(json.dumps(resp.model_dump(), ensure_ascii=False, indent=2).encode("utf-8"), f"{s3_base}/result.json", content_type="application/json")
        except Exception:
            pass
    # Attempt to charge credits after successful processing
    if CREDITS.is_enabled() and uid:
        try:
            price = max(1, CREDITS.get_price())
            CREDITS.charge(uid, price, reason="image_analysis")
        except Exception:
            pass
    return resp


# =========================
# History APIs
# =========================
class HistorySession(BaseModel):
    session_id: str
    created: float
    files: Optional[List[str]] = None


class HistoryListResponse(BaseModel):
    user_id: str
    sessions: List[HistorySession]


class Asset(BaseModel):
    name: str
    url: str


class HistoryDetailResponse(BaseModel):
    user_id: str
    session_id: str
    created: float
    result: Optional[dict] = None
    assets: List[Asset]


def _safe_session_id(sid: str) -> Optional[str]:
    # allow only hex, uuid-ish, dash, underscore
    safe = re.sub(r"[^A-Za-z0-9_-]", "_", sid)[:128]
    return safe or None


@app.get("/history/{user_id}", response_model=HistoryListResponse)
def history_list(user_id: str, request: Request):
    # Enforce that path user matches token subject when enabled
    if VERIFIER.is_enabled():
        try:
            claims = VERIFIER.verify_bearer(request.headers.get("Authorization"))
            token_uid = VERIFIER.derive_user_id(claims)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_or_missing_token")
        # Only allow access to own history
        if sanitize_user_id(user_id) != token_uid:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="forbidden")
    uid = sanitize_user_id(user_id)
    if not uid:
        return HistoryListResponse(user_id=user_id, sessions=[])
    # S3-only mode
    if S3_CLIENT.is_enabled():
        sessions: List[HistorySession] = []
        try:
            base = f"user-data/{uid}/"
            prefixes = S3_CLIENT.list_common_prefixes(base)
            for pfx in prefixes:
                # pfx like 'user-data/<uid>/<session_id>/'
                sid = pfx.rstrip('/').split('/')[-1]
                created = 0.0
                # Try to infer creation time from result.json LastModified
                items = S3_CLIENT.list_objects(pfx)
                for it in items:
                    if it.get('Key','').endswith('/result.json') and it.get('LastModified'):
                        created = float(it['LastModified'].timestamp())
                        break
                file_names = [it.get('Key','').split('/')[-1] for it in items if it.get('Key') and it.get('Key').strip().split('/')[-1]]
                sessions.append(HistorySession(session_id=sid, created=created, files=sorted(file_names)))
            sessions.sort(key=lambda x: x.created, reverse=True)
        except Exception:
            sessions = []
        return HistoryListResponse(user_id=uid, sessions=sessions)
    # If S3 is disabled, do not return local filesystem sessions (S3-only policy)
    return HistoryListResponse(user_id=uid, sessions=[])


@app.get("/history/{user_id}/{session_id}", response_model=HistoryDetailResponse)
def history_detail(user_id: str, session_id: str, request: Request):
    if VERIFIER.is_enabled():
        try:
            claims = VERIFIER.verify_bearer(request.headers.get("Authorization"))
            token_uid = VERIFIER.derive_user_id(claims)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_or_missing_token")
        if sanitize_user_id(user_id) != token_uid:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="forbidden")
    uid = sanitize_user_id(user_id)
    sid = _safe_session_id(session_id)
    if not uid or not sid:
        raise HTTPException(status_code=404, detail="Not found")
    # S3-only mode
    if S3_CLIENT.is_enabled():
        base = f"user-data/{uid}/{sid}"
        # Load JSON from S3
        res_json = None
        try:
            import json
            txt = S3_CLIENT.get_object_text(f"{base}/result.json")
            if txt:
                res_json = json.loads(txt)
        except Exception:
            res_json = None
        # Build asset URLs as presigned URLs
        assets: List[Asset] = []
        items = S3_CLIENT.list_objects(base)
        created = 0.0
        for it in items:
            key = it.get('Key','')
            if not key or key.endswith('/result.json'):
                continue
            name = key.split('/')[-1]
            url = S3_CLIENT.presigned_url(key, expires=3600) or S3_CLIENT.object_url(key) or ''
            if it.get('LastModified') and created == 0.0:
                try:
                    created = float(it['LastModified'].timestamp())
                except Exception:
                    created = 0.0
            assets.append(Asset(name=name, url=url))
        if not assets and res_json is None:
            # Nothing in S3 for this session
            raise HTTPException(status_code=404, detail="Not found")
        return HistoryDetailResponse(user_id=uid, session_id=sid, created=float(created), result=res_json, assets=assets)
    # If S3 is disabled, do not expose local filesystem sessions (S3-only policy)
    raise HTTPException(status_code=404, detail="Not found")


@app.delete("/history/{user_id}/{session_id}", status_code=status.HTTP_204_NO_CONTENT)
def history_delete_session(user_id: str, session_id: str, request: Request):
    if VERIFIER.is_enabled():
        try:
            claims = VERIFIER.verify_bearer(request.headers.get("Authorization"))
            token_uid = VERIFIER.derive_user_id(claims)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_or_missing_token")
        if sanitize_user_id(user_id) != token_uid:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="forbidden")
    uid = sanitize_user_id(user_id)
    sid = _safe_session_id(session_id)
    if not uid or not sid:
        raise HTTPException(status_code=404, detail="Not found")
    # Strict S3 deletion first (idempotent)
    if S3_CLIENT.is_enabled():
        s3_ok = False
        try:
            s3_ok = S3_CLIENT.delete_prefix(f"user-data/{uid}/{sid}")
        except Exception:
            s3_ok = False
        if not s3_ok:
            raise HTTPException(status_code=500, detail="Failed to delete session from S3")
    # Do not delete local files (S3-only policy); ignore local path if present
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)


@app.delete("/history/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def history_delete_all(user_id: str, request: Request):
    if VERIFIER.is_enabled():
        try:
            claims = VERIFIER.verify_bearer(request.headers.get("Authorization"))
            token_uid = VERIFIER.derive_user_id(claims)
        except Exception:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="invalid_or_missing_token")
        if sanitize_user_id(user_id) != token_uid:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="forbidden")
    uid = sanitize_user_id(user_id)
    if not uid:
        raise HTTPException(status_code=404, detail="Not found")
    # Strict S3 deletion first (idempotent)
    if S3_CLIENT.is_enabled():
        s3_ok = False
        try:
            s3_ok = S3_CLIENT.delete_prefix(f"user-data/{uid}")
        except Exception:
            s3_ok = False
        if not s3_ok:
            raise HTTPException(status_code=500, detail="Failed to delete user history from S3")
    # Do not delete local files (S3-only policy)
    return JSONResponse(status_code=status.HTTP_204_NO_CONTENT, content=None)

# =========================
# Apply path-strip middleware last
# =========================
if BASE_PATH_PREFIX:
    # Rebind module-level app to an ASGI wrapper that strips the prefix
    _inner = app
    app = _StripPrefixMiddleware(_inner, BASE_PATH_PREFIX)
