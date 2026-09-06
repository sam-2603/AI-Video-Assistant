
import os
import requests
from openai import OpenAI
from pydub import AudioSegment


# ── OpenAI ────────────────────────────────────────────────────────────────────

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is not set in environment / .env")

openai_client = OpenAI(api_key=OPENAI_API_KEY)

OPENAI_STT_MODEL = "gpt-4o-mini-transcribe"


# ── Sarvam ────────────────────────────────────────────────────────────────────

SARVAM_PIECE_SECONDS = 25

SARVAM_API_KEY = os.getenv("SARVAM_API_KEY")
SARVAM_STT_TRANSLATE_URL = (
    "https://api.sarvam.ai/speech-to-text-translate"
)
SARVAM_MODEL = os.getenv("SARVAM_STT_MODEL", "saaras:v3")


# ── English: OpenAI ───────────────────────────────────────────────────────────

def transcribe_chunk_whisper(chunk_path: str) -> str:
    """
    Transcribe one audio chunk using OpenAI's low-cost
    transcription model.
    """

    print(f"Transcribing with OpenAI: {chunk_path}")

    with open(chunk_path, "rb") as audio_file:
        result = openai_client.audio.transcriptions.create(
            model=OPENAI_STT_MODEL,
            file=audio_file
        )

    return result.text.strip()


# ── Sarvam request ────────────────────────────────────────────────────────────

def _send_to_sarvam(piece_path: str) -> str:

    headers = {
        "api-subscription-key": SARVAM_API_KEY
    }

    with open(piece_path, "rb") as f:
        response = requests.post(
            SARVAM_STT_TRANSLATE_URL,
            headers=headers,
            files={
                "file": (
                    os.path.basename(piece_path),
                    f,
                    "audio/wav"
                )
            },
            data={
                "model": SARVAM_MODEL,
                "with_diarization": "false"
            },
            timeout=120
        )

    if not response.ok:
        print(f"❌ Sarvam error {response.status_code}: {response.text}")
        response.raise_for_status()

    return response.json().get("transcript", "").strip()


# ── Hinglish: Sarvam ──────────────────────────────────────────────────────────

def transcribe_chunk_sarvam(chunk_path: str) -> str:

    if not SARVAM_API_KEY:
        raise RuntimeError(
            "SARVAM_API_KEY is not set in environment / .env"
        )

    audio = AudioSegment.from_wav(chunk_path)
    piece_ms = SARVAM_PIECE_SECONDS * 1000

    transcripts = []

    for i, start in enumerate(range(0, len(audio), piece_ms)):

        piece = audio[start:start + piece_ms]
        piece_path = f"{chunk_path}_sv_{i}.wav"

        piece.export(piece_path, format="wav")

        try:
            print(f"  → Sarvam piece {i + 1} ...")
            text = _send_to_sarvam(piece_path)

            if text:
                transcripts.append(text)

        finally:
            if os.path.exists(piece_path):
                os.remove(piece_path)

    return " ".join(transcripts)


# ── Language router ───────────────────────────────────────────────────────────

def transcribe_chunk(
    chunk_path: str,
    language: str = "english"
) -> str:

    if language.lower() == "hinglish":
        return transcribe_chunk_sarvam(chunk_path)

    return transcribe_chunk_whisper(chunk_path)


# ── Full transcription ────────────────────────────────────────────────────────

def transcribe_all(
    chunks: list,
    language: str = "english"
) -> str:

    engine = (
        "Sarvam AI"
        if language.lower() == "hinglish"
        else "OpenAI"
    )

    print(f"Using {engine} for transcription.")

    transcripts = []

    for i, chunk in enumerate(chunks):

        print(f"Transcribing chunk {i + 1}/{len(chunks)}...")

        text = transcribe_chunk(
            chunk,
            language=language
        )

        if text:
            transcripts.append(text)

    print("Transcription complete.")

    return " ".join(transcripts)