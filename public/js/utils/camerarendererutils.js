'use strict';

/**
 * Camera Rendering Utilities to reduce common example actions into single one-liners instead of
 * repeating code.
 */
class CameraRendererUtils { // eslint-disable-line no-unused-vars

  /**
   * Construct the render utilities with a camera, scene, and renderer. Sets the mouseX and the
   * mouseY to zero by default.
   * @param {Object} camera   ThreeJS Camera
   * @param {Object} scene    ThreeJS scene
   * @param {Object} renderer ThreeJS renderer
   */
  constructor({ camera, scene, renderer }) {
    this._camera   = camera;
    this._renderer = renderer;
    this._scene    = scene;
    this._mouseX   = 0;
    this._mouseY   = 0;
  }

  /**
   * Add the mouse move listener and the resize listener for the example.
   * @return {void}
   */
  addListeners() {
    this.addMouseMoveListener();
    this.addResizeListener();
  }

  /**
   * Adds the resize listener which in turn calls onWindowResize.
   * @return {void}
   */
  addResizeListener() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  /**
   * Adds the mouse move listener which in turn calls onDocumentMouseMove
   * @return {void}
   */
  addMouseMoveListener() {
    document.addEventListener('mousemove', event => this.onDocumentMouseMove(event), false);
  }

  /**
   * Window resize which will set the camera aspect, update the projection matrix and set the
   * renderer size.
   * @return {void}
   */
  onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  /**
   * Document mouse move which sets the mouseX and the mouseY position based on where the mouse is
   * at during the movement.
   * @param {Object} event The mouse event
   * @return {void}
   */
  onDocumentMouseMove(event) {
    this._mouseX = (event.clientX - (window.innerWidth / 2)) / 2;
    this._mouseY = (event.clientY - (window.innerHeight / 2)) / 2;
  }

  /**
   * Renders the scene by setting what the camera should look at based on the mouseX and mouseY
   * position.
   * @return {void}
   */
  render() {
    this._camera.position.x += (this._mouseX - this._camera.position.x) * 0.05;
    this._camera.position.y += (-this._mouseY - this._camera.position.y) * 0.05;
    this._camera.lookAt(this._scene.position);
    this._renderer.render(this._scene, this._camera);
  }

  /**
   * Creates a loading Manager to output to the console the item, loaded, and total time taken.
   * Use this with any of the loads such as the PLYLoader, MTLLoader, etc...
   * @return {void}
   */
  static createLoadingManager() {
    const manager      = new THREE.LoadingManager();
    manager.onProgress = (item, loaded, total) => console.log(item, loaded, total);
    return manager;
  }

  /**
   * Add the current renderer to a document passed in.
   * @param {Object} document The DOM Document to add the renderer to.
   * @return {void}
   */
  addRendererToDocument({ document }) {
    const container = document.createElement('div');
    document.body.appendChild(container);
    container.appendChild(this._renderer.domElement);
  }

  /**
   * Animate the scene by calling requestAnimationFrame on the renderer. You can pass in a
   * renderer, but optionally you can leave it off and it will call this current renderer.
   * @param {Object} render The optional render function to pass in.
   * @return {void}
   */
  animate({
    render,
  } = {
    render : () => this.render(),
  }) {
    requestAnimationFrame(() => this.animate({ render }));
    render();
  }
}
