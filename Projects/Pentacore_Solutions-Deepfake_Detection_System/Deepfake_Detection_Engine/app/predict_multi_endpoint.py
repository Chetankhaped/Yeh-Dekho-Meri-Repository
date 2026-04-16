"""
Enhanced main.py with Multi-Model Deepfake Detection

This adds TensorFlow model ensemble predictions alongside the existing Pinpoint Transformer.
"""

# Add this import at the top with other imports
from models.tf_model_loader import TensorFlowModelLoader

# Add this new response model after the existing ModelSection
class TFModelPrediction(BaseModel):
    """Individual TensorFlow model prediction"""
    model_name: str
    model_key: str
    confidence: float
    label: str
    manipulation_percentage: float
    weight: float


class EnsembleSection(BaseModel):
    """Ensemble prediction from multiple TensorFlow models"""
    manipulation_percentage: float
    label: str
    confidence_level: str  # very_low, low, medium, high, very_high
    agreement: float  # 0-1, how many models agree
    individual_predictions: List[TFModelPrediction]
    model_count: int


# Update the PredictResponse to include ensemble predictions
class EnhancedPredictResponse(BaseModel):
    audio_present: bool
    video_meta: Optional[dict] = None
    model_pred: Optional[ModelSection] = None  # Pinpoint Transformer
    ensemble_pred: Optional[EnsembleSection] = None  # TensorFlow models ensemble
    laplacian_pred: LaplacianSection
    model_config = {"protected_namespaces": ()}


# Initialize TensorFlow model loader (global, lazy loading)
_tf_loader = None

def get_tf_loader():
    """Get or initialize the TensorFlow model loader"""
    global _tf_loader
    if _tf_loader is None:
        # Use relative path from app directory
        model_base = os.path.join(os.path.dirname(__file__), "..", "pretrained-models-code")
        _tf_loader = TensorFlowModelLoader(model_base_path=model_base)
    return _tf_loader


@app.post("/predict_multi", response_model=EnhancedPredictResponse)
async def predict_multi(
    request: Request,
    file: UploadFile = File(...),
    explain: bool = Form(default=True),
    user_id: str | None = Form(default=None),
    use_ensemble: bool = Form(default=True),  # Enable/disable TF ensemble
):
    """
    Enhanced prediction endpoint with multi-model ensemble.
    
    This endpoint includes:
    1. Pinpoint Transformer (audio-visual) - existing model
    2. TensorFlow Ensemble (image-based) - EfficientNet-B4, ResNet-50, VGG-16, InceptionV3
    3. Laplacian sharpness analysis - existing heuristic
    
    Args:
        file: Video file to analyze
        explain: Generate visual explanations (heatmaps, etc.)
        user_id: User identifier for credit tracking
        use_ensemble: Whether to run TensorFlow ensemble (set False for faster processing)
    
    Returns:
        EnhancedPredictResponse with all predictions
    """
    if not file.filename.lower().endswith((".mp4", ".mov", ".avi", ".mkv", ".webm")):
        raise HTTPException(status_code=400, detail="Please upload a video file.")

    # Credit and authentication handling (same as original /predict)
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

    # Save upload to temp file (same as original)
    tmp_dir = "tmp"
    os.makedirs(tmp_dir, exist_ok=True)
    tmp_path = os.path.join(tmp_dir, f"{uuid.uuid4()}_{file.filename}")
    bytes_limit = MAX_UPLOAD_MB * 1024 * 1024
    total = 0
    CHUNK = 8 * 1024 * 1024
    
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
        try:
            await file.close()
        except Exception:
            pass

    try:
        cfg = Config()
        
        # Extract frames (same as original)
        frames_rgb = extract_uniform_frames(tmp_path, num_frames=cfg.NUM_FRAMES, size=cfg.VIDEO_SIZE)
        if len(frames_rgb) != cfg.NUM_FRAMES:
            raise HTTPException(status_code=422, detail="Could not extract enough frames from video.")
        
        frames_tensor = torch.from_numpy(np.stack([normalize_frames(fr) for fr in frames_rgb])).float()
        
        # Extract audio features (same as original)
        y, sr = extract_audio_waveform(tmp_path, target_sr=16000)
        audio_present = bool(y.size > 0 and sr)
        mfcc = compute_mfcc_from_video(tmp_path, n_mfcc=cfg.NUM_MFCC) if audio_present else np.zeros((0, cfg.NUM_MFCC), dtype=np.float32)
        
        mel = None
        if audio_present:
            import librosa
            S = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=64, fmax=sr//2)
            mel = librosa.power_to_db(S, ref=np.max).astype(np.float32)

        # Compute sharpness (same as original)
        sharp_vals: List[float] = []
        for fr in frames_rgb:
            gray = cv2.cvtColor(fr, cv2.COLOR_RGB2GRAY)
            var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
            sharp_vals.append(var)
        
        sharp_arr = np.array(sharp_vals, dtype=np.float32)
        sharp_mean = float(sharp_arr.mean()) if sharp_arr.size else 0.0
        sharp_thresh = 100.0
        blur_fraction = float(((sharp_arr < sharp_thresh).sum() / max(1, len(sharp_vals))))

        # ========== PINPOINT TRANSFORMER PREDICTION (EXISTING) ==========
        model_section: Optional[ModelSection] = None
        attn = None
        frame_ids = [cfg.NUM_FRAMES // 4, cfg.NUM_FRAMES // 2, 3 * cfg.NUM_FRAMES // 4]
        
        if audio_present:
            model = get_model()
            model.eval()
            with torch.no_grad():
                video = frames_tensor.unsqueeze(0).to(_device)
                audio = torch.from_numpy(mfcc).unsqueeze(0).to(_device)
                video_mask = torch.zeros(cfg.NUM_FRAMES, dtype=torch.bool, device=_device).unsqueeze(0)
                cls_logits, offset_logits, attn = model(video, audio, video_mask)
                prob_fake = float(torch.sigmoid(cls_logits).item())

            if attn is not None:
                att = attn.squeeze(0).detach().cpu().numpy()
                per_frame = (att.sum(axis=0) / (att.sum() + 1e-8)).tolist()
            else:
                per_frame = [prob_fake] * cfg.NUM_FRAMES

            # Generate explanations if requested (same as original)
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
                    
                    # MediaPipe lip overlay
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

            # Compute AV sync metric
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

        # ========== TENSORFLOW ENSEMBLE PREDICTION (NEW) ==========
        ensemble_section: Optional[EnsembleSection] = None
        
        if use_ensemble:
            try:
                tf_loader = get_tf_loader()
                
                # Use a representative frame from the middle of the video
                middle_frame_idx = cfg.NUM_FRAMES // 2
                representative_frame = frames_rgb[middle_frame_idx]  # RGB format
                
                # Define models to use and their weights based on test accuracy
                model_weights = {
                    "efficientnet_b4": 0.93,
                    "resnet_50_v1": 0.91,
                    "vgg_16_v1": 0.89,
                    "inceptionv3": 0.90
                }
                
                # Run ensemble prediction
                ensemble_result = tf_loader.predict_ensemble(
                    representative_frame,
                    model_keys=list(model_weights.keys()),
                    weights=model_weights
                )
                
                # Convert to response format
                tf_predictions = []
                for model_key, pred_data in ensemble_result["individual_predictions"].items():
                    tf_predictions.append(TFModelPrediction(
                        model_name=pred_data["model_name"],
                        model_key=model_key,
                        confidence=pred_data["confidence"],
                        label=pred_data["label"],
                        manipulation_percentage=pred_data["manipulation_percentage"],
                        weight=pred_data["weight"]
                    ))
                
                ensemble_section = EnsembleSection(
                    manipulation_percentage=ensemble_result["ensemble"]["manipulation_percentage"],
                    label=ensemble_result["ensemble"]["label"],
                    confidence_level=ensemble_result["ensemble"]["confidence_level"],
                    agreement=ensemble_result["ensemble"]["agreement"],
                    individual_predictions=tf_predictions,
                    model_count=ensemble_result["model_count"]
                )
                
            except Exception as e:
                # Log error but don't fail the entire request
                import logging
                logging.error(f"TensorFlow ensemble prediction failed: {str(e)}")
                ensemble_section = None

        # ========== LAPLACIAN PREDICTION (EXISTING) ==========
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
                color = cv2.applyColorMap(norm8, cv2.COLORMAP_TURBO)
                _, png = cv2.imencode('.png', color)
                lap_heatmaps.append(base64.b64encode(png.tobytes()).decode('utf-8'))

        heur_fake = blur_fraction
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

        # ========== BUILD RESPONSE ==========
        resp = EnhancedPredictResponse(
            audio_present=audio_present,
            video_meta={"fps": float(fps), "total_frames": int(total), "duration_sec": float(duration)},
            model_pred=model_section,
            ensemble_pred=ensemble_section,
            laplacian_pred=lap_section,
        )

        # Charge credits (same as original)
        uid = uid_pre if VERIFIER.is_enabled() else sanitize_user_id(user_id)
        if CREDITS.is_enabled() and uid:
            try:
                price = max(1, CREDITS.get_price())
                CREDITS.charge(uid, price, f"deepfake-analysis:{file.filename}")
            except Exception:
                pass

        return resp

    finally:
        # Cleanup temp file
        try:
            if os.path.exists(tmp_path):
                os.unlink(tmp_path)
        except Exception:
            pass


# Keep the original /predict endpoint for backward compatibility
# Just update its doc string to mention the new /predict_multi endpoint
