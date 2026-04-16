# syntax=docker/dockerfile:1
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY app/requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# Copy app
COPY app /app/app

ENV PRICE_PER_ANALYSIS=1 \
    DATABASE_PATH=/data/credits.db \
    WELCOME_CREDITS=3 \
    AD_REWARD_CREDITS=1

VOLUME ["/data"]

EXPOSE 8002

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8002"]
