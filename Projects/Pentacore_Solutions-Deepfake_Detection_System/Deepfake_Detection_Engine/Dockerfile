# syntax=docker/dockerfile:1.7-labs

FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# System deps (cached with BuildKit)
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
        --mount=type=cache,target=/var/lib/apt,sharing=locked \
        apt-get update && apt-get install -y --no-install-recommends \
            ffmpeg \
            libsndfile1 \
            libglib2.0-0 libsm6 libxrender1 libxext6 \
        && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps first (cache)
COPY app/requirements.txt /app/requirements.txt
# Use pip cache to speed up rebuilds; install CPU-only PyTorch from official index
RUN --mount=type=cache,target=/root/.cache/pip,sharing=locked \
    pip install --no-cache-dir -r /app/requirements.txt && \
    pip install --no-cache-dir --index-url https://download.pytorch.org/whl/cpu torch==2.3.1 torchvision==0.18.1

# Copy app code
COPY app /app
# Model file is provided via mounted volume or baked separately; path is configured via MODEL_PATH env var

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
