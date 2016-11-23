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

  // image to wrap the model (jpg)
  const imageLoader = new THREE.ImageLoader(CameraRendererUtils.createLoadingManager());
  const texture     = new THREE.Texture();
  imageLoader.load('models/male02/textures/UV_Grid_Sm.jpg', (image) => {
    texture.image       = image;
    texture.needsUpdate = true;
  }, XhrUtils.onProgress, XhrUtils.onError);

  // load the 3D model (obj)
  const objLoader = new THREE.OBJLoader(CameraRendererUtils.createLoadingManager());
  objLoader.load('models/male02/obj/male02.obj', (object) => {
    object.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = texture; // eslint-disable-line no-param-reassign
      }
    });
    object.position.y = -95; // eslint-disable-line no-param-reassign
    scene.add(object);
  }, XhrUtils.onProgress, XhrUtils.onError);

  // create the renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // setup camera and render to the DOM
  const cameraRendererUtils = new CameraRendererUtils({ camera, renderer, scene });
  cameraRendererUtils.addListeners();
  cameraRendererUtils.animate();
  cameraRendererUtils.addRendererToDocument({ document });
};

// On page load, initialize
window.onload = () => init();
