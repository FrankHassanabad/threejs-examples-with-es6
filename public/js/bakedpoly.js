'use strict';

const addShadowedLight = ({ x, y, z, color, intensity, scene }) => {
  const directionalLight = new THREE.DirectionalLight(color, intensity);
  directionalLight.position.set(x, y, z);
  directionalLight.castShadow            = true;
  directionalLight.shadow.camera.left    = -1;
  directionalLight.shadow.camera.right   = 1;
  directionalLight.shadow.camera.top     = 1;
  directionalLight.shadow.camera.bottom  = -1;
  directionalLight.shadow.camera.near    = 1;
  directionalLight.shadow.camera.far     = 4;
  directionalLight.shadow.mapSize.width  = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  directionalLight.shadow.bias           = -0.005;
  scene.add(directionalLight);
};

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
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xfffaf0, 0.5));
  scene.add(new THREE.AmbientLight(0xfffaf0, 0.5));

  // initial ground white plane for the scene
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshPhongMaterial());
  plane.rotation.x    = -Math.PI / 2;
  plane.position.y    = -0.5;
  plane.receiveShadow = true;
  scene.add(plane);

  // manager to track progress of model loading
  const manager      = new THREE.LoadingManager();
  manager.onProgress = (item, loaded, total) => console.log(item, loaded, total);

  // PLY file loading
  const loader    = new THREE.PLYLoader(manager);
  const xhrutils  = new XhrUtils();

  // fully baked model loading
  loader.load('models/monu9/obj/monu9.bake.ply', (obj) => {
    obj.computeVertexNormals();
    const material = new THREE.MeshPhongMaterial({
      vertexColors : THREE.VertexColors,
    });
    const mesh         = new THREE.Mesh(obj, material);
    mesh.position.x    = -0.4;
    mesh.position.y    = -0.14;
    mesh.position.z    = -0.3;
    mesh.rotation.x    = -Math.PI / 2;
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }, xhrutils.onProgress, xhrutils.onError);

  // create and renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.gammaInput  = true;
  renderer.gammaOutput = true;
  renderer.shadowMap.enabled            = true;
  renderer.shadowMap.renderReverseSided = false;

  // camera utils and init of listeners
  const cameraRendererUtils = new CameraRendererUtils({ camera, renderer, scene });
  cameraRendererUtils.addResizeListener();
  cameraRendererUtils.animate({
    render: () => {
      controls.update();
      renderer.render(scene, camera);
    },
  });

  // create the container and add the renderer
  const container = document.createElement('div');
  document.body.appendChild(container);
  container.appendChild(renderer.domElement);
};

// On page load, initialize
window.onload = () => init();
