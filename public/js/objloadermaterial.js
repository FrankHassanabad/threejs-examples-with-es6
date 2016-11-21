'use strict';

const init = () => {
  // camera initial position and setup
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.z = 300;
  camera.lookAt(new THREE.Vector3());

  // scene and lighting
  const scene            = new THREE.Scene();
  const ambient          = new THREE.AmbientLight(0x404040);
  const directionalLight = new THREE.DirectionalLight(0xffeedd);
  scene.add(ambient);
  directionalLight.position.set(0, 0, 1).normalize();
  scene.add(directionalLight);

  // manager to track progress of model loading
  const manager = new THREE.LoadingManager();
  manager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

  THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
  const mtlLoader = new THREE.MTLLoader(manager);
  const xhrutils = new XhrUtils();

  // texture and model loading
  mtlLoader.setPath('models/male02/textures/');
  mtlLoader.load('male02_dds.mtl', (materials) => {
    materials.preload();
    const objLoader = new THREE.OBJLoader(manager);
    objLoader.setMaterials(materials);
    objLoader.setPath('models/male02/obj/');
    objLoader.load('male02.obj', (object) => { // eslint-disable-line no-param-reassign
      object.position.y = -95; // eslint-disable-line no-param-reassign
      scene.add(object);
    }, xhrutils.onProgress, xhrutils.onProgress);
  });

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

