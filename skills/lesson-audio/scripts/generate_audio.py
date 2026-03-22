# /// script
# requires-python = ">=3.12,<3.14"
# dependencies = [
#   "kokoro>=0.9",
#   "soundfile>=0.12",
#   "pydub>=0.25",
#   "pip",
# ]
# ///
"""
Generate MP3 narration audio for Remotion video scenes using Kokoro-82M (local TTS).

Prerequisites (one-time system install):
    brew install espeak-ng ffmpeg

Usage:
    uv run generate_audio.py --content-root content/courses --output-root frontend/public/video-audio
    uv run generate_audio.py --content-root content/courses --output-root frontend/public/video-audio --course intro-to-data-science
    uv run generate_audio.py --content-root content/courses --output-root frontend/public/video-audio --force

The audio URL prefix (written to audio_src in each video-scenes.json) is derived
from --output-root by stripping everything up to and including the first 'public'
path component. For example:
    frontend/public/video-audio  →  /video-audio
    public/audio                 →  /audio

If no 'public' component is found, the full output-root path is used with a leading '/'.
"""

import argparse
import json
from pathlib import Path

VOICE = "af_heart"      # calm, clear American English female
SAMPLE_RATE = 22050     # downsample from Kokoro's 24kHz — smaller files, fine for speech
BITRATE = "48k"         # 48 kbps mono ≈ 180 KB / 30 s — smallest with acceptable quality


def derive_audio_url_prefix(output_root: Path) -> str:
    """Derive the web-accessible URL prefix from the filesystem output path."""
    parts = output_root.parts
    if "public" in parts:
        idx = list(parts).index("public")
        suffix = "/".join(parts[idx + 1 :])
        return f"/{suffix}" if suffix else "/"
    return "/" + str(output_root)


def generate_mp3(pipeline, narration: str, out_path: Path) -> float:
    """Generate MP3 and return its duration in seconds."""
    import soundfile as sf
    from pydub import AudioSegment

    wav_path = out_path.with_suffix(".wav")
    generator = pipeline(narration, voice=VOICE)
    _, _, audio = next(generator)
    sf.write(wav_path, audio, 24000)

    segment = AudioSegment.from_wav(wav_path).set_channels(1).set_frame_rate(SAMPLE_RATE)
    segment.export(out_path, format="mp3", bitrate=BITRATE)
    wav_path.unlink()
    return round(len(segment) / 1000.0, 3)  # ms → seconds


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate MP3 narration audio from video-scenes.json files.")
    parser.add_argument("--content-root", required=True, help="Directory containing course folders (e.g. content/courses)")
    parser.add_argument("--output-root", required=True, help="Directory for output MP3 files (e.g. frontend/public/video-audio)")
    parser.add_argument("--force", action="store_true", help="Regenerate even if file exists")
    parser.add_argument("--course", help="Limit to one course slug")
    args = parser.parse_args()

    content_root = Path(args.content_root)
    output_root = Path(args.output_root)
    audio_url_prefix = derive_audio_url_prefix(output_root)

    from kokoro import KPipeline
    pipeline = KPipeline(lang_code="a")

    for scenes_file in sorted(content_root.glob("*/*/video-scenes.json")):
        data = json.loads(scenes_file.read_text())
        course_slug = data["course_slug"]
        lesson_slug = data["lesson_slug"]

        if args.course and course_slug != args.course:
            continue

        changed = False
        for scene in data["scenes"]:
            narration = scene.get("narration", "").strip()
            if not narration:
                continue

            out_path = output_root / course_slug / lesson_slug / f"{scene['id']}.mp3"
            audio_src = f"{audio_url_prefix}/{course_slug}/{lesson_slug}/{scene['id']}.mp3"

            if not args.force and out_path.exists():
                if scene.get("audio_src") != audio_src:
                    scene["audio_src"] = audio_src
                    changed = True
                continue

            out_path.parent.mkdir(parents=True, exist_ok=True)
            print(f"  generating {out_path} …")
            duration = generate_mp3(pipeline, narration, out_path)
            scene["audio_src"] = audio_src
            scene["duration_seconds"] = duration
            changed = True

        if changed:
            scenes_file.write_text(json.dumps(data, indent=2) + "\n")
            print(f"updated {scenes_file}")


if __name__ == "__main__":
    main()
