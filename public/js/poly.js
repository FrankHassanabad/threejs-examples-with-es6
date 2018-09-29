'use strict';

const addShadowedLight = ({
  x, y, z, color, intensity, scene,
}) => {
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
  const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 1, 15);
  const cameraTarget = new THREE.Vector3(0, -0.1, 0);
  camera.position.set(3, 0.15, 3);

  // scene and lighting
  const scene = new THREE.Scene();
  scene.fog   = new THREE.Fog(0x72645b, 2, 15);

  // create the ground and add it to the scene
  const plane = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(40, 40),
    new THREE.MeshPhongMaterial({ color: 0x999999, specular: 0x101010 }) // eslint-disable-line
  );
  plane.rotation.x    = -Math.PI / 2;
  plane.position.y    = -0.5;
  plane.receiveShadow = true;
  scene.add(plane);

  // PLY load dolphins
  const loader = new THREE.PLYLoader(CameraRendererUtils.createLoadingManager());
  loader.load('models/dolphins/dolphins.ply', (geometry) => {
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color   : 0x0055ff,
      shading : THREE.FlatShading,
    });
    const mesh         = new THREE.Mesh(geometry, material);
    mesh.position.y    = -0.2;
    mesh.position.z    = 0.3;
    mesh.rotation.x    = -Math.PI / 2;
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    mesh.scale.multiplyScalar(0.001);

    scene.add(mesh);
  }, XhrUtils.onProgress, XhrUtils.onError);

  // PLY load Lucy
  loader.load('models/lucy/Lucy100k.ply', (geometry) => {
    geometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color   : 0x0055ff,
      shading : THREE.FlatShading,
    });
    const mesh         = new THREE.Mesh(geometry, material);
    mesh.position.x    = -0.4;
    mesh.position.y    = -0.14;
    mesh.position.z    = -0.3;
    mesh.rotation.x    = -Math.PI / 2;
    mesh.castShadow    = true;
    mesh.receiveShadow = true;
    mesh.scale.multiplyScalar(0.0006);
    scene.add(mesh);
  }, XhrUtils.onProgress, XhrUtils.onError);

  // Lights
  scene.add(new THREE.HemisphereLight(0x443333, 0x111122));
  addShadowedLight({
    x: 1, y: 1, z: 1, color: 0xffffff, intensity: 1.35, scene,
  });
  addShadowedLight({
    x: 0.5, y: 1, z: -1, color: 0xffaa00, intensity: 1, scene,
  });

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setClearColor(scene.fog.color);
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
      const timer = Date.now() * 0.0005;
      camera.position.x = Math.sin(timer) * 2.5;
      camera.position.z = Math.cos(timer) * 2.5;
      camera.lookAt(cameraTarget);
      renderer.render(scene, camera);
    },
  });
  cameraRendererUtils.addRendererToDocument({ document });
};

// On page load, initialize
window.onload = () => init();
