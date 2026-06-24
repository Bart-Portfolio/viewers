Drop your 360° rotation frames in this folder.

Expected naming:
  frame_001.png
  frame_002.png
  ...
  frame_020.png

Notes:
- The viewer is set up for 20 frames (18° per frame) by default.
  If you have a different count, open assets/js/main.js and change
  the FRAME_COUNT constant near the top of the init360Viewer function.
- PNG works well if you need transparency or crisp edges. If your
  frames are JPG instead, change the extension in the FRAME_PATH
  function in main.js back to .jpg.
- Keep frame dimensions consistent across the sequence and square-ish
  (or matching) aspect ratio for the smoothest look.
- For file size, 800–1200px on the long edge is usually plenty for web.
