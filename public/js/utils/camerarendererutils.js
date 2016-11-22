'use strict';

class CameraRendererUtils { // eslint-disable-line no-unused-vars

  constructor({ camera, scene, renderer }) {
    this._camera   = camera;
    this._renderer = renderer;
    this._scene    = scene;
    this._mouseX   = 0;
    this._mouseY   = 0;
  }

  addListeners() {
    this.addMouseMoveListener();
    this.addResizeListener();
  }

  addResizeListener() {
    window.addEventListener('resize', () => this.onWindowResize(), false);
  }

  addMouseMoveListener() {
    document.addEventListener('mousemove', event => this.onDocumentMouseMove(event), false);
  }

  onWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._renderer.setSize(window.innerWidth, window.innerHeight);
  }

  onDocumentMouseMove(event) {
    this._mouseX = (event.clientX - (window.innerWidth / 2)) / 2;
    this._mouseY = (event.clientY - (window.innerHeight / 2)) / 2;
  }

  render() {
    this._camera.position.x += (this._mouseX - this._camera.position.x) * 0.05;
    this._camera.position.y += (-this._mouseY - this._camera.position.y) * 0.05;
    this._camera.lookAt(this._scene.position);
    this._renderer.render(this._scene, this._camera);
  }

  animate({
    render,
  } = {
    render : () => this.render(),
  }) {
    requestAnimationFrame(() => this.animate({ render }));
    render();
  }
}
