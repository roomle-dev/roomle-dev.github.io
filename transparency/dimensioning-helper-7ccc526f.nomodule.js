System.register(['./roomle-dependency-injection-f62f5de7.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js', './TextGeometry-7f6c3218.nomodule.js'], (function (exports) {
  'use strict';
  var dispose, __decorate, inject, AsyncGuard, AsyncDependencyLoader, Object3D, Vector3, MeshBasicMaterial, DoubleSide, MeshPhongMaterial, BufferGeometry, Mesh, Quaternion, PlaneGeometry, LineBasicMaterial, Line, BufferAttribute, Line3, Box3, TextGeometry;
  return {
    setters: [function (module) {
      dispose = module.n;
      __decorate = module._;
      inject = module.i;
      AsyncGuard = module.af;
      AsyncDependencyLoader = module.aC;
    }, function (module) {
      Object3D = module.O;
      Vector3 = module.a;
      MeshBasicMaterial = module.h;
      DoubleSide = module.w;
      MeshPhongMaterial = module.bn;
      BufferGeometry = module.B;
      Mesh = module.z;
      Quaternion = module.Q;
      PlaneGeometry = module.b8;
      LineBasicMaterial = module.u;
      Line = module.G;
      BufferAttribute = module.b;
      Line3 = module.aZ;
      Box3 = module.ad;
    }, function (module) {
      TextGeometry = module.T;
    }],
    execute: (function () {

      var RUBIK_SUB_FILE_NAME = "static/rubik_regular_sub-2dd2d5cca49018c5.json";

      const PLANE_MATERIAL = 'component_dimensioning_plane_material';
      const TEXT_MATERIAL = 'component_dimensioning_text_material';
      const TEXT_SPACING = 0.02;
      const TEXT_COLOR$1 = 0x373737;
      const PLANE_COLOR$1 = 0xffffff;
      class TextWithBackground extends Object3D {
          constructor(font) {
              super();
              this._label = '';
              this._parameters = {
                  font: null,
                  size: 0.1,
                  height: 0.001,
                  curveSegments: 2,
                  bevelEnabled: true,
                  bevelThickness: 0.001,
                  bevelSize: 0.001,
              };
              this.topDown = false;
              this._parameters.font = font;
              this._position = new Vector3();
              this._initMaterials();
              this._init();
              this._update();
          }
          _initMaterials() {
              if (this._cacheHolder.materialCache.has(PLANE_MATERIAL)) {
                  this._planeMaterial = this._cacheHolder.materialCache.get(PLANE_MATERIAL);
              }
              else {
                  this._planeMaterial = new MeshBasicMaterial({
                      color: PLANE_COLOR$1,
                      side: DoubleSide,
                      opacity: 0.8,
                      transparent: true,
                  });
                  this._cacheHolder.materialCache.set(PLANE_MATERIAL, this._planeMaterial);
              }
              if (this._cacheHolder.materialCache.has(TEXT_MATERIAL)) {
                  this._textMaterial = this._cacheHolder.materialCache.get(TEXT_MATERIAL);
              }
              else {
                  this._textMaterial = new MeshPhongMaterial({
                      color: TEXT_COLOR$1,
                  });
                  this._cacheHolder.materialCache.set(TEXT_MATERIAL, this._textMaterial);
              }
          }
          _init() {
              let geometry = new BufferGeometry();
              this._text = new Mesh(geometry, this._textMaterial);
              this._text.userData.ignoreComponentRaycast = true;
              this._text.name = 'text with background text ' + this._label;
              this._plane = new Mesh(geometry, this._planeMaterial);
              this._plane.userData.ignoreComponentRaycast = true;
              this._plane.name = 'text with background plane ' + this._label;
              this._textGeometry = new TextGeometry(this._label, this._parameters);
              this._textGeometry.computeBoundingBox();
              this._text.geometry = this._textGeometry;
              this.add(this._text);
              this.add(this._plane);
          }
          update(position, dimensioningType, label, cameraPosition) {
              this._position.copy(position);
              this._dimensioningType = dimensioningType;
              this._cameraPosition = cameraPosition;
              this._label = label;
              const distance = this._cameraPosition.distanceTo(this._text.position);
              const size = Math.max(0.01, distance / 100);
              const textThickness = Math.max(0.0005, distance / 5000);
              this._parameters.bevelThickness = textThickness;
              this._parameters.bevelSize = textThickness;
              this._parameters.size = size;
              this._textGeometry = new TextGeometry(this._label, this._parameters);
              this._textGeometry.computeBoundingBox();
              this._text.geometry = this._textGeometry;
              this._update();
          }
          _update() {
              if (this.topDown) {
                  let quaternion = new Quaternion();
                  quaternion.setFromAxisAngle(new Vector3(-1, 0, 0), Math.PI / 2);
                  this._updateText(this._textGeometry, quaternion, new Vector3());
              }
              else {
                  this._updateText(this._textGeometry, new Quaternion(), new Vector3());
                  if (this._cameraPosition) {
                      const rotationY = Math.atan2(this._cameraPosition.x - this._position.x, this._cameraPosition.z - this._position.z);
                      this._text.rotation.y = rotationY;
                      this._plane.rotation.y = rotationY;
                  }
              }
          }
          _updateText(textGeometry, quaternion, moveBy) {
              let position = new Vector3();
              position.copy(this._position);
              moveBy.x *= this._getXSign();
              position.add(moveBy);
              let textGeometrySize = textGeometry.boundingBox.getSize(new Vector3());
              textGeometry.center();
              this._text.position.copy(position);
              this._text.quaternion.copy(quaternion);
              //add plane
              let planeGeometry = new PlaneGeometry(textGeometrySize.x + TEXT_SPACING, textGeometrySize.y + TEXT_SPACING, 32);
              planeGeometry.center();
              this._plane.geometry = planeGeometry;
              this._plane.position.copy(position);
              this._plane.quaternion.copy(quaternion);
          }
          _getXSign() {
              if (!this._cameraPosition || this._cameraPosition.x >= 0) {
                  return 1;
              }
              else {
                  return -1;
              }
          }
          dispose() {
              dispose(this);
          }
      }
      __decorate([
          inject
      ], TextWithBackground.prototype, "_cacheHolder", void 0);

      const TEXT_COLOR = 0x373737;
      const PLANE_COLOR = 0xffffff;
      const LINE_SPACING = 0.05;
      class DimensioningHelper {
          constructor(creator) {
              this._cameraPosition = new Vector3();
              this._textUpdated = false;
              this._topDimensions = false;
              this._initialized = new AsyncGuard();
              this._enabled = false;
              this._dimensionsVisible = false;
              this._creator_ = creator;
              this._lineMaterial = new LineBasicMaterial({
                  color: TEXT_COLOR,
                  linewidth: 2,
              });
              let geometry = new BufferGeometry();
              this._widthLine = new Line(geometry, this._lineMaterial);
              this._widthLine.userData.ignoreComponentRaycast = true;
              this._widthLine.name = 'dimension width line'; // For debugging purpose
              this._heightLine = new Line(geometry, this._lineMaterial);
              this._heightLine.userData.ignoreComponentRaycast = true;
              this._heightLine.name = 'dimension height line';
              this._depthLine = new Line(geometry, this._lineMaterial);
              this._depthLine.userData.ignoreComponentRaycast = true;
              this._depthLine.name = 'dimension depth line';
              this._planeMaterial = new MeshBasicMaterial({
                  color: PLANE_COLOR,
                  side: DoubleSide,
                  opacity: 0.8,
                  transparent: true,
              });
              /* as any this is needed because otherwise ts-jest goes mad, because it think it's a JSON not a string */
              AsyncDependencyLoader.loadFont(RUBIK_SUB_FILE_NAME).then((font) => {
                  this._font = font;
                  this._loaded();
              });
          }
          _loaded() {
              this.update(false);
              this.addToScene(this._scene, this._uiScene);
              this._initialized.resolve();
          }
          _performUpdate(force) {
              if (!this._enabled || (!this._lineBounds && !force) || !this._font) {
                  return;
              }
              this._updateHeight();
              this._updateWidth();
              this._updateDepth();
          }
          _updateWidth() {
              let widthLineGeometry = new BufferGeometry();
              let widthEdge = this._getWidthEdge();
              let vertices = [
                  widthEdge.start.x,
                  widthEdge.start.y,
                  widthEdge.start.z,
                  widthEdge.end.x,
                  widthEdge.end.y,
                  widthEdge.end.z,
              ];
              widthLineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
              this._widthLine.geometry.dispose();
              this._widthLine.geometry = widthLineGeometry;
              //WIDTH TEXT
              let widthTextPosition = widthEdge.getCenter(new Vector3());
              if (!this._widthText) {
                  this._widthText = new TextWithBackground(this._font);
              }
              this._widthText.topDown = this._topDimensions;
              const widthLabel = this._unitFormatter.formatMMValueToUnitString(this._dimensions.x * 1000);
              this._widthText.update(widthTextPosition, 0 /* DIMENSIONING_TYPE.X */, widthLabel, this._cameraPosition);
          }
          _updateHeight() {
              let heightLineGeometry = new BufferGeometry();
              let heightEdge = this._getHeightEdge();
              let vertices = [
                  heightEdge.start.x,
                  heightEdge.start.y,
                  heightEdge.start.z,
                  heightEdge.end.x,
                  heightEdge.end.y,
                  heightEdge.end.z,
              ];
              heightLineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
              this._heightLine.geometry.dispose();
              this._heightLine.geometry = heightLineGeometry;
              //HEIGHT TEXT
              let heightTextPosition = heightEdge.getCenter(new Vector3());
              if (!this._heightText) {
                  this._heightText = new TextWithBackground(this._font);
              }
              this._heightText.topDown = this._topDimensions;
              const heightLabel = this._unitFormatter.formatMMValueToUnitString(this._dimensions.y * 1000);
              this._heightText.update(heightTextPosition, 1 /* DIMENSIONING_TYPE.Y */, heightLabel, this._cameraPosition);
          }
          _updateDepth() {
              let depthLineGeometry = new BufferGeometry();
              let depthEdge = this._getDepthEdge();
              let vertices = [
                  depthEdge.start.x,
                  depthEdge.start.y,
                  depthEdge.start.z,
                  depthEdge.end.x,
                  depthEdge.end.y,
                  depthEdge.end.z,
              ];
              depthLineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
              this._depthLine.geometry.dispose();
              this._depthLine.geometry = depthLineGeometry;
              //DEPTH TEXT
              let depthTextPosition = depthEdge.getCenter(new Vector3());
              if (!this._depthText) {
                  this._depthText = new TextWithBackground(this._font);
              }
              this._depthText.topDown = this._topDimensions;
              const depthLabel = this._unitFormatter.formatMMValueToUnitString(this._dimensions.z * 1000);
              this._depthText.update(depthTextPosition, 2 /* DIMENSIONING_TYPE.Z */, depthLabel, this._cameraPosition);
          }
          updateBounds(boxForMeasurements) {
              if (!boxForMeasurements) {
                  return;
              }
              this._dimensions = boxForMeasurements.getSize(new Vector3());
              this._lineBounds = boxForMeasurements.clone();
              let lineSpacingY = this._lineBounds.min.y < 0 ? this._lineBounds.min.y : 0;
              lineSpacingY -= 0.01;
              this._lineBounds.expandByVector(new Vector3(LINE_SPACING, lineSpacingY, LINE_SPACING));
              this._textUpdated = false;
              this.update();
          }
          update(force = false) {
              if (this._enabled && !this._dimensionsVisible) {
                  this._dimensionsVisible = true;
                  this._visibilityChangedCallback();
              }
              this._performUpdate(force);
          }
          addToScene(scene, uiScene) {
              if (!this._widthText ||
                  !this._widthLine ||
                  !this._heightText ||
                  !this._heightLine ||
                  !this._heightText ||
                  !this._heightLine) {
                  return;
              }
              scene.add(this._widthLine);
              uiScene.add(this._widthText);
              scene.add(this._heightLine);
              uiScene.add(this._heightText);
              scene.add(this._depthLine);
              uiScene.add(this._depthText);
          }
          removeFromScene(scene, uiScene) {
              scene.remove(this._widthLine);
              uiScene.remove(this._widthText);
              scene.remove(this._heightLine);
              uiScene.remove(this._heightText);
              scene.remove(this._depthLine);
              uiScene.remove(this._depthText);
          }
          _getWidthEdge() {
              if (this._cameraPosition.z >= 0) {
                  return new Line3(new Vector3(this._lineBounds.min.x, this._lineBounds.min.y, this._lineBounds.max.z), new Vector3(this._lineBounds.max.x, this._lineBounds.min.y, this._lineBounds.max.z));
              }
              else {
                  return new Line3(new Vector3(this._lineBounds.min.x, this._lineBounds.min.y, this._lineBounds.min.z), new Vector3(this._lineBounds.max.x, this._lineBounds.min.y, this._lineBounds.min.z));
              }
          }
          _getDepthEdge() {
              if (this._cameraPosition.x >= 0) {
                  return new Line3(new Vector3(this._lineBounds.max.x, this._lineBounds.min.y, this._lineBounds.min.z), new Vector3(this._lineBounds.max.x, this._lineBounds.min.y, this._lineBounds.max.z));
              }
              else {
                  return new Line3(new Vector3(this._lineBounds.min.x, this._lineBounds.min.y, this._lineBounds.min.z), new Vector3(this._lineBounds.min.x, this._lineBounds.min.y, this._lineBounds.max.z));
              }
          }
          _getHeightEdge() {
              if (this._cameraPosition.x >= 0 && this._cameraPosition.z >= 0) {
                  return new Line3(new Vector3(this._lineBounds.max.x, this._lineBounds.min.y, this._lineBounds.max.z), new Vector3(this._lineBounds.max.x, this._lineBounds.max.y, this._lineBounds.max.z));
              }
              if (this._cameraPosition.x < 0 && this._cameraPosition.z >= 0) {
                  return new Line3(new Vector3(this._lineBounds.min.x, this._lineBounds.min.y, this._lineBounds.max.z), new Vector3(this._lineBounds.min.x, this._lineBounds.max.y, this._lineBounds.max.z));
              }
              if (this._cameraPosition.x >= 0 && this._cameraPosition.z < 0) {
                  return new Line3(new Vector3(this._lineBounds.max.x, this._lineBounds.min.y, this._lineBounds.min.z), new Vector3(this._lineBounds.max.x, this._lineBounds.max.y, this._lineBounds.min.z));
              }
              return new Line3(new Vector3(this._lineBounds.min.x, this._lineBounds.min.y, this._lineBounds.min.z), new Vector3(this._lineBounds.min.x, this._lineBounds.max.y, this._lineBounds.min.z));
          }
          onDimensionsVisibilityChanged(handler) {
              this._onChange = handler;
          }
          enableTopDimensions() {
              this.enableDimensions();
              this._topDimensions = true;
              this._heightLine.visible = false;
              this._heightText.visible = false;
              this.update(true);
          }
          disableTopDimensions() {
              this._topDimensions = false;
              this._heightLine.visible = true;
              this._heightText.visible = true;
              this.disableDimensions();
          }
          enableDimensions() {
              this._enabled = true;
              this.update(true);
              this.addToScene(this._scene, this._uiScene);
          }
          disableDimensions() {
              this._enabled = false;
              if (this._dimensionsVisible) {
                  this._dimensionsVisible = false;
                  this._visibilityChangedCallback();
              }
              this.removeFromScene(this._scene, this._uiScene);
          }
          _visibilityChangedCallback() {
              if (this._onChange) {
                  this._onChange(this._dimensionsVisible);
              }
          }
          _clear() {
              this._lineMaterial.dispose();
              this._planeMaterial.dispose();
              this._widthLine.geometry.dispose();
              this._heightLine.geometry.dispose();
              this._depthLine.geometry.dispose();
              this._heightText.dispose();
              this._heightText.dispose();
              this._depthText.dispose();
          }
          getBoundingBox() {
              const bbox = new Box3();
              bbox.expandByObject(this._widthLine);
              bbox.expandByObject(this._widthText);
              bbox.expandByObject(this._heightLine);
              bbox.expandByObject(this._heightText);
              bbox.expandByObject(this._depthLine);
              bbox.expandByObject(this._depthText);
              return bbox;
          }
          setVisibility(visible) {
              if (!this._heightLine ||
                  !this._widthLine ||
                  !this._depthLine ||
                  !this._heightText ||
                  !this._widthText ||
                  !this._depthText) {
                  return;
              }
              this._heightLine.visible = visible;
              this._heightText.visible = visible;
              this._widthLine.visible = visible;
              this._widthText.visible = visible;
              this._depthLine.visible = visible;
              this._depthText.visible = visible;
          }
          moveCameraStart(position) {
              this.setVisibility(false);
              this._cameraPosition = position;
              this.update();
          }
          moveCameraEnd(position) {
              this.setVisibility(true);
              this._cameraPosition = position;
              this.update();
          }
          clearScene(_scene) {
              this._clear();
          }
          setScene(scene) {
              this._scene = scene;
          }
          setUiScene(uiScene) {
              this._uiScene = uiScene;
          }
          needsUiScene() {
              return true;
          }
          isInitialized() {
              return this._initialized.wait();
          }
          areDimensionsEnabled() {
              return this._enabled;
          }
      } exports('default', DimensioningHelper);
      __decorate([
          inject
      ], DimensioningHelper.prototype, "_unitFormatter", void 0);

    })
  };
}));
//# sourceMappingURL=dimensioning-helper-7ccc526f.nomodule.js.map
