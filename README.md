# Product Visualization Portfolio

A small portfolio site showcasing two interactive product-exposure techniques:

1. **360° Rotation Viewer** — a drag-to-spin frame-sequence viewer (the classic
   ecommerce "spin the product" interaction), built from plain PNG photos.
2. **glTF Model Viewer** — a real-time 3D viewer built with [Three.js](https://threejs.org/),
   loading and rendering an actual `.glb` model with orbit controls and basic
   studio lighting.

No build step, no frameworks, no dependencies to install — just static
HTML/CSS/JS. Three.js itself is loaded from a CDN via an import map in
`index.html`.

## File structure

```
portfolio/
├── index.html              # Page markup for both viewer sections
├── style.css                # All styling
├── assets/
│   ├── js/
│   │   └── main.js          # Logic for both viewers
│   ├── 360/
│   │   ├── README.txt       # Setup notes for the frame sequence
│   │   └── frame_001.png … frame_020.png   ← your images go here
│   └── models/
│       ├── README.txt       # Setup notes for the GLB model
│       └── product.glb       ← your model goes here
```

## Setting up your content

### 1. 360° rotation frames
Add 20 PNG images to `assets/360/`, named exactly:
```
frame_001.png
frame_002.png
...
frame_020.png
```
See `assets/360/README.txt` for sizing tips and how to change the frame
count if you have a different number of shots.

### 2. glTF model
Add your model to `assets/models/`, named exactly:
```
product.glb
```
The viewer auto-scales and centers whatever model you drop in. See
`assets/models/README.txt` for notes on file size and lighting tweaks.

## Running locally

Because this loads JS as ES modules (`type="module"`), opening `index.html`
directly via `file://` won't work in most browsers — you need a local server.
Easiest options:

```bash
# Python 3
python -m http.server 8000

# Node (if you have npx)
npx serve
```

Then visit `http://localhost:8000` (or whatever port/URL it gives you).

## Deploying

This is a static site, so it works as-is on GitHub Pages, Netlify, Vercel,
or Cloudflare Pages — just push the whole folder, no build configuration
needed.

For GitHub Pages specifically: push to a repo, then enable Pages under
**Settings → Pages**, source **Deploy from a branch**, branch `main`,
folder `/ (root)`.

## Customizing

- **Colors / fonts**: all in `style.css`, under the `:root` CSS variables
  at the top of the file.
- **Viewer behavior**: all in `assets/js/main.js` — each viewer is set up
  in its own self-contained function (`init360Viewer`, `initGlbViewer`).
- **Copy / layout**: in `index.html` — each viewer is wrapped in a
  `<section class="product">` with a gallery side and a details side.
