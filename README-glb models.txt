Drop your .glb model in this folder, named exactly:

  product.glb

That's it — the viewer in assets/js/main.js loads this path automatically,
auto-scales and centers whatever model you provide, and adds basic studio
lighting + reflections so most PBR materials look reasonable by default.

Tips:
- Keep the file reasonably optimized for the web (compressed textures,
  no more than a few MB if possible) so it loads fast on a free host.
  Tools like gltf-transform or Blender's glTF export with Draco
  compression enabled can help a lot here.
- If your model's name differs, change the path string in main.js
  inside initGlbViewer(), in the loader.load(...) call.
- If the model looks too dark or too bright, adjust
  renderer.toneMappingExposure in main.js.
