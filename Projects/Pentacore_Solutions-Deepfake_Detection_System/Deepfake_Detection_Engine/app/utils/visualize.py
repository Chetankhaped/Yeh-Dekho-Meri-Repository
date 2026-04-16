import numpy as np
import torch
import cv2
from torch.cuda.amp import autocast


def grad_cam_heatmap(model, frames_tensor, mfcc_tensor, target_frame_idx, device, cfg):
    """
    Compute a Grad-CAM-like heatmap for a specific frame index.
    frames_tensor: Tensor[T,C,H,W] pre-normalized
    mfcc_tensor: Tensor[Ta, n_mfcc]
    Returns float32 heatmap in [0,1] with shape (H,W)
    """
    model.eval()
    # ensure tensors are appropriate
    video = frames_tensor.clone().detach().to(device).requires_grad_(True)
    audio = mfcc_tensor.clone().detach().unsqueeze(0).to(device)

    feature_maps = []
    gradients = []

    # target resnet layer (layer3) inside feature extractor
    try:
        target_layer = model.video_extractor.feature_extractor[6]
    except Exception:
        # fallback to the last layer if index differs
        target_layer = list(model.video_extractor.feature_extractor.children())[-1]

    def fw_hook(module, inp, out):
        feature_maps.append(out)

    def bw_hook(module, grad_in, grad_out):
        gradients.append(grad_out[0])

    h1 = target_layer.register_forward_hook(fw_hook)
    # use full backward hook for modern torch
    try:
        h2 = target_layer.register_full_backward_hook(bw_hook)
    except Exception:
        h2 = target_layer.register_backward_hook(bw_hook)

    H, W = cfg.VIDEO_SIZE
    default_heatmap = np.zeros((H, W), dtype=np.float32)

    try:
        with torch.enable_grad(), autocast():
            cls_logits, offset_logits, _ = model(video.unsqueeze(0), audio)

        if offset_logits is None or offset_logits.numel() == 0 or not feature_maps:
            return default_heatmap

        pred_off = torch.argmax(offset_logits, dim=1).item()
        model.zero_grad(set_to_none=True)
        offset_logits[0, pred_off].backward()

        if not gradients:
            return default_heatmap

        fmap = feature_maps[0]
        grad = gradients[0]
        # fmap shape: (B*T, C, Hf, Wf) or (B?, C, Hf, Wf) depending on sequential view
        # In our model, video was reshaped inside forward: view(b*t, c, h, w)
        # We can infer number of frames from input
        Bt, C, Hf, Wf = fmap.shape
        t = video.shape[0]
        if Bt % t != 0:
            # unexpected, fallback
            return default_heatmap
        fmap_t = fmap.view(t, C, Hf, Wf)[target_frame_idx].detach()
        grad_t = grad.view(t, C, Hf, Wf)[target_frame_idx].detach()

        weights = torch.mean(grad_t, dim=(1, 2))  # C
        cam = torch.zeros((Hf, Wf), dtype=fmap_t.dtype, device=fmap_t.device)
        for i in range(C):
            cam += weights[i] * fmap_t[i]
        cam = torch.relu(cam)
        cam = cam - cam.min()
        if cam.max() > 0:
            cam = cam / cam.max()
        cam_np = cam.detach().cpu().numpy()
        cam_np = cv2.resize(cam_np, (W, H), interpolation=cv2.INTER_CUBIC)
        return cam_np.astype(np.float32)
    except Exception:
        return default_heatmap
    finally:
        try:
            h1.remove()
        except Exception:
            pass
        try:
            h2.remove()
        except Exception:
            pass
