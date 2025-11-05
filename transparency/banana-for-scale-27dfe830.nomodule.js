System.register(['./roomle-dependency-injection-f62f5de7.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js'], (function (exports) {
  'use strict';
  var ScenePluginDefaultImplementation, __decorate, inject, getAssetPath, Vector3;
  return {
    setters: [function (module) {
      ScenePluginDefaultImplementation = module.aD;
      __decorate = module._;
      inject = module.i;
    }, function (module) {
      getAssetPath = module.g;
      Vector3 = module.a;
    }],
    execute: (function () {

      var BANANA_FILE_NAME = "static/banana_div2-1351c98ec2986be1.glb";

      class BananaForScale extends ScenePluginDefaultImplementation {
          setScene(scene) {
              this._scene = scene;
              this._staticItemLoader
                  .loadGLB(getAssetPath() + BANANA_FILE_NAME)
                  .then((glb) => {
                  this._banana = glb.scene;
                  this.updateBounds(null);
              });
              console.log('%c' + 'Banana 3D model by https://sketchfab.com/daniel132', 'color: #ffe135');
              console.log('%c' +
                  'Banana source: https://sketchfab.com/3d-models/banana-mark-2-a7fef734bf4544cb8a780a858fa6af97', 'color: #ffe135');
              console.log('%c' +
                  'Licensed under Creative Commons 4.0: https://creativecommons.org/licenses/by/4.0/', 'color: #ffe135');
          }
          updateBounds(bounds) {
              if (bounds) {
                  this._bounds = bounds;
              }
              if (!this._bounds) {
                  return;
              }
              if (this._banana) {
                  const size = this._bounds.getSize(new Vector3());
                  const center = this._bounds.getCenter(new Vector3());
                  const position = center.clone();
                  position.x -= size.x / 2 + 0.18;
                  position.z += size.z / 2 + 0.05;
                  position.y = 0;
                  let scale = 0.03;
                  this._banana.scale.copy(new Vector3(scale, scale, scale));
                  this._banana.rotation.y = 0.6;
                  this._banana.position.copy(position);
              }
              if (!this._scene.children.includes(this._banana)) {
                  this.addToScene();
              }
          }
          clearScene(scene, uiScene) {
              super.clearScene(scene, uiScene);
              this.removeFromScene();
          }
          addToScene() {
              if (!this._scene || !this._banana) {
                  return;
              }
              this._scene.add(this._banana);
          }
          removeFromScene() {
              if (!this._scene || !this._banana) {
                  return;
              }
              this._scene.remove(this._banana);
          }
      } exports('default', BananaForScale);
      __decorate([
          inject
      ], BananaForScale.prototype, "_staticItemLoader", void 0);

    })
  };
}));
//# sourceMappingURL=banana-for-scale-27dfe830.nomodule.js.map
