import os
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import torchvision.models as models


class Config:
    DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
    NUM_FRAMES = 64
    VIDEO_SIZE = (128, 128)
    NUM_MFCC = 13
    NORM_MEAN = [0.485, 0.456, 0.406]
    NORM_STD = [0.229, 0.224, 0.225]
    EMBED_DIM = 256
    NUM_HEADS = 8
    NUM_LAYERS = 3
    DROPOUT = 0.1
    MAX_OFFSET = 5
    MFCC_FRAMES_PER_VIDEO_FRAME = 2


def get_sinusoidal_embeddings(n_position, d_hid):
    def get_position_angle_vec(position):
        return [position / np.power(10000, 2 * (hid_j // 2) / d_hid) for hid_j in range(d_hid)]
    sinusoid_table = np.array([get_position_angle_vec(pos_i) for pos_i in range(n_position)])
    sinusoid_table[:, 0::2] = np.sin(sinusoid_table[:, 0::2])
    sinusoid_table[:, 1::2] = np.cos(sinusoid_table[:, 1::2])
    return torch.FloatTensor(sinusoid_table).unsqueeze(0)


class VideoFeatureExtractor(nn.Module):
    def __init__(self, embed_dim):
        super().__init__()
        # Use architecture without downloading pretrained weights; final weights come from the .pth
        resnet = models.resnet18(weights=None)
        modules = list(resnet.children())[:-2]
        self.feature_extractor = nn.Sequential(*modules)
        self.pool = nn.AdaptiveAvgPool2d((1, 1))
        self.projection = nn.Linear(resnet.fc.in_features, embed_dim)
        for param in self.feature_extractor[:6].parameters():
            param.requires_grad = False

    def forward(self, x):
        b, t, c, h, w = x.shape
        x = x.view(b * t, c, h, w)
        features = self.feature_extractor(x)
        pooled_features = self.pool(features).view(b * t, -1)
        projected_features = self.projection(pooled_features)
        output = projected_features.view(b, t, -1)
        return output


class AudioFeatureExtractor(nn.Module):
    def __init__(self, num_mfcc, embed_dim):
        super().__init__()
        self.conv1 = nn.Conv1d(in_channels=num_mfcc, out_channels=64, kernel_size=3, padding=1)
        self.conv2 = nn.Conv1d(in_channels=64, out_channels=128, kernel_size=3, padding=1)
        self.ln = nn.LayerNorm(128)
        self.gru = nn.GRU(input_size=128, hidden_size=embed_dim, batch_first=True)

    def forward(self, x):
        x = x.transpose(1, 2)
        x = F.relu(self.conv1(x))
        x = F.relu(self.conv2(x))
        x = x.transpose(1, 2)
        x = self.ln(x)
        output, _ = self.gru(x)
        return output


class GatedCrossAttentionBlock(nn.Module):
    def __init__(self, embed_dim, num_heads, dropout):
        super().__init__()
        self.ln1 = nn.LayerNorm(embed_dim)
        self.ln2 = nn.LayerNorm(embed_dim)
        self.audio_to_video_attn = nn.MultiheadAttention(embed_dim, num_heads, dropout=dropout, batch_first=True)
        self.gate = nn.Sequential(nn.Linear(embed_dim, embed_dim), nn.Sigmoid())
        self.self_attn = nn.MultiheadAttention(embed_dim, num_heads, dropout=dropout, batch_first=True)
        self.ffn = nn.Sequential(
            nn.Linear(embed_dim, embed_dim * 4), nn.GELU(),
            nn.Dropout(dropout), nn.Linear(embed_dim * 4, embed_dim)
        )
        self.dropout = nn.Dropout(dropout)

    def forward(self, audio_feat, video_feat, video_mask=None):
        audio_norm = self.ln1(audio_feat)
        video_norm = self.ln1(video_feat)
        cross_attn_output, cross_attn_map = self.audio_to_video_attn(query=audio_norm, key=video_norm, value=video_norm, key_padding_mask=video_mask)
        audio_feat = audio_feat + self.dropout(cross_attn_output)
        gated_audio_feat = audio_feat * self.gate(audio_feat)
        gated_audio_norm = self.ln2(gated_audio_feat)
        self_attn_output, _ = self.self_attn(gated_audio_norm, gated_audio_norm, gated_audio_norm)
        gated_audio_feat = gated_audio_feat + self.dropout(self_attn_output)
        gated_audio_norm2 = self.ln2(gated_audio_feat)
        ffn_output = self.ffn(gated_audio_norm2)
        final_output = gated_audio_feat + self.dropout(ffn_output)
        return final_output, cross_attn_map


class PinpointTransformer(nn.Module):
    def __init__(self, config: Config):
        super().__init__()
        self.config = config
        self.video_extractor = VideoFeatureExtractor(config.EMBED_DIM)
        self.audio_extractor = AudioFeatureExtractor(config.NUM_MFCC, config.EMBED_DIM)
        self.video_pos_encoder = nn.Parameter(torch.randn(1, config.NUM_FRAMES, config.EMBED_DIM))
        self.gated_attention_layers = nn.ModuleList([GatedCrossAttentionBlock(config.EMBED_DIM, config.NUM_HEADS, config.DROPOUT) for _ in range(config.NUM_LAYERS)])
        self.classification_head = nn.Linear(config.EMBED_DIM, 1)
        num_offset_classes = 2 * config.MAX_OFFSET + 1
        self.offset_head = nn.Linear(config.EMBED_DIM, num_offset_classes)

    def forward(self, video, audio, video_mask=None):
        video_feat = self.video_extractor(video)
        audio_feat = self.audio_extractor(audio)
        video_feat = video_feat + self.video_pos_encoder[:, :video_feat.size(1), :]
        audio_len = audio_feat.size(1)
        audio_pos_encoding = get_sinusoidal_embeddings(audio_len, self.config.EMBED_DIM).to(audio_feat.device)
        audio_feat = audio_feat + audio_pos_encoding
        last_attention_map = None
        for layer in self.gated_attention_layers:
            audio_feat, attention_map = layer(audio_feat, video_feat, video_mask)
            last_attention_map = attention_map
        pooled_output = audio_feat.mean(dim=1)
        classification_logits = self.classification_head(pooled_output)
        offset_logits = self.offset_head(pooled_output)
        return classification_logits, offset_logits, last_attention_map


def normalize_frames(frame_rgb_uint8: np.ndarray) -> np.ndarray:
    # frame_rgb_uint8: HxWxC uint8
    x = frame_rgb_uint8.astype(np.float32) / 255.0
    mean = np.array(Config.NORM_MEAN, dtype=np.float32)
    std = np.array(Config.NORM_STD, dtype=np.float32)
    x = (x - mean) / std
    x = np.transpose(x, (2, 0, 1))  # C,H,W
    return x


def load_model(model_path: str, device: str):
    cfg = Config()
    model = PinpointTransformer(cfg).to(device)
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at {model_path}")
    state = torch.load(model_path, map_location=device)
    model.load_state_dict(state)
    model.eval()
    return model
