System.register(['./roomle-dependency-injection-6b8e8576.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js', './TextGeometry-7f6c3218.nomodule.js'], (function (exports) {
  'use strict';
  var __decorate, inject, Object3D, Vector3, LineBasicMaterial, MeshBasicMaterial, DoubleSide, MeshPhongMaterial, BufferGeometry, Line, Mesh, BufferAttribute, Quaternion, Line3, PlaneGeometry, TextGeometry;
  return {
    setters: [function (module) {
      __decorate = module._;
      inject = module.i;
    }, function (module) {
      Object3D = module.O;
      Vector3 = module.a;
      LineBasicMaterial = module.u;
      MeshBasicMaterial = module.h;
      DoubleSide = module.w;
      MeshPhongMaterial = module.bn;
      BufferGeometry = module.B;
      Line = module.G;
      Mesh = module.z;
      BufferAttribute = module.b;
      Quaternion = module.Q;
      Line3 = module.aZ;
      PlaneGeometry = module.b8;
    }, function (module) {
      TextGeometry = module.T;
    }],
    execute: (function () {

      const LINE_MATERIAL = 'component_dimensioning_line_material';
      const PLANE_MATERIAL = 'component_dimensioning_plane_material';
      const TEXT_MATERIAL = 'component_dimensioning_text_material';
      const TEXT_SPACING = 0.02;
      const TEXT_SIZE = 0.025;
      const TEXT_COLOR = 0x373737;
      // const TEXT_COLOR = 0xff0000;
      const PLANE_COLOR = 0xffffff;
      // const PLANE_COLOR = 0x00ff00;
      const LINE_SPACING = 0.05;
      class ComponentDimensioning extends Object3D {
          constructor(dimensioning, boundingBox, font, cameraPosition) {
              super();
              this._center = boundingBox.getCenter(new Vector3());
              this._size = boundingBox.getSize(new Vector3());
              this._origin = this._center
                  .clone()
                  .sub(this._size.clone().multiplyScalar(0.5));
              this._dimensioning = dimensioning;
              this._level = this._dimensioning.maxLevel - this._dimensioning.level;
              this._font = font;
              this._cameraPosition = cameraPosition;
              this._init();
          }
          _initMaterials() {
              if (this._cacheHolder.materialCache.has(LINE_MATERIAL)) {
                  this._lineMaterial = this._cacheHolder.materialCache.get(LINE_MATERIAL);
              }
              else {
                  this._lineMaterial = new LineBasicMaterial({
                      color: TEXT_COLOR,
                  });
                  this._cacheHolder.materialCache.set(LINE_MATERIAL, this._lineMaterial);
              }
              if (this._cacheHolder.materialCache.has(PLANE_MATERIAL)) {
                  this._planeMaterial = this._cacheHolder.materialCache.get(PLANE_MATERIAL);
              }
              else {
                  this._planeMaterial = new MeshBasicMaterial({
                      color: PLANE_COLOR,
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
                      color: TEXT_COLOR,
                  });
                  this._cacheHolder.materialCache.set(TEXT_MATERIAL, this._textMaterial);
              }
          }
          _init() {
              this._initMaterials();
              let geometry = new BufferGeometry();
              this._line = new Line(geometry, this._lineMaterial);
              this._line.name =
                  'component dimension line ' + this._dimensioning.type.value; // For debugging purpose
              // this._line.layers.set(LAYER.DIMENSIONS);
              this._text = new Mesh(geometry, this._textMaterial);
              this._text.name =
                  'component dimension text ' + this._dimensioning.type.value;
              // this._text.layers.set(LAYER.DIMENSIONS);
              this._plane = new Mesh(geometry, this._planeMaterial);
              this._plane.name =
                  'component dimension plane ' + this._dimensioning.type.value;
              // this._plane.layers.set(LAYER.DIMENSIONS);
              let lineGeometry = new BufferGeometry();
              let line;
              let maxSize = Math.round(Math.max(this._size.y, this._size.x, this._size.z));
              let length = Math.abs(this._dimensioning.to - this._dimensioning.from);
              let fontSize = TEXT_SIZE + (maxSize < 4 ? 0 : maxSize * 0.005);
              if (length < 0.3) {
                  fontSize *= 0.5 + length;
              }
              let parameters = {
                  font: this._font,
                  size: fontSize,
                  height: 0.001,
                  curveSegments: 2,
                  bevelEnabled: true,
                  bevelThickness: 0.001,
                  bevelSize: 0.001,
              };
              let text = this._dimensioning.label
                  ? this._dimensioning.label
                  : this._unitFormatter.formatMMValueToUnitString(length * 1000);
              let textGeometry = new TextGeometry(text, parameters);
              textGeometry.computeBoundingBox();
              let levelSpacing = textGeometry.boundingBox.getSize(new Vector3()).y;
              if (this._dimensioning.type.value === 0 /* DIMENSIONING_TYPE.X */) {
                  line = this._getXEdge(levelSpacing);
                  this._addXEdgeSideLines(levelSpacing);
              }
              if (this._dimensioning.type.value === 1 /* DIMENSIONING_TYPE.Y */) {
                  line = this._getYEdge(levelSpacing);
                  this._addYEdgeSideLines(levelSpacing);
              }
              if (this._dimensioning.type.value === 2 /* DIMENSIONING_TYPE.Z */) {
                  line = this._getZEdge(levelSpacing);
                  this._addZEdgeSideLines(levelSpacing);
              }
              let vertices = [
                  line.start.x,
                  line.start.y,
                  line.start.z,
                  line.end.x,
                  line.end.y,
                  line.end.z,
              ];
              lineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
              this._line.geometry.dispose();
              this._line.geometry = lineGeometry;
              this.add(this._line);
              // add text
              this._text.geometry = textGeometry;
              if (this._dimensioning.type.value === 0 /* DIMENSIONING_TYPE.X */) {
                  this._addText(line, textGeometry, new Quaternion(), new Vector3(0, 2 * TEXT_SPACING, 0));
              }
              if (this._dimensioning.type.value === 1 /* DIMENSIONING_TYPE.Y */) {
                  let quaternion = new Quaternion();
                  let rotation = this._getXSign() > 0 ? Math.PI / 2 : 3 * (Math.PI / 2);
                  quaternion.setFromAxisAngle(new Vector3(0, 0, 1), rotation);
                  this._addText(line, textGeometry, quaternion, new Vector3(2 * TEXT_SPACING, 0, 0));
              }
              if (this._dimensioning.type.value === 2 /* DIMENSIONING_TYPE.Z */) {
                  let rotation = this._getXSign() > 0 ? Math.PI / 2 : 3 * (Math.PI / 2);
                  let quaternionX = new Quaternion().setFromAxisAngle(new Vector3(-1, 0, 0), Math.PI / 2);
                  let quaternionZ = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), rotation);
                  this._addText(line, textGeometry, quaternionX.multiply(quaternionZ), new Vector3(2 * TEXT_SPACING, 0, 0));
              }
          }
          _getXEdge(levelSpacing) {
              let offsetY = this._size.y +
                  LINE_SPACING +
                  (3 * TEXT_SPACING + levelSpacing) * this._level;
              const xOrigin = new Vector3(0, this._origin.y, this._origin.z);
              let start = xOrigin
                  .clone()
                  .add(new Vector3(this._dimensioning.from, offsetY, 0));
              let end = xOrigin
                  .clone()
                  .add(new Vector3(this._dimensioning.to, offsetY, 0));
              return new Line3(start, end);
          }
          _addXEdgeSideLines(levelSpacing) {
              let offsetYInner = this._size.y +
                  LINE_SPACING +
                  (3 * TEXT_SPACING + levelSpacing) * (this._level - 0.5);
              let offsetYOuter = this._size.y +
                  LINE_SPACING +
                  (3 * TEXT_SPACING + levelSpacing) * this._level;
              const xOrigin = new Vector3(0, this._origin.y, this._origin.z);
              let startFrom = xOrigin
                  .clone()
                  .add(new Vector3(this._dimensioning.from, offsetYInner, 0));
              let endFrom = xOrigin
                  .clone()
                  .add(new Vector3(this._dimensioning.from, offsetYOuter, 0));
              let startTo = xOrigin
                  .clone()
                  .add(new Vector3(this._dimensioning.to, offsetYInner, 0));
              let endTo = xOrigin
                  .clone()
                  .add(new Vector3(this._dimensioning.to, offsetYOuter, 0));
              this._addLine(startFrom, endFrom);
              this._addLine(startTo, endTo);
          }
          _getZEdge(levelSpacing) {
              let base = this._getXSign() > 0 ? this._size.x : 0;
              let offsetX = base + LINE_SPACING + (3 * TEXT_SPACING + levelSpacing) * this._level;
              offsetX *= this._getXSign();
              const zOrigin = new Vector3(this._origin.x, this._origin.y, 0);
              let start = zOrigin
                  .clone()
                  .add(new Vector3(offsetX, 0, this._dimensioning.from));
              let end = zOrigin
                  .clone()
                  .add(new Vector3(offsetX, 0, this._dimensioning.to));
              return new Line3(start, end);
          }
          _addZEdgeSideLines(levelSpacing) {
              let base = this._getXSign() > 0 ? this._size.x : 0;
              let offsetXLInner = base +
                  LINE_SPACING +
                  (3 * TEXT_SPACING + levelSpacing) * (this._level - 0.5);
              let offsetXOuter = base + LINE_SPACING + (3 * TEXT_SPACING + levelSpacing) * this._level;
              offsetXLInner *= this._getXSign();
              offsetXOuter *= this._getXSign();
              const zOrigin = new Vector3(this._origin.x, this._origin.y, 0);
              let startFrom = zOrigin
                  .clone()
                  .add(new Vector3(offsetXLInner, 0, this._dimensioning.from));
              let endFrom = zOrigin
                  .clone()
                  .add(new Vector3(offsetXOuter, 0, this._dimensioning.from));
              let startTo = zOrigin
                  .clone()
                  .add(new Vector3(offsetXLInner, 0, this._dimensioning.to));
              let endTo = zOrigin
                  .clone()
                  .add(new Vector3(offsetXOuter, 0, this._dimensioning.to));
              this._addLine(startFrom, endFrom);
              this._addLine(startTo, endTo);
          }
          _getYEdge(levelSpacing) {
              let base = this._getXSign() > 0 ? this._size.x : 0;
              let offsetX = base + LINE_SPACING + (3 * TEXT_SPACING + levelSpacing) * this._level;
              offsetX *= this._getXSign();
              const yOrigin = new Vector3(this._origin.x, 0, this._origin.z);
              let start = yOrigin
                  .clone()
                  .add(new Vector3(offsetX, this._dimensioning.from, 0));
              let end = yOrigin
                  .clone()
                  .add(new Vector3(offsetX, this._dimensioning.to, 0));
              return new Line3(start, end);
          }
          _addYEdgeSideLines(levelSpacing) {
              let base = this._getXSign() > 0 ? this._size.x : 0;
              let offsetXLInner = base +
                  LINE_SPACING +
                  (3 * TEXT_SPACING + levelSpacing) * (this._level - 0.5);
              let offsetXOuter = base + LINE_SPACING + (3 * TEXT_SPACING + levelSpacing) * this._level;
              offsetXLInner *= this._getXSign();
              offsetXOuter *= this._getXSign();
              const yOrigin = new Vector3(this._origin.x, 0, this._origin.z);
              let startFrom = yOrigin
                  .clone()
                  .add(new Vector3(offsetXLInner, this._dimensioning.from, 0));
              let endFrom = yOrigin
                  .clone()
                  .add(new Vector3(offsetXOuter, this._dimensioning.from, 0));
              let startTo = yOrigin
                  .clone()
                  .add(new Vector3(offsetXLInner, this._dimensioning.to, 0));
              let endTo = yOrigin
                  .clone()
                  .add(new Vector3(offsetXOuter, this._dimensioning.to, 0));
              this._addLine(startFrom, endFrom);
              this._addLine(startTo, endTo);
          }
          _addLine(start, end) {
              let lineGeometry = new BufferGeometry();
              let vertices = [start.x, start.y, start.z, end.x, end.y, end.z];
              lineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(vertices), 3));
              this.add(new Line(lineGeometry, this._lineMaterial));
          }
          _addText(line, textGeometry, quaternion, moveBy) {
              let position = line.getCenter(new Vector3());
              moveBy.x *= this._getXSign();
              position.add(moveBy);
              let textGeometrySize = textGeometry.boundingBox.getSize(new Vector3());
              textGeometry.center();
              this._text.position.copy(position);
              this._text.quaternion.copy(quaternion);
              this.add(this._text);
              //add plane
              let planeGeometry = new PlaneGeometry(textGeometrySize.x + TEXT_SPACING, textGeometrySize.y + TEXT_SPACING, 32);
              planeGeometry.center();
              this._plane.geometry = planeGeometry;
              this._plane.position.copy(position);
              this._plane.quaternion.copy(quaternion);
              this.add(this._plane);
          }
          _getXSign() {
              if (this._cameraPosition.x >= 0) {
                  return 1;
              }
              else {
                  return -1;
              }
          }
      } exports('default', ComponentDimensioning);
      __decorate([
          inject
      ], ComponentDimensioning.prototype, "_cacheHolder", void 0);
      __decorate([
          inject
      ], ComponentDimensioning.prototype, "_unitFormatter", void 0);

    })
  };
}));
//# sourceMappingURL=component-dimensioning-4e0bf8ea.nomodule.js.map
