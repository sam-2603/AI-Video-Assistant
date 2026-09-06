# # Backend image for the AI Video Assistant API.
# #
# # FFmpeg is required by yt-dlp (audio extraction) and pydub (format
# # conversion/chunking), and Whisper benefits from it too — it is not a pip
# # package, so it must be installed at the OS level.
# FROM python:3.11-slim

# RUN apt-get update && apt-get install -y --no-install-recommends \
#     ffmpeg \
#     git \
#     && rm -rf /var/lib/apt/lists/*

# WORKDIR /app

# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# # Render (and most PaaS) injects $PORT at runtime.
# ENV PORT=8000
# EXPOSE 8000

# CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]
# Backend image for the AI Video Assistant API.

# FFmpeg is required by yt-dlp and pydub.
FROM python:3.11-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=10000
EXPOSE 10000

CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT}"]