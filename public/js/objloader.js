'use strict';

const init = () => {
  // camera initial position and setup
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 250;

  // scene and lighting
  const scene            = new THREE.Scene();
  const ambient          = new THREE.AmbientLight(0x101030);
  const directionalLight = new THREE.DirectionalLight(0xffeedd);
  directionalLight.position.set(0, 0, 1);
  scene.add(ambient);
  scene.add(directionalLight);

  // manager to track progress of model loading
  const manager = new THREE.LoadingManager();
  manager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

  const texture  = new THREE.Texture();
  const xhrutils = new XhrUtils();

  // image to wrap the model (jpg)
  const imageLoader  = new THREE.ImageLoader(manager);
  imageLoader.load('models/male02/textures/UV_Grid_Sm.jpg', (image) => {
    texture.image       = image;
    texture.needsUpdate = true;
  }, xhrutils.onProgress, xhrutils.onError);

  // load the 3D model (obj)
  const objLoader = new THREE.OBJLoader(manager);
  objLoader.load('models/male02/obj/male02.obj', (object) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture; // eslint-disable-line no-param-reassign
      }
    });
    object.position.y = -95; // eslint-disable-line no-param-reassign
    scene.add(object);
  }, xhrutils.onProgress, xhrutils.onProgress);

  // create the renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // camera utils and init of listeners
  const cameraRendererUtils = new CameraRendererUtils({ camera, renderer, scene });
  cameraRendererUtils.addListeners();
  cameraRendererUtils.animate();

  // create the container and add the renderer
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);
};

// On page load, initialize
window.onload = () => init();
