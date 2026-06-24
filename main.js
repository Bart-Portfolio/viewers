import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

/* ===========================================================
   SHARED / MISC UI
=========================================================== */
document.getElementById('year').textContent = new Date().getFullYear();

/* ===========================================================
   VIEWER 01 — 360° FRAME SEQUENCE
=========================================================== */
(function init360Viewer(){
  const FRAME_COUNT = 36; // expects assets/360/frame_001.jpg ... frame_036.jpg
  const FRAME_PATH = (i) => `assets/360/frame_${String(i).padStart(3,'0')}.jpg`;

  const viewerEl = document.getElementById('viewer-360');
  const imgEl = document.getElementById('frame-img');
  const slider = document.getElementById('frame-slider');
  const frameReadout = document.getElementById('frame-readout');
  const dragHint = document.getElementById('drag-hint');

  slider.max = FRAME_COUNT - 1;

  let currentFrame = 0;
  let isDragging = false;
  let startX = 0;
  let startFrame = 0;
  const DRAG_SENSITIVITY = 4; // px per frame step

  // preload frames so dragging feels instant
  const imgCache = new Array(FRAME_COUNT);
  function preload(){
    for(let i=0;i<FRAME_COUNT;i++){
      const im = new Image();
      im.src = FRAME_PATH(i+1);
      imgCache[i] = im;
    }
  }
  preload();

  function setFrame(index){
    currentFrame = ((index % FRAME_COUNT) + FRAME_COUNT) % FRAME_COUNT;
    imgEl.src = FRAME_PATH(currentFrame + 1);
    slider.value = currentFrame;
    frameReadout.textContent = `Frame ${currentFrame + 1} / ${FRAME_COUNT}`;
  }

  function markInteracted(){
    viewerEl.classList.add('interacted');
  }

  // pointer drag
  viewerEl.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startFrame = currentFrame;
    viewerEl.setPointerCapture(e.pointerId);
    markInteracted();
  });

  viewerEl.addEventListener('pointermove', (e) => {
    if(!isDragging) return;
    const dx = e.clientX - startX;
    const frameDelta = Math.round(dx / DRAG_SENSITIVITY);
    setFrame(startFrame - frameDelta);
  });

  viewerEl.addEventListener('pointerup', (e) => {
    isDragging = false;
    try{ viewerEl.releasePointerCapture(e.pointerId); }catch(_){}
  });
  viewerEl.addEventListener('pointercancel', () => { isDragging = false; });

  // slider control
  slider.addEventListener('input', () => {
    markInteracted();
    setFrame(parseInt(slider.value, 10));
  });

  setFrame(0);

  // graceful fallback if images are missing
  imgEl.addEventListener('error', () => {
    frameReadout.textContent = 'No sequence found';
    dragHint.innerHTML = `<span>Drop frame_001.png…frame_020.png into <code>assets/360/</code></span>`;
    dragHint.style.opacity = '1';
  }, { once: true });
})();


/* ===========================================================
   VIEWER 02 — THREE.JS GLB MODEL VIEWER
=========================================================== */
(function initGlbViewer(){
  const canvas = document.getElementById('glb-canvas');
  const wrap = document.getElementById('viewer-glb');
  const loaderEl = document.getElementById('glb-loader');
  const loaderFill = document.getElementById('loader-fill');
  const loaderText = document.getElementById('loader-text');
  const modelReadout = document.getElementById('model-readout');

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = null;

  const camera = new THREE.PerspectiveCamera(40, 1, 0.01, 100);
  camera.position.set(2.2, 1.4, 2.8);

  // soft studio environment for believable reflections on most PBR materials
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const keyLight = new THREE.DirectionalLight(0xfff4e8, 1.6);
  keyLight.position.set(4, 6, 4);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0xc9482e, 0.5);
  rimLight.position.set(-4, 2, -3);
  scene.add(rimLight);

  scene.add(new THREE.AmbientLight(0xffffff, 0.3));

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.5;
  controls.maxDistance = 12;
  controls.target.set(0, 0.4, 0);

  function resize(){
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function frameObject(object){
    const box = new THREE.Box3().setFromObject(object);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 1.6 / maxDim;
    object.scale.setScalar(scale);

    // re-measure after scaling, then re-center
    const box2 = new THREE.Box3().setFromObject(object);
    const center2 = box2.getCenter(new THREE.Vector3());
    object.position.sub(center2);

    controls.target.set(0, 0, 0);
    camera.position.set(1.8, 1.2, 2.2);
    camera.lookAt(0, 0, 0);
  }

  const loader = new GLTFLoader();
  loader.load(
    'assets/models/product.glb',
    (gltf) => {
      const model = gltf.scene;
      model.traverse((child) => {
        if(child.isMesh){
          child.castShadow = false;
          child.receiveShadow = false;
        }
      });
      frameObject(model);
      scene.add(model);

      loaderEl.classList.add('hidden');
      modelReadout.textContent = 'product.glb — live';
    },
    (xhr) => {
      if(xhr.total){
        const pct = Math.round((xhr.loaded / xhr.total) * 100);
        loaderFill.style.width = pct + '%';
        loaderText.textContent = pct + '%';
      }
    },
    (err) => {
      loaderText.textContent = 'Model not found';
      modelReadout.textContent = 'No model loaded';
      console.warn('GLB load error — add your file at assets/models/product.glb', err);

      // show a placeholder so the rig still feels alive
      const placeholder = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.9, 0),
        new THREE.MeshStandardMaterial({ color: 0xC9482E, roughness: 0.35, metalness: 0.1, wireframe: true })
      );
      scene.add(placeholder);
      frameObject(placeholder);
      loaderEl.classList.add('hidden');
    }
  );

  function animate(){
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
})();
