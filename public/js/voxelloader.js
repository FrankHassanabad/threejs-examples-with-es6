'use strict';

const init = () => {
  // camera initial position and setup
  const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(3, 6, 3);

  // orbit controls
  const controls         = new THREE.OrbitControls(camera);
  controls.maxPolarAngle = Math.PI / 2;
  controls.minDistance   = 150;
  controls.maxDistance   = 500;

  // scene and lighting
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xfffaf0, 0.8));
  const directionalLight = new THREE.DirectionalLight(0xffeedd, 0.4);
  directionalLight.castShadow = true;
  directionalLight.position.set(20, 80, 0);
  scene.add(directionalLight);

  // initial ground white plane for the scene
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshPhongMaterial() // eslint-disable-line
  );
  plane.rotation.x    = -Math.PI / 2;
  plane.position.y    = -0.5;
  plane.receiveShadow = true;
  scene.add(plane);

  // texture and model loading
  THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
  const mtlLoader = new THREE.MTLLoader(CameraRendererUtils.createLoadingManager());

  mtlLoader.setPath('models/monu9/textures/');
  mtlLoader.load('monu9.mtl', (materials) => {
    materials.preload();
    const objLoader = new THREE.OBJLoader(CameraRendererUtils.createLoadingManager());
    objLoader.setMaterials(materials);
    objLoader.setPath('models/monu9/obj/');
    objLoader.load('monu9.obj', (object) => {
      object.position.x    = -0.4;  // eslint-disable-line no-param-reassign
      object.position.y    = -0.14; // eslint-disable-line no-param-reassign
      object.position.z    = -0.3;  // eslint-disable-line no-param-reassign
      object.castShadow    = true;  // eslint-disable-line no-param-reassign
      object.receiveShadow = true;  // eslint-disable-line no-param-reassign
      object.scale.multiplyScalar(0.5);
      scene.add(object);
    }, XhrUtils.onProgress, XhrUtils.onError);
  });

  // create and renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaInput  = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled            = true;
  renderer.shadowMap.renderReverseSided = false;

  // setup camera and render to the DOM
  const cameraRendererUtils = new CameraRendererUtils({ camera, renderer, scene });
  cameraRendererUtils.addResizeListener();
  cameraRendererUtils.animate({
    render: () => {
      controls.update();
      renderer.render(scene, camera);
    },
  });
  cameraRendererUtils.addRendererToDocument({ document });
};

// On page load, initialize
window.onload = () => init();
