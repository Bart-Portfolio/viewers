Drop your converted video files in this folder, named exactly:

  reel.mp4     ← H.264, for Chrome / Firefox / Safari / Edge
  reel.webm    ← VP9, for Chrome / Firefox (smaller file size)

The page tries WebM first (smaller), then falls back to MP4.
Both <source> tags are included so at least one will always play.

───────────────────────────────────────────────────
CONVERTING YOUR MKV FILE
───────────────────────────────────────────────────

The easiest way is ffmpeg (free, command-line). Install it from:
  https://ffmpeg.org/download.html

Then run these two commands in the same folder as your .mkv file:

  To MP4 (H.264):
  ───────────────
  ffmpeg -i your-animation.mkv -c:v libx264 -crf 23 -preset slow -an -movflags +faststart reel.mp4

  To WebM (VP9):
  ──────────────
  ffmpeg -i your-animation.mkv -c:v libvpx-vp9 -crf 33 -b:v 0 -an reel.webm

Flags explained:
  -an             removes audio (the video autoplays muted on the page)
  -crf 23         quality level for MP4 (lower = better, 18–28 is normal range)
  -crf 33         quality level for WebM (lower = better, 30–40 is normal range)
  -movflags +faststart  lets the MP4 start playing before fully downloaded
  -preset slow    slower encode = better compression at same quality (worth it for web)

If your animation is very long or very high resolution, increase the CRF value
slightly (e.g. -crf 26 for MP4) to keep the file size reasonable for web.

───────────────────────────────────────────────────
ALTERNATIVE: HandBrake (GUI, no command line)
───────────────────────────────────────────────────
  https://handbrake.fr/
  Use the "Web" preset, set format to MP4, and remove the audio track.
  WebM is not supported in HandBrake — use ffmpeg for the WebM version.
