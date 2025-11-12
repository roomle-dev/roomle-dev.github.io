System.register(['./main-thread-to-worker-d8be741d.nomodule.js', './roomle-dependency-injection-85668395.nomodule.js'], (function (exports) {
  'use strict';
  var Raycaster, throttle, Mesh, MeshStandardMaterial, Box3, Vector3, Frustum, Matrix4, transitionTransparencyOfMaterial;
  return {
    setters: [function (module) {
      Raycaster = module.bw;
      throttle = module.bM;
      Mesh = module.z;
      MeshStandardMaterial = module.v;
      Box3 = module.ad;
      Vector3 = module.a;
      Frustum = module.bN;
      Matrix4 = module.k;
    }, function (module) {
      transitionTransparencyOfMaterial = module.$;
    }],
    execute: (function () {

      class ComponentRaycastHelper {
          constructor() {
              this._nonTransparentComponent = null;
              this._raycaster = new Raycaster();
              this._raycaster.near = 0.1;
              this._raycaster.layers.enable(3 /* LAYER.OBJECT */);
          }
          init(scene, camera) {
              this._scene = scene;
              this._camera = camera;
              this.checkComponentVisibility = throttle(this.checkComponentVisibility, 100).bind(this);
              this.checkPreviewVisibility = throttle(this.checkPreviewVisibility, 100).bind(this);
          }
          changeMaterialsOnSelect(object, component, selected = false) {
              if (component === this._nonTransparentComponent) {
                  return;
              }
              this._nonTransparentComponent = component;
              this._changeMaterialsOnSelect(object, component, selected);
          }
          _changeMaterialsOnSelect(object, component, selected = false) {
              if (object.children.length > 0) {
                  object.children.forEach((child) => {
                      const selectChild = (component && object.id === component.id) || selected;
                      const isComponent = !(child instanceof Mesh);
                      this._changeMaterialsOnSelect(child, component, selectChild && isComponent ? false : selectChild);
                  });
              }
              if (component) {
                  if (object instanceof Mesh &&
                      object.material instanceof MeshStandardMaterial &&
                      !object.userData.oldMaterial) {
                      object.userData.oldMaterial = object.material;
                      object.material = object.material.clone();
                      if (!selected) {
                          transitionTransparencyOfMaterial(object, {
                              opacity: 0.2,
                              transparent: true,
                          });
                      }
                  }
              }
              else if (object.userData.oldMaterial) {
                  if (object instanceof Mesh &&
                      object.material instanceof MeshStandardMaterial) {
                      const { opacity, transparent } = object.userData.oldMaterial;
                      transitionTransparencyOfMaterial(object, { opacity, transparent });
                      object.userData.oldMaterial = undefined;
                  }
              }
          }
          isComponentVisible(component) {
              const uuids = [];
              component.traverse((object) => uuids.push(object.uuid));
              const position = new Box3()
                  .setFromObject(component)
                  .getCenter(new Vector3());
              const direction = new Vector3()
                  .subVectors(position, this._camera.position)
                  .normalize();
              this._raycaster.set(this._camera.position, direction);
              this._raycaster.far = this._camera.position.distanceTo(position);
              const visibleIntersections = [];
              this._raycaster
                  .intersectObjects(this._scene.children, true)
                  .forEach((i) => {
                  // do not include invisible materials
                  if (!i.object.material.visible) {
                      return;
                  }
                  // do not include the object itself
                  if (uuids.includes(i.object.uuid)) {
                      return;
                  }
                  // do not include objects which explicitly have the ignoreComponentRaycast flag
                  if (i.object.userData.ignoreComponentRaycast) {
                      return;
                  }
                  visibleIntersections.push(i);
              });
              return visibleIntersections.length === 0;
          }
          checkComponentAndPreviewVisibility(sceneEventHandler, configuratorViewModel) {
              if (sceneEventHandler.hasSelection()) {
                  this.checkComponentVisibility(sceneEventHandler, configuratorViewModel);
              }
              else if (configuratorViewModel.hasPreviews()) {
                  this.checkPreviewVisibility(configuratorViewModel);
              }
              else {
                  this.changeMaterialsOnSelect(this._scene, null);
              }
          }
          checkComponentVisibility(sceneEventHandler, configuratorViewModel) {
              if (!sceneEventHandler.hasSelection()) {
                  return;
              }
              const selectedComponents = configuratorViewModel.getComponentsForIds(sceneEventHandler.getSelectedRuntimeComponentIds());
              if (selectedComponents.length > 1) {
                  return;
              }
              const selectedComponent = selectedComponents[0];
              if (this.isComponentVisible(selectedComponent)) {
                  this.changeMaterialsOnSelect(this._scene, null);
              }
              else {
                  this.changeMaterialsOnSelect(this._scene, selectedComponent);
              }
          }
          areAllPreviewsVisible(configuratorViewModel) {
              if (!configuratorViewModel.hasPreviews()) {
                  return true;
              }
              const previews = configuratorViewModel.getPreviews();
              if (previews.length === 0) {
                  return true;
              }
              return previews
                  .map((preview) => this.isComponentVisible(preview))
                  .reduce((arePreviewsVisible, isPreviewVisible) => arePreviewsVisible && isPreviewVisible);
          }
          areAllComponentsInFrustum(previews) {
              if (previews.length === 0) {
                  return true;
              }
              const frustum = new Frustum();
              const matrix = new Matrix4().multiplyMatrices(this._camera.projectionMatrix, this._camera.matrixWorldInverse);
              const box3 = new Box3();
              frustum.setFromProjectionMatrix(matrix);
              const isComponentInFrustum = (component) => {
                  const position = box3.setFromObject(component).getCenter(new Vector3());
                  return frustum.containsPoint(position);
              };
              return previews
                  .map((preview) => isComponentInFrustum(preview))
                  .reduce((arePreviewsVisible, isPreviewVisible) => arePreviewsVisible && isPreviewVisible);
          }
          checkPreviewVisibility(configuratorViewModel) {
              if (configuratorViewModel.hasPreviewLines()) {
                  return;
              }
              const allPreviewsVisible = this.areAllPreviewsVisible(configuratorViewModel);
              if (!allPreviewsVisible) {
                  this.changeMaterialsOnSelect(this._scene, { id: -1 });
              }
              else {
                  this.changeMaterialsOnSelect(this._scene, null);
              }
          }
      } exports('default', ComponentRaycastHelper);

    })
  };
}));
//# sourceMappingURL=component-raycast-helper-800a6b86.nomodule.js.map
