import numpy as np
import cv2
import subprocess
import os
import librosa
import math


def extract_uniform_frames(video_path: str, num_frames: int = 64, size=(128, 128)):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return []
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames < num_frames:
        cap.release()
        return []
    idxs = np.linspace(0, total_frames - 1, num_frames, dtype=int)
    frames = []
    for i in idxs:
        cap.set(cv2.CAP_PROP_POS_FRAMES, int(i))
        ret, frame = cap.read()
        if not ret:
            continue
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = cv2.resize(frame, size)
        frames.append(frame)
    cap.release()
    return frames


def compute_mfcc_from_video(video_path: str, n_mfcc: int = 13):
    """Return MFCC as numpy array T_a x n_mfcc using ffmpeg + librosa for robust audio handling in Docker."""
    y, sr = extract_audio_waveform(video_path, target_sr=16000)
    if y.size == 0 or sr is None:
        return np.zeros((0, n_mfcc), dtype=np.float32)
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    return mfcc.T.astype(np.float32)


def extract_audio_waveform(video_path: str, target_sr: int = 16000):
    """Extract mono waveform from video using ffmpeg, load with librosa. Returns (y, sr)."""
    tmp_wav = video_path + ".tmp.wav"
    try:
        subprocess.run([
            "ffmpeg", "-y", "-i", video_path, "-vn", "-ac", "1", "-ar", str(target_sr), tmp_wav
        ], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        y, sr = librosa.load(tmp_wav, sr=None, mono=True)
        if y is None:
            return np.zeros((0,), dtype=np.float32), None
        return y.astype(np.float32), sr
    except Exception:
        return np.zeros((0,), dtype=np.float32), None
    finally:
        if os.path.exists(tmp_wav):
            try:
                os.remove(tmp_wav)
            except Exception:
                pass


def get_video_props(video_path: str):
    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return 0.0, 0, 0.0
    fps = cap.get(cv2.CAP_PROP_FPS) or 0.0
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    cap.release()
    duration = (total / fps) if fps > 0 else 0.0
    return fps, total, duration


def compute_audio_rms_series(y: np.ndarray, sr: int, times: np.ndarray, window_sec: float = 0.08) -> np.ndarray:
    """Compute normalized RMS envelope sampled at given times."""
    if y.size == 0 or sr is None or sr <= 0:
        return np.zeros((len(times),), dtype=np.float32)
    half = int(window_sec * sr / 2)
    rms_vals = []
    for t in times:
        center = int(t * sr)
        a = max(0, center - half)
        b = min(len(y), center + half)
        seg = y[a:b]
        if seg.size == 0:
            rms_vals.append(0.0)
        else:
            rms = math.sqrt(float(np.mean(seg.astype(np.float32) ** 2)))
            rms_vals.append(rms)
    arr = np.array(rms_vals, dtype=np.float32)
    if arr.max() > 1e-8:
        arr = (arr - arr.min()) / (arr.max() - arr.min() + 1e-8)
    return arr


def compute_mouth_open_series(frames_rgb: list) -> np.ndarray:
    """Estimate mouth openness per frame using MediaPipe Face Mesh (indexes 13/14 along midline)."""
    try:
        import mediapipe as mp
    except Exception:
        return np.zeros((len(frames_rgb),), dtype=np.float32)

    mp_face = mp.solutions.face_mesh
    opens = []
    with mp_face.FaceMesh(static_image_mode=True, max_num_faces=1, refine_landmarks=False, min_detection_confidence=0.5) as face_mesh:
        for img in frames_rgb:
            h, w, _ = img.shape
            res = face_mesh.process(cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
            if not res.multi_face_landmarks:
                opens.append(0.0)
                continue
            lm = res.multi_face_landmarks[0].landmark
            # Use 13 (upper lip) and 14 (lower lip) from FaceMesh topology
            try:
                y_top = lm[13].y * h
                y_bot = lm[14].y * h
                # normalize by face height approximated by distance 10 (forehead) to 152 (chin)
                y_fore = lm[10].y * h
                y_chin = lm[152].y * h
                face_h = max(1.0, abs(y_chin - y_fore))
                openness = max(0.0, (y_bot - y_top) / face_h)
            except Exception:
                openness = 0.0
            opens.append(float(openness))
    arr = np.array(opens, dtype=np.float32)
    if arr.max() > 1e-6:
        arr = (arr - arr.min()) / (arr.max() - arr.min() + 1e-8)
    return arr
