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
  scene.add(new THREE.HemisphereLight(0xfffaf0, 0xfffaf0, 0.5));
  scene.add(new THREE.AmbientLight(0xfffaf0, 0.5));

  // initial ground white plane for the scene
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshPhongMaterial() // eslint-disable-line
  );
  plane.rotation.x    = -Math.PI / 2;
  plane.position.y    = -0.5;
  plane.receiveShadow = true;
  scene.add(plane);

  // PLY file loading
  const loader = new THREE.PLYLoader(CameraRendererUtils.createLoadingManager());

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
  }, XhrUtils.onProgress, XhrUtils.onError);

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
