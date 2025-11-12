System.register(['./roomle-dependency-injection-85668395.nomodule.js', './scene-manager-a602aff6.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js', './default-light-setting-67b2d374.nomodule.js'], (function (exports, module) {
  'use strict';
  var EventDispatcher, vectorIsZero, disposeMesh, convertToKernel, toRadiant, __decorate, inject, getScreenXY, CANVAS_ID, Env, RoomleDependencyInjection, PULSE_LOOPS, PULSE_DURATION, DynamicLightSettingLoader, PREDEFINED_LIGHTSETTING, ImageRenderer, createEmptySceneFromCurrent, dispose, getYRotationOfObject, getIdealDistance, Benchmark, getHostname, RoomleComponentFactoryInitializer, toDegrees, DEFAULT_CONVERSATION_ID, getCatalogIdFromItemOrConfigurationId, isIdItemId, AppContext, AsyncHelper, isRange, isMaterial, convertCObject, SceneManager, BackgroundEnvironment, DISTANCE_FACTOR, CameraControl3D, FloorEnvironment, TWEEN_FILE_NAME, Vector3, Raycaster, Plane, Vector2, Quaternion, Mesh, Layers, deepMerge, Box3, callAgainAfter, debounce, getColor, Euler, areCameraParametersEqual, ROOMLE_HIGHLIGHTNG, DefaultLightSetting;
  return {
    setters: [function (module) {
      EventDispatcher = module.E;
      vectorIsZero = module.v;
      disposeMesh = module.d;
      convertToKernel = module.c;
      toRadiant = module.t;
      __decorate = module._;
      inject = module.i;
      getScreenXY = module.g;
      CANVAS_ID = module.e;
      Env = module.f;
      RoomleDependencyInjection = module.b;
      PULSE_LOOPS = module.P;
      PULSE_DURATION = module.h;
      DynamicLightSettingLoader = module.j;
      PREDEFINED_LIGHTSETTING = module.k;
      ImageRenderer = module.l;
      createEmptySceneFromCurrent = module.m;
      dispose = module.n;
      getYRotationOfObject = module.o;
      getIdealDistance = module.p;
      Benchmark = module.B;
      getHostname = module.q;
      RoomleComponentFactoryInitializer = module.r;
      toDegrees = module.s;
      DEFAULT_CONVERSATION_ID = module.u;
      getCatalogIdFromItemOrConfigurationId = module.w;
      isIdItemId = module.x;
      AppContext = module.A;
      AsyncHelper = module.y;
      isRange = module.z;
      isMaterial = module.F;
      convertCObject = module.G;
    }, function (module) {
      SceneManager = module.S;
      BackgroundEnvironment = module.B;
      DISTANCE_FACTOR = module.D;
      CameraControl3D = module.C;
      FloorEnvironment = module.F;
      TWEEN_FILE_NAME = module.T;
    }, function (module) {
      Vector3 = module.a;
      Raycaster = module.bw;
      Plane = module.bx;
      Vector2 = module.V;
      Quaternion = module.Q;
      Mesh = module.z;
      Layers = module.bu;
      deepMerge = module.aB;
      Box3 = module.ad;
      callAgainAfter = module.by;
      debounce = module.bz;
      getColor = module.bA;
      Euler = module.ag;
      areCameraParametersEqual = module.bB;
      ROOMLE_HIGHLIGHTNG = module.aD;
    }, function (module) {
      DefaultLightSetting = module.D;
    }],
    execute: (function () {

      const ROTATION_TO_DETECT_SIDE = toRadiant(30);
      class RaycastHelper extends EventDispatcher {
          constructor(scene, camera, generalInput, mode) {
              super();
              this._offset = new Vector3(0, 0, 0);
              this._lastMoveCheck = 0;
              this._mode = mode === undefined ? 1 /* INTERSECTION_MODE.CONFIGURATOR */ : mode;
              this._scene = scene;
              this._camera = camera;
              this._raycaster = new Raycaster();
              this._raycaster.layers.disableAll();
              this._inputManager = generalInput;
              this._addInputListeners(generalInput);
              this._planeBottom = new Plane(new Vector3(0, 1, 0));
              this._planeFront = new Plane(new Vector3(0, 0, 1));
              this._planeSide = new Plane(new Vector3(1, 0, 0));
          }
          setLayers(layers) {
              this._raycaster.layers = layers;
          }
          getLayers() {
              return this._raycaster.layers;
          }
          _addInputListeners(inputManager) {
              inputManager.addEventListener(3 /* INPUT_EVENT.DOWN */, (event) => {
                  this._findCandidate(event.positionRelative);
              }, this);
              inputManager.addEventListener(5 /* INPUT_EVENT.CLICK */, (event) => {
                  this._findSelection(event.positionRelative);
              }, this);
              inputManager.addEventListener(12 /* INPUT_EVENT.DOUBLE_CLICK */, (event) => {
                  this._findSelection(event.positionRelative, true, event.type);
              }, this);
              inputManager.addEventListener(14 /* INPUT_EVENT.LONG_TOUCH */, (event) => {
                  // long touch is handles as double click
                  this._findSelection(event.positionRelative, true, event.type);
              }, this);
              inputManager.addEventListener(6 /* INPUT_EVENT.MOVE */, (event) => {
                  if (Date.now() - this._lastMoveCheck > 32) {
                      this._findHover(event.positionRelative, event.type);
                      this._lastMoveCheck = Date.now();
                  }
              }, this);
              inputManager.addEventListener(0 /* INPUT_EVENT.DRAG_START */, (event) => {
                  this._onDragStart(event.positionRelative);
              }, this);
              inputManager.addEventListener(1 /* INPUT_EVENT.DRAG */, (event) => {
                  this._onDrag(event.positionRelative);
              }, this);
              inputManager.addEventListener(2 /* INPUT_EVENT.DRAG_END */, (event) => {
                  this._onDragEnd(event.positionRelative);
              }, this);
              inputManager.addEventListener(9 /* INPUT_EVENT.ROTATE */, (event) => {
                  this._onRotate(event.positionRelative, event.rotation);
              }, this);
              inputManager.addEventListener(10 /* INPUT_EVENT.ROTATE_END */, () => {
                  this._currentRotate = null;
              }, this);
          }
          _findCandidate(position) {
              let intersection = this._intersection(position);
              // only report element hits (which improves dragging response) in planner
              // because this makes dragging previews to easy and results in unwanted behaviour
              if (intersection &&
                  !intersection.object.userData.ignoreElementHit &&
                  this._mode === 0 /* INTERSECTION_MODE.PLANNER */) {
                  this._inputManager.onElementHit();
              }
          }
          _findSelection(position, doubleClick = false, inputType = 0 /* INPUT_EVENT_TYPE.UNKNOWN */) {
              let intersection = this._intersection(position);
              if (!intersection) {
                  this.dispatchEvent(0 /* RAYCAST_EVENT.CLICK_OUTSIDE */);
              }
              else if (intersection) {
                  const type = doubleClick ? "double_click" /* OBJECT_EVENT.DOUBLE_CLICK */ : "select" /* OBJECT_EVENT.CLICK */;
                  intersection.object.dispatchEvent({
                      type,
                      attachment: { intersection, type: inputType },
                  });
              }
          }
          _findHover(position, type) {
              const intersection = this._intersection(position);
              if (!intersection && this._currentHover) {
                  this._currentHover.dispatchEvent({
                      type: "hover_off" /* OBJECT_EVENT.HOVER_OFF */,
                      attachment: { type },
                  });
                  this._currentHover = null;
              }
              else if (intersection) {
                  if (this._currentHover &&
                      this._currentHover.id !== intersection.object.id) {
                      this._currentHover.dispatchEvent({
                          type: "hover_off" /* OBJECT_EVENT.HOVER_OFF */,
                          attachment: { type },
                      });
                      this._currentHover = null;
                  }
                  if (!this._currentHover) {
                      this._currentHover = intersection.object;
                      this._currentHover.dispatchEvent({
                          type: "hover_on" /* OBJECT_EVENT.HOVER_ON */,
                          attachment: { intersection, type },
                      });
                  }
                  else {
                      this._currentHover.dispatchEvent({
                          type: "hover_move" /* OBJECT_EVENT.HOVER_MOVE */,
                          attachment: { intersection, type },
                      });
                  }
              }
          }
          _intersection(position) {
              const intersections = this._intersect(position);
              if (intersections.length <= 0) {
                  return null;
              }
              let intersectionResult = intersections[0];
              //for docklines we always want to return the current hover if it is still within the intersections
              if (intersections.length > 1 &&
                  this._currentHover &&
                  this._currentDrag &&
                  this._currentDrag.id !== this._currentHover.id) {
                  intersections.forEach((intersection) => {
                      if (intersection.object.id === this._currentHover.id &&
                          intersection.object.userData.priority ===
                              this._currentHover.userData.priority &&
                          intersectionResult.object.userData.priority <=
                              intersection.object.userData.priority) {
                          intersectionResult = intersection;
                      }
                  });
              }
              return intersectionResult;
          }
          _intersect(position) {
              this._raycaster.setFromCamera(new Vector2(position.x, position.y), this._camera);
              const intersectionsWithHandler = [];
              const intersections = this._raycaster.intersectObjects(this._scene.children, true);
              intersections.forEach((intersection) => {
                  const object = this._findObjectWithHandler(intersection.object);
                  if (object) {
                      intersection.object = object;
                      intersectionsWithHandler.push(intersection);
                  }
              });
              if (intersectionsWithHandler.length >= 0) {
                  return intersectionsWithHandler.sort((a, b) => {
                      if (a.object.userData.priority !== b.object.userData.priority) {
                          return b.object.userData.priority - a.object.userData.priority;
                      }
                      return a.distance - b.distance;
                  });
              }
              else {
                  return [];
              }
          }
          _findObjectWithHandler(object) {
              if (object.userData.hasListener) {
                  return object;
              }
              else if (object.parent) {
                  return this._findObjectWithHandler(object.parent);
              }
              return null;
          }
          _onDragStart(position) {
              let intersection = this._intersection(position);
              if (!intersection && !this._currentDrag) {
                  return;
              }
              if (intersection &&
                  intersection.object.userData.roomleId === this._rootComponentId) {
                  return;
              }
              if (!this._currentDrag && intersection) {
                  this._currentDrag = intersection.object;
                  this._currentDrag.dispatchEvent({ type: "drag_start" /* OBJECT_EVENT.DRAG_START */ });
              }
              let component = this._currentDrag
                  .parent;
              if (component && component.computeBoundingBox) {
                  component.computeBoundingBox();
                  this._calculateOffset(component);
              }
              this._positionPlanes(component);
          }
          _onDrag(positionRelative) {
              if (!this._currentDrag) {
                  return;
              }
              this._raycaster.setFromCamera(new Vector2(positionRelative.x, positionRelative.y), this._camera);
              let intersectionBottom = new Vector3(0, 0, -5);
              this._raycaster.ray.intersectPlane(this._planeBottom, intersectionBottom);
              let position;
              if (this._mode === 0 /* INTERSECTION_MODE.PLANNER */) {
                  position = intersectionBottom.clone();
                  position.y = this._currentDrag.parent.position.y;
              }
              else {
                  position = this._getIntersectionPosition(intersectionBottom);
                  position.sub(this._offset);
              }
              this._currentDrag.dispatchEvent({
                  type: "drag" /* OBJECT_EVENT.DRAG */,
                  attachment: { position },
              });
          }
          _getIntersectionPosition(intersectionBottom) {
              let bottomDistance = this._getDistanceToCamera(intersectionBottom);
              let yaw = this._camera.userData.yaw;
              let intersectionFront = new Vector3(0, 0, 0);
              let intersectionSide = new Vector3(0, 0, 0);
              this._raycaster.ray.intersectPlane(this._planeFront, intersectionFront);
              this._raycaster.ray.intersectPlane(this._planeSide, intersectionSide);
              let sideDistance = this._getDistanceToCamera(intersectionSide);
              let frontDistance = this._getDistanceToCamera(intersectionFront);
              let position;
              // if you are looking without any significant rotation to the plan object, we should use older plane detection with only front and bottom
              if (yaw >= -ROTATION_TO_DETECT_SIDE && yaw <= ROTATION_TO_DETECT_SIDE) {
                  if (bottomDistance < frontDistance) {
                      position = intersectionBottom.clone();
                  }
                  else {
                      position = intersectionFront.clone();
                  }
              }
              else {
                  // else we use newer plane detection with 3 planes (front, bottom side)
                  if (bottomDistance < frontDistance && bottomDistance < sideDistance) {
                      position = intersectionBottom.clone();
                  }
                  else if (frontDistance < bottomDistance &&
                      frontDistance < sideDistance) {
                      position = intersectionFront.clone();
                  }
                  else if (sideDistance < bottomDistance &&
                      sideDistance < frontDistance) {
                      position = intersectionSide.clone();
                  }
              }
              return position;
          }
          _getDistanceToCamera(intersection) {
              let vector = intersection.clone().sub(this._camera.position);
              let vectorLength = vector.length();
              if (vectorIsZero(intersection)) {
                  //no intersection found
                  vectorLength = Number.POSITIVE_INFINITY;
              }
              return vectorLength;
          }
          _onDragEnd(position) {
              if (!this._currentDrag) {
                  return;
              }
              this._currentDrag.dispatchEvent({
                  type: "drag_end" /* OBJECT_EVENT.DRAG_END */,
                  attachment: { position },
              });
              this._currentDrag = null;
          }
          _onRotate(position, rotation) {
              if (!this._currentRotate) {
                  let intersection = this._intersection(position);
                  if (!intersection) {
                      return;
                  }
                  this._currentRotate = intersection.object;
              }
              this._currentRotate.dispatchEvent({
                  type: "rotate" /* OBJECT_EVENT.ROTATE */,
                  attachment: { rotation },
              });
          }
          _positionPlanes(component) {
              if (this._mode === 0 /* INTERSECTION_MODE.PLANNER */) {
                  this._planeBottom.constant = 0;
                  if (this._camera.userData &&
                      this._camera.userData.pitch &&
                      this._camera.userData.pitch < 0) {
                      this._planeBottom.constant = -3;
                  }
              }
              else if (component &&
                  component.boundingBox &&
                  this._rootComponentPosition) {
                  this._planeBottom.constant =
                      -component.boundingBox.getCenter(new Vector3()).y -
                          this._rootComponentPosition.y;
                  //set side plane to component bounding box
                  this._planeSide.constant =
                      -component.boundingBox.getSize(new Vector3()).x * 2 +
                          component.boundingBox.getCenter(new Vector3()).x;
                  let yaw = this._camera.userData.yaw;
                  if (yaw > 0) {
                      this._planeSide.constant *= -1;
                  }
                  if (this._bounds) {
                      this._planeFront.constant =
                          this._bounds.z / 2 + component.boundingBox.getCenter(new Vector3()).z;
                  }
              }
          }
          _calculateOffset(component) {
              if (component && component.boundingBox) {
                  this._offset.copy(component.boundingBox.getCenter(new Vector3()));
                  this._offset.applyQuaternion(component.getWorldQuaternion(new Quaternion()));
              }
          }
          update(bounds, rootComponentPosition, backgroundScene) {
              if (bounds) {
                  this._bounds = bounds;
              }
              if (rootComponentPosition) {
                  this._rootComponentPosition = rootComponentPosition;
              }
              if (backgroundScene) {
                  this._backgroundScene = backgroundScene;
                  let child = this._backgroundScene.children[0];
                  if (child instanceof Mesh) {
                      child.geometry.computeBoundingBox();
                  }
              }
          }
          clear() {
              if (this._currentDrag) {
                  disposeMesh(this._currentDrag);
              }
              if (this._currentHover) {
                  disposeMesh(this._currentHover);
              }
          }
          enableDragIn(mesh) {
              this._currentDrag = mesh;
          }
          setRootComponentId(rootComponentId) {
              this._rootComponentId = rootComponentId;
          }
          setCamera(camera) {
              this._camera = camera;
          }
          setScene(scene) {
              this._scene = scene;
          }
          setMode(mode) {
              this._mode = mode;
          }
          intersectMouseOnScene(event) {
              const plane = new Plane();
              const planeNormal = new Vector3();
              planeNormal.copy(this._camera.position).normalize();
              plane.setFromNormalAndCoplanarPoint(planeNormal, this._scene.position);
              this._raycaster.setFromCamera(new Vector2(event.positionRelative.x, event.positionRelative.y), this._camera);
              return convertToKernel(this._raycaster.ray.intersectPlane(plane, new Vector3()));
          }
      }

      class SceneEventHandler extends EventDispatcher {
          constructor(creator, scene, camera, inputManager) {
              super();
              this._debug = false;
              this._dragIn = false;
              this._inputManager = inputManager;
              this._raycastHelper = new RaycastHelper(scene, camera, this._inputManager);
              this._creator_ = creator;
          }
          isDragIn() {
              return this._dragIn;
          }
          setDragIn(dragIn, dragEvent) {
              this._dragIn = dragIn;
              if (dragIn) {
                  this._inputManager.enableDragIn(dragEvent);
              }
              else {
                  this._raycastHelper.clear();
              }
              this._interaction();
          }
      } exports('S', SceneEventHandler);

      class SceneEventInfo {
          constructor(data) {
              const { component, preview, resetCamera, consecutive, type, forceRender } = data;
              this.component = component;
              this.preview = preview;
              this.resetCamera = resetCamera === undefined ? true : resetCamera;
              this.consecutive = consecutive === undefined ? true : consecutive;
              this.type = type ? type : 0 /* INPUT_EVENT_TYPE.UNKNOWN */;
              this.forceRender = forceRender !== undefined ? forceRender : false;
          }
      }
      class ConfiguratorSceneEventHandler extends SceneEventHandler {
          constructor(creator, scene, camera, inputManager) {
              super(creator, scene, camera, inputManager);
              this._cameraMoving = false;
              this._raycastHelper.addEventListener(0 /* RAYCAST_EVENT.CLICK_OUTSIDE */, () => {
                  this._clickOutside();
              }, this);
              this._selectionHandler.addEventListener(0 /* SELECTION_EVENT.SELECT_COMPONENT */, ({ component, consecutive }) => {
                  this.dispatchEvent(8 /* SCENE_EVENT.SELECT_COMPONENT */, new SceneEventInfo({ component, consecutive }));
                  this._inputManager.setDragEnabled(true);
              }, this);
              this._selectionHandler.addEventListener(1 /* SELECTION_EVENT.DESELECT_COMPONENT */, ({ component, resetCamera }) => {
                  if (!this._selectionHandler.hasSelection()) {
                      this._inputManager.setDragEnabled(false);
                  }
                  this.dispatchEvent(9 /* SCENE_EVENT.DESELECT_COMPONENT */, new SceneEventInfo({
                      component,
                      resetCamera,
                  }));
              }, this);
              this._addInputListeners(this._inputManager);
          }
          disable() {
              const layers = new Layers();
              layers.disableAll();
              this._raycastHelper.setLayers(layers);
              this._raycastHelper.disableEvents();
          }
          enable() {
              const layers = new Layers();
              layers.disableAll();
              layers.enable(4 /* LAYER.COMPONENT */);
              layers.enable(5 /* LAYER.PREVIEW */);
              layers.enable(7 /* LAYER.GIZMO */);
              layers.enable(8 /* LAYER.DIMENSIONS */);
              this._raycastHelper.setLayers(layers);
              this._raycastHelper.enableEvents();
          }
          _addInputListeners(inputManager) {
              inputManager.addEventListener(7 /* INPUT_EVENT.ZOOM_IN */, (_event) => this._interaction(), this);
              inputManager.addEventListener(8 /* INPUT_EVENT.ZOOM_OUT */, (_event) => this._interaction(), this);
          }
          addComponentHandlers(component) {
              this._addComponentHandlers(component, component.boundingBoxMesh, {
                  hasListener: true,
                  priority: 1,
                  roomleId: component.runtimeId,
              });
              component.meshes.forEach((mesh) => {
                  this._addComponentHandlers(component, mesh, {
                      hasListener: true,
                      priority: 2,
                      roomleId: component.runtimeId,
                  });
              });
          }
          addComponentDragInHandler(component) {
              if (!this._dragIn) {
                  return;
              }
              this._addComponentHandlers(component, component.boundingBoxMesh, {
                  hasListener: true,
                  priority: 1,
                  roomleId: component.runtimeId,
              });
              this._raycastHelper.enableDragIn(component.boundingBoxMesh);
          }
          _addComponentHandlers(component, mesh, componentEventInfo) {
              if (!mesh.userData.hasListener) {
                  Object.assign(mesh.userData, componentEventInfo);
                  mesh.addEventListener("select" /* OBJECT_EVENT.CLICK */, () => this.clickComponent(component));
                  mesh.addEventListener("hover_on" /* OBJECT_EVENT.HOVER_ON */, (event) => this._hoverOn(component, event.attachment.type));
                  mesh.addEventListener("hover_off" /* OBJECT_EVENT.HOVER_OFF */, (event) => this._hoverOff(component, event.attachment.type));
                  mesh.addEventListener("drag_start" /* OBJECT_EVENT.DRAG_START */, () => this._dragStart(component));
                  mesh.addEventListener("drag" /* OBJECT_EVENT.DRAG */, (event) => this._drag(component, event.attachment.position));
                  mesh.addEventListener("drag_end" /* OBJECT_EVENT.DRAG_END */, () => this._dragEnd(component));
              }
          }
          addPreviewHandlers(component) {
              let boundingBox = component.boundingBoxMesh;
              if (!boundingBox.userData.hasListener) {
                  boundingBox.userData = deepMerge(boundingBox.userData, {
                      hasListener: true,
                      priority: 3,
                      roomleId: component.runtimeId,
                  });
                  boundingBox.addEventListener("select" /* OBJECT_EVENT.CLICK */, () => this._clickPreview(component));
                  boundingBox.addEventListener("hover_on" /* OBJECT_EVENT.HOVER_ON */, () => this._hoverOnPreview(component));
                  boundingBox.addEventListener("hover_off" /* OBJECT_EVENT.HOVER_OFF */, () => this._hoverOffPreview(component));
              }
          }
          addPreviewLineHandlers(component) {
              let boundingBox = component.boundingLineMesh;
              if (!boundingBox.userData.hasListener) {
                  boundingBox.userData = deepMerge(boundingBox.userData, {
                      hasListener: true,
                      priority: 4,
                      roomleId: component.runtimeId,
                  });
                  boundingBox.addEventListener("select" /* OBJECT_EVENT.CLICK */, () => this._clickPreviewLine(component));
                  boundingBox.addEventListener("hover_on" /* OBJECT_EVENT.HOVER_ON */, (event) => this._hoverOnPreviewLine(component, event.attachment.intersection));
                  boundingBox.addEventListener("hover_move" /* OBJECT_EVENT.HOVER_MOVE */, (event) => this._hoverMovePreviewLine(component, event.attachment.intersection));
                  boundingBox.addEventListener("hover_off" /* OBJECT_EVENT.HOVER_OFF */, () => this._hoverOffPreviewLine(component));
              }
          }
          _clickPreview(preview) {
              if (this._dragStartPosition) {
                  preview.position.copy(this._dragStartPosition);
                  this._dragStartPosition = null;
              }
              this.dispatchEvent(7 /* SCENE_EVENT.CLICK_PREVIEW */, new SceneEventInfo({ preview }));
          }
          _clickPreviewLine(preview) {
              if (this._dragStartPosition) {
                  preview.position.copy(this._dragStartPosition);
                  this._dragStartPosition = null;
              }
              this.dispatchEvent(7 /* SCENE_EVENT.CLICK_PREVIEW */, new SceneEventInfo({ preview }));
          }
          clickComponent(component) {
              if (this._debug) {
                  console.log('select: ' + component.runtimeId);
              }
              this._selectionHandler.check(component);
              this._configuratorUiCallbacks.onClickComponent(component);
          }
          _clickOutside() {
              this._selectionHandler.cancelSelection();
              this.dispatchEvent(3 /* SCENE_EVENT.CLICK_OUTSIDE */);
              this._interaction();
          }
          _hoverOn(component, type) {
              if (this._cameraMoving) {
                  return;
              }
              if (this._debug) {
                  console.log('hover_on: ' + component.runtimeId);
              }
              component.hoverOn();
              this._interaction();
              this.dispatchEvent(1 /* SCENE_EVENT.HOVER_ON */, new SceneEventInfo({ component, type }));
              this._hoveredComponent = component;
          }
          _hoverOff(component, type) {
              if (this._cameraMoving) {
                  return;
              }
              if (this._debug) {
                  console.log('hover_off: ' + component.runtimeId);
              }
              component.hoverOff();
              this._interaction();
              this.dispatchEvent(2 /* SCENE_EVENT.HOVER_OFF */, new SceneEventInfo({ component, type }));
              this._hoveredComponent = null;
          }
          _hoverOnPreview(component) {
              component.hoverOn();
              this._interaction(true);
              this._hoveredPreview = component;
          }
          _hoverOffPreview(component) {
              component.hoverOff();
              this._interaction(true);
              this._hoveredPreview = null;
          }
          _hoverOnPreviewLine(component, intersection) {
              this._updatePositionForPreviewLine(component, intersection);
              if (!this._draggedComponent) {
                  component.hoverOn();
              }
              this._interaction();
              this._hoveredPreview = component;
          }
          _hoverMovePreviewLine(component, intersection) {
              this._updatePositionForPreviewLine(component, intersection);
              this._hoveredPreview = component;
              this._interaction(true);
          }
          _updatePositionForPreviewLine(previewLineComponent, intersection) {
              let intersectionPoint = intersection.object.parent.parent.worldToLocal(intersection.point);
              this._previewLineIntersection = intersectionPoint;
              if (previewLineComponent) {
                  if (!this._draggedComponent) {
                      previewLineComponent.updatePreviewPosition(intersectionPoint);
                  }
                  else {
                      this._draggedComponent.visible = true;
                  }
              }
          }
          _hoverOffPreviewLine(component) {
              if (!this._draggedComponent) {
                  component.hoverOff();
              }
              this._interaction();
              this._hoveredPreview = null;
              this._previewLineIntersection = null;
          }
          _setDragComponentShadow(enabled) {
              var _a;
              (_a = this._draggedComponent) === null || _a === void 0 ? void 0 : _a.traverse((node) => {
                  if (node instanceof Mesh) {
                      const castedMesh = node;
                      if (enabled && castedMesh.castShadowOld !== undefined) {
                          castedMesh.receiveShadow = castedMesh.receiveShadowOld;
                          castedMesh.castShadow = castedMesh.castShadowOld;
                      }
                      else {
                          castedMesh.receiveShadowOld = node.receiveShadow;
                          castedMesh.castShadowOld = node.castShadow;
                          castedMesh.receiveShadow = false;
                          castedMesh.castShadow = false;
                      }
                  }
              });
          }
          _dragStart(component) {
              if (!component ||
                  (!this._selectionHandler.isSelected(component) && !this.isDragIn())) {
                  return;
              }
              this._dragStartPosition = component.position.clone();
              this._dragStartRotation = component.rotation.clone();
              this._draggedComponent = component;
              this._setDragComponentShadow(false);
              this.dispatchEvent(4 /* SCENE_EVENT.DRAG_START */, new SceneEventInfo({ component }));
              this._interaction();
          }
          _drag(component, position) {
              if (!component ||
                  (!this._selectionHandler.isSelected(component) && !this.isDragIn())) {
                  return;
              }
              if (component && !this._draggedComponent) {
                  this._draggedComponent = component;
              }
              if (this._previewLineIntersection) {
                  let previewLineComponent = this._hoveredPreview;
                  let positionLine = previewLineComponent.getPositionForIntersectionPoint(this._previewLineIntersection);
                  let posInGlobal = previewLineComponent.parent.localToWorld(positionLine);
                  this._draggedComponent.position.copy(this._draggedComponent.parent.worldToLocal(posInGlobal));
                  this._draggedComponent.rotation.copy(previewLineComponent.docklineRotation);
                  previewLineComponent.hideSelectionLine();
              }
              else if (component.parent) {
                  component.position.copy(component.parent.worldToLocal(position));
              }
              else {
                  component.position.copy(position);
              }
              if (this._hoveredPreview) {
                  component.visible = false;
              }
              else {
                  component.visible = true;
              }
              this.dispatchEvent(5 /* SCENE_EVENT.DRAG_MOVE */, new SceneEventInfo({ component }));
              this._interaction();
          }
          _dragEnd(component) {
              if (!component ||
                  (!this._selectionHandler.isSelected(component) && !this.isDragIn())) {
                  return;
              }
              if (this._hoveredPreview && this._previewLineIntersection) {
                  let previewLineComponent = this._hoveredPreview;
                  let positionLine = previewLineComponent.getPositionForIntersectionPoint(this._previewLineIntersection);
                  let posInGlobal = previewLineComponent.parent.localToWorld(positionLine);
                  component.position.copy(component.parent.worldToLocal(posInGlobal));
                  component.rotation.copy(previewLineComponent.docklineRotation);
              }
              else if (this._dragStartPosition && this._dragStartRotation) {
                  component.position.copy(this._dragStartPosition);
                  component.rotation.copy(this._dragStartRotation);
                  this._dragStartPosition = null;
                  this._dragStartRotation = null;
                  //listeners are somehow removed on drag
                  this.addComponentHandlers(component);
              }
              component.visible = true;
              this._setDragComponentShadow(true);
              this._draggedComponent = null;
              this._previewLineIntersection = null;
              this.dispatchEvent(6 /* SCENE_EVENT.DRAG_END */, new SceneEventInfo({ component, preview: this._hoveredPreview }));
              this._interaction();
          }
          _interaction(forceRender) {
              this.dispatchEvent(0 /* SCENE_EVENT.INTERACTION */, new SceneEventInfo({ forceRender }));
          }
          hasSelection() {
              return this._selectionHandler.hasSelection();
          }
          update(bounds, rootComponentPosition, backgroundScene) {
              this._raycastHelper.update(bounds, rootComponentPosition, backgroundScene);
          }
          isDragIn() {
              return this._dragIn;
          }
          isDragging() {
              return this._draggedComponent != null;
          }
          setRootComponentId(rootComponentId) {
              this._raycastHelper.setRootComponentId(rootComponentId);
          }
          cancelSelection() {
              this._selectionHandler.setSelectionMode("standard" /* SELECTION_MODE.STANDARD */);
              this._selectionHandler.cancelSelection();
          }
          setSelectionMode(mode) {
              this._selectionHandler.setSelectionMode(mode);
          }
          getSelectionMode() {
              return this._selectionHandler.getSelectionMode();
          }
          getSelectedRuntimeComponentIds() {
              return this._selectionHandler.getSelectedRuntimeComponentIds();
          }
          setCameraMoving(cameraMoving) {
              if (cameraMoving && this._hoveredComponent) {
                  this._hoverOff(this._hoveredComponent, 0 /* INPUT_EVENT_TYPE.UNKNOWN */);
              }
              this._cameraMoving = cameraMoving;
          }
          setCamera(camera) {
              this._raycastHelper.setCamera(camera);
          }
      }
      __decorate([
          inject
      ], ConfiguratorSceneEventHandler.prototype, "_selectionHandler", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneEventHandler.prototype, "_configuratorUiCallbacks", void 0);

      class UiIntersectionHelper extends EventDispatcher {
          constructor(camera) {
              super();
              this._uiIntersectionMask = 0;
              this.floorEnvironment = false;
              this._camera = camera;
          }
          updateToBounds(bounds, clientWidth, clientHeight) {
              let minVector = new Vector3(-bounds.x / 2, 0, -bounds.z / 2);
              let maxVector = new Vector3(bounds.x / 2, bounds.y, bounds.z / 2);
              this._boundingBox = new Box3(minVector, maxVector);
              this._clientWidth = clientWidth;
              this._clientHeight = clientHeight;
              //the intersection calculation could be improved by using all 8 vertices of the bounding box
              let size = this._boundingBox.getSize(new Vector3());
              this._boxVertices = [];
              this._boxVertices.push(this._boundingBox.min);
              this._boxVertices.push(this._boundingBox.min.clone().add(new Vector3(size.x, 0, 0)));
              this._boxVertices.push(this._boundingBox.max);
              this._boxVertices.push(this._boundingBox.max.clone().sub(new Vector3(size.x, 0, 0)));
          }
          set canvasOffset(offset) {
              this._offset = offset;
              this.calculateUIIntersection();
          }
          calculateUIIntersection() {
              let result = [];
              if (this._boundingBox == null || this._offset == null) {
                  return;
              }
              let paddings = this._checkPaddings();
              paddings.bottom = this._clientHeight - paddings.bottom;
              paddings.right = this._clientWidth - paddings.right;
              let mask = 0;
              if (this.floorEnvironment) {
                  result = ['left', 'right', 'bottom'];
                  mask = 1 | 2 | 8;
              }
              else {
                  if (this._offset.left > 0 &&
                      paddings.left < this._offset.left * this._clientWidth) {
                      result.push('left');
                      mask |= 8;
                  }
                  if (this._offset.right < 1 &&
                      paddings.right < (1 - this._offset.right) * this._clientWidth) {
                      result.push('right');
                      mask |= 2;
                  }
                  if (this._offset.bottom > 0 &&
                      paddings.bottom < this._offset.bottom * this._clientHeight) {
                      result.push('bottom');
                      mask |= 1;
                  }
              }
              if (this._offset.top < 1 &&
                  paddings.top < (1 - this._offset.top) * this._clientHeight) {
                  result.push('top');
                  mask |= 4;
              }
              if (mask !== this._uiIntersectionMask) {
                  this.dispatchEvent(0 /* UI_INTERSECTION_EVENT.CHANGE */, result);
                  this._uiIntersectionMask = mask;
              }
          }
          _checkPaddings() {
              let paddings = {
                  left: this._clientWidth / 2,
                  top: this._clientHeight / 2,
                  right: this._clientWidth / 2,
                  bottom: this._clientHeight / 2,
              };
              this._boxVertices.forEach((value) => {
                  let pixelPosition = getScreenXY(value, this._camera, this._clientWidth, this._clientHeight);
                  if (pixelPosition.x < paddings.left) {
                      paddings.left = pixelPosition.x;
                  }
                  if (pixelPosition.x > paddings.right) {
                      paddings.right = pixelPosition.x;
                  }
                  if (pixelPosition.y < paddings.top) {
                      paddings.top = pixelPosition.y;
                  }
                  if (pixelPosition.y > paddings.bottom) {
                      paddings.bottom = pixelPosition.y;
                  }
              });
              return paddings;
          }
      }

      class ConfiguratorSceneManager extends SceneManager {
          constructor(creator, offset, mode) {
              super(creator, offset, CANVAS_ID.HSC, mode);
              this._configuratorContext.baseContext = "configurator" /* BASE_CONTEXT.CONFIGURATOR */;
              this._getViewModel().setListener(this);
              this._sceneEventHandler = new ConfiguratorSceneEventHandler(this._creator_, this._scene, this._getCameraControl().getCamera(), this._getInputManager());
              this._sceneEventHandler.addEventListener(0 /* SCENE_EVENT.INTERACTION */, ({ forceRender }) => {
                  this._uiIntersectionHelper.calculateUIIntersection();
                  if (forceRender) {
                      this._renderEverything();
                  }
              }, this);
              this._sceneEventHandler.addEventListener(1 /* SCENE_EVENT.HOVER_ON */, ({ component, type }) => this._onHoverOn(component, type), this);
              this._sceneEventHandler.addEventListener(2 /* SCENE_EVENT.HOVER_OFF */, ({ component, type }) => this._onHoverOff(component, type), this);
              this._sceneEventHandler.addEventListener(3 /* SCENE_EVENT.CLICK_OUTSIDE */, () => {
                  this._configuratorUiCallbacks.onClickOutside();
                  this._cameraControl.unlock();
                  this._cancelDockings(false, null, this._getViewModel().hasPreviews(), true, false);
                  this.cancelComponentSelection(true);
                  if (this._componentRaycastHelper) {
                      this._componentRaycastHelper.checkComponentVisibility(this._sceneEventHandler, this._getViewModel());
                  }
                  this._requestRender();
              }, this);
              this._sceneEventHandler.addEventListener(8 /* SCENE_EVENT.SELECT_COMPONENT */, ({ component, consecutive }) => {
                  if (this._getViewModel().hasPreviews()) {
                      this._cancelDockings(false, null, this._getViewModel().hasPreviews(), true, false);
                  }
                  this._selectComponent(component, consecutive);
                  this._requestRender();
              }, this);
              this._sceneEventHandler.addEventListener(9 /* SCENE_EVENT.DESELECT_COMPONENT */, ({ component, resetCamera }) => {
                  this._deselectComponent(component, resetCamera);
                  this._requestRender();
              }, this);
              this._sceneEventHandler.addEventListener(4 /* SCENE_EVENT.DRAG_START */, ({ component }) => {
                  var _a;
                  //fixes #142 start
                  if (this._sceneEventHandler.getSelectionMode() ===
                      "multiselect" /* SELECTION_MODE.MULTISELECT */) {
                      this.cancelComponentSelection();
                  }
                  // fixes #142 end
                  this._requestDockingsPreviewWithDrag(component.runtimeId);
                  this._cameraControl.lock();
                  (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.enableUiInteractionMode();
                  this._requestRender();
              }, this);
              this._sceneEventHandler.addEventListener(5 /* SCENE_EVENT.DRAG_MOVE */, () => {
                  this._renderEverything();
              }, this);
              this._sceneEventHandler.addEventListener(6 /* SCENE_EVENT.DRAG_END */, ({ component, preview }) => {
                  var _a;
                  if (preview) {
                      let hoveredOver = preview;
                      if (this._getViewModel().isPreviewLine(hoveredOver)) {
                          this._getViewModel().dockComponentWithPosition(hoveredOver, component);
                      }
                      else if (this._getViewModel().isPreview(hoveredOver)) {
                          this._dockComponent(hoveredOver);
                      }
                      this._cancelDockings(!preview, component, true, true);
                  }
                  else {
                      let componentToDelete = this._sceneEventHandler.isDragIn()
                          ? component
                          : null;
                      this._cancelDockings(this._sceneEventHandler.isDragIn(), componentToDelete, false, true);
                      const boundingBox = this._getViewModel().getBoundingBox();
                      if (this._environment && this._environment.needsBounds()) {
                          this._environment.updateBounds(boundingBox.getSize(new Vector3()));
                      }
                  }
                  this._cameraControl.unlock();
                  (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.disableUiInteractionMode();
                  this._renderEverything();
              }, this);
              this._sceneEventHandler.addEventListener(7 /* SCENE_EVENT.CLICK_PREVIEW */, ({ preview }) => {
                  if (this._getViewModel().isPreview(preview)) {
                      if (this._getViewModel().isPreviewLine(preview)) {
                          this._getViewModel().dockComponentWithPosition(preview);
                      }
                      else {
                          this._dockComponent(preview);
                      }
                      this._cancelDockings(false, null, !this._getViewModel().hasPreviews(), false, false);
                      this.requestDockingsPreview(false);
                      this._requestRender();
                  }
              }, this);
              this._cameraControl.addEventListener(0 /* CAMERA_EVENT.ORBIT_START */, () => {
                  this._configuratorUiCallbacks.onCameraPositionChanges();
                  this._sceneEventHandler.setCameraMoving(true);
                  this._requestRender();
              }, this);
              this._cameraControl.addEventListener(1 /* CAMERA_EVENT.ORBIT_MOVE */, () => {
                  if (this._componentRaycastHelper) {
                      this._componentRaycastHelper.checkComponentAndPreviewVisibility(this._sceneEventHandler, this._getViewModel());
                  }
                  this._requestRender();
              }, this);
              this._cameraControl.addEventListener(2 /* CAMERA_EVENT.ORBIT_END */, () => {
                  this._sceneEventHandler.setCameraMoving(false);
                  this._updateComponentPosition();
                  this._requestRender();
              }, this);
              this._cameraControl.addEventListener(5 /* CAMERA_EVENT.ZOOM_CHANGE */, ({ minZoom, maxZoom }) => {
                  this._configuratorUiCallbacks.onZoomChange(minZoom, maxZoom);
              }, this);
              this._cameraControl.addEventListener(3 /* CAMERA_EVENT.ZOOM_IN */, () => {
                  this._configuratorUiCallbacks.onCameraPositionChanges();
                  this._updateComponentPosition();
                  this._requestRender();
              }, this);
              this._cameraControl.addEventListener(4 /* CAMERA_EVENT.ZOOM_OUT */, () => {
                  this._configuratorUiCallbacks.onCameraPositionChanges();
                  this._updateComponentPosition();
                  this._requestRender();
              }, this);
              this._cameraControl.addEventListener(7 /* CAMERA_EVENT.MOVING */, () => {
                  this._pluginSystem.moveCameraStart(this._getCameraControl().getCamera().position);
              }, this);
              this._cameraControl.addEventListener(8 /* CAMERA_EVENT.IDLE */, () => {
                  this._pluginSystem.moveCameraEnd(this._getCameraControl().getCamera().position);
              }, this);
              if (!Env.isProduction) {
                  window.__RML__DEBUG__.SceneHelper = this;
              }
              this.enableConfiguratorEvents();
              this._initOptionalModules();
              this._offsetAnimationStart = callAgainAfter(this._offsetAnimationStart.bind(this), 250);
              this._offsetAnimationEnd = debounce(this._offsetAnimationEnd.bind(this), 32);
          }
          async _initOptionalModules() {
              const { transparentHighlighting } = this._initData;
              if (transparentHighlighting) {
                  const { default: ComponentRaycastHelperClass } = await module.import('./component-raycast-helper-800a6b86.nomodule.js');
                  this._componentRaycastHelper = new ComponentRaycastHelperClass();
                  this._componentRaycastHelper.init(this._scene, this._getCameraControl().getCamera());
              }
          }
          disableEvents() {
              this.disableConfiguratorEvents();
          }
          enableEvents() {
              if (this._configuratorContext.baseContext === "configurator" /* BASE_CONTEXT.CONFIGURATOR */) {
                  this.enableConfiguratorEvents();
              }
          }
          enableConfiguratorEvents() {
              this._sceneEventHandler.enable();
          }
          disableConfiguratorEvents() {
              this._sceneEventHandler.disable();
          }
          _getViewModel() {
              if (!this._viewModel) {
                  this._viewModel = RoomleDependencyInjection.lookup('configurator-view-model', this._creator_);
                  this._viewModel.setRequestRenderCallback(() => this._renderEverything());
                  this._viewModel.setRequestRenderSceneUpdateCallback(() => { var _a; return (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.clearCache(); });
              }
              return this._viewModel;
          }
          _getKernelAccess() {
              return this._plannerKernelAccess;
          }
          _showDockings() {
              var _a, _b, _c;
              (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.enableUiInteractionMode();
              if ((_c = (_b = this._initData) === null || _b === void 0 ? void 0 : _b.featureFlags) === null || _c === void 0 ? void 0 : _c.pulsePreview) {
                  this._renderEverything();
                  const interval = setInterval(() => this._renderEverything(), 16);
                  setTimeout(() => clearInterval(interval), (PULSE_LOOPS + 1) * PULSE_DURATION);
              }
          }
          cancelDockings() {
              this._cancelDockings(true, null, true, true, false);
              this._renderEverything();
          }
          _cancelDockings(shouldHandleComponentDeletion, componentToDelete, arePreviewsExisting, notifyUi, updateCamera = true) {
              var _a, _b;
              (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.disableUiInteractionMode();
              if (shouldHandleComponentDeletion) {
                  this._sceneEventHandler.setDragIn(false);
                  this._getViewModel().removeDockingComponent();
                  if (componentToDelete) {
                      this._scene.remove(componentToDelete);
                  }
              }
              this._getViewModel().removePreviews();
              if (arePreviewsExisting && updateCamera) {
                  this._updateCameraToBounds();
              }
              if (notifyUi && arePreviewsExisting) {
                  this._configuratorUiCallbacks.onDockingsPreviewRemoved();
              }
              if (this._componentRaycastHelper) {
                  this._componentRaycastHelper.changeMaterialsOnSelect(this._scene, null);
              }
              if (arePreviewsExisting) {
                  (_b = this._roomleRenderer) === null || _b === void 0 ? void 0 : _b.forceShadowUpdates(true);
              }
          }
          _onHoverOn(component, type) {
              if (type !== 2 /* INPUT_EVENT_TYPE.TOUCH */) {
                  this._highlightComponent(component);
              }
              if (this._componentDimensioningHelper &&
                  this._componentDimensioningHelper.add(component)) {
                  //render component dimensions
                  this._renderEverything();
              }
          }
          _onHoverOff(component, type) {
              if (type !== 2 /* INPUT_EVENT_TYPE.TOUCH */) {
                  this._highlightComponent();
              }
              if (this._componentDimensioningHelper &&
                  this._componentDimensioningHelper.hasComponentDimensions()) {
                  this._componentDimensioningHelper.remove(component);
                  this._renderEverything();
              }
              this._requestRender();
          }
          _highlightComponent(component = null, ids = []) {
              var _a;
              if (!this._shouldHighlight()) {
                  return;
              }
              const selectedMeshes = [];
              const useMesh = this._initData.meshSelection;
              if (component) {
                  if (useMesh) {
                      selectedMeshes.push(...component.meshes);
                  }
                  else if (component.boundingBoxMesh) {
                      selectedMeshes.push(component.boundingBoxMesh);
                  }
              }
              else if (!ids || !ids.length) {
                  ids = this._sceneEventHandler.getSelectedRuntimeComponentIds();
              }
              this._getViewModel()
                  .getComponentsForIds(ids)
                  .forEach((selectedComponent) => {
                  if (selectedComponent) {
                      if (useMesh) {
                          selectedMeshes.push(...selectedComponent.meshes);
                      }
                      else if (selectedComponent.boundingBoxMesh) {
                          selectedMeshes.push(selectedComponent.boundingBoxMesh);
                      }
                  }
              });
              (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.highlightObjects(selectedMeshes);
          }
          shouldClearShadowsAndAO() {
              var _a;
              return (super.shouldClearShadowsAndAO() || !((_a = this._sceneEventHandler) === null || _a === void 0 ? void 0 : _a.isDragging()));
          }
          resume() {
              super.resume();
              this._getViewModel().materialQueue.registerCallback(() => this._materialLoaded());
              this._configuratorMeshGenerator.setMaterialLoadedListener(() => {
                  this._renderWithoutShadowsAndAO();
              });
          }
          _materialLoaded() {
              this._renderEverything();
          }
          pause() {
              super.pause();
              this._getViewModel().materialQueue.unregisterCallback();
              this._configuratorMeshGenerator.removeMaterialLoadedListener();
          }
          _setupScene(offset, transparent, skipLightSetup) {
              super._setupScene(offset, transparent);
              this._uiIntersectionHelper = new UiIntersectionHelper(this._getCameraControl().getCamera());
              this._uiIntersectionHelper.canvasOffset = offset;
              this._uiIntersectionHelper.addEventListener(0 /* UI_INTERSECTION_EVENT.CHANGE */, (result) => {
                  this._configuratorUiCallbacks.onUiIntersectionChange(result);
              }, this);
              this._configuratorMeshGenerator.maxAnisotropy = this._maxAnisotropy;
              this._configuratorMeshGenerator.maxTextures =
                  this._renderer.capabilities.maxTextures;
              this._configuratorMeshGenerator.setMaterialLoadedListener(() => {
                  this._renderWithoutShadowsAndAO();
              });
              this._domHelper.element.appendChild(this._renderer.domElement);
              if (!skipLightSetup &&
                  this._initData.legacyLight &&
                  !this._initData.ls &&
                  !this._initData.dls) {
                  if (this._renderer.capabilities.maxTextures > 8) {
                      this.loadDynamicLightSetting(DynamicLightSettingLoader.createDynamicLightSettingSource(null, PREDEFINED_LIGHTSETTING.CAMERA));
                  }
                  else {
                      this._lightSetting = new DefaultLightSetting(this._scene, this._lightSetting);
                  }
              }
              this._requestRender();
              if (!transparent) {
                  this._setEnvironment(new BackgroundEnvironment(this._scene, this._environment, getColor(this._initData.colors.DEFAULT_BACKGROUND)));
              }
              // this._setEnvironment(
              //   new GroundProjectedEnvironment(
              //     this._scene,
              //     this._environment,
              //     this._hdrEnvironmentLoader.getEnvironmentMap()
              //   )
              // );
              this._getViewModel().materialQueue.registerCallback(() => this._materialLoaded());
          }
          sceneCleared(shouldHardReset) {
              this._internalClearScene(shouldHardReset);
          }
          display(component) {
              this._scene.add(component);
              this.setRootComponentId(component.runtimeId);
              this._requestRender();
          }
          setRootComponentId(rootComponentId) {
              this._sceneEventHandler.setRootComponentId(rootComponentId);
          }
          debugSceneGraph(id) {
              this._getViewModel().debugSceneGraph(id);
              this._printObjectGraph(this._scene, '');
          }
          debugScene() {
              return this._scene;
          }
          _printObjectGraph(object, prefix) {
              const opacity = object.material
                  ? object.material.opacity
                  : undefined;
              console.log(prefix +
                  object.type +
                  ' id:' +
                  object.id +
                  ' roomleId: ' +
                  object.runtimeId, opacity, object);
              if (object.children.length > 0) {
                  object.children.forEach((child) => {
                      let newPrefix = prefix + '    ';
                      this._printObjectGraph(child, newPrefix);
                  });
              }
          }
          clearScene() {
              var _a;
              this._getCameraControl().clear();
              this._internalClearScene(false);
              (_a = this._sceneEventHandler) === null || _a === void 0 ? void 0 : _a.cancelSelection();
              this._pluginSystem.clearScene(this._scene, this._uiScene);
          }
          planObjectConstructionDone(_planObject) {
              this._componentDimensioningHelper.reset();
              this._componentDimensioningHelper.setCamera(this._getCameraControl().getCamera());
          }
          _internalClearScene(shouldHardReset) {
              var _a;
              this._scene.children.forEach((child) => {
                  if (child.type === 'Object3D' ||
                      child.type === 'Mesh' ||
                      child.type === 'Line') {
                      this._scene.remove(child);
                  }
              });
              this._uiScene.children.forEach((child) => {
                  this._uiScene.remove(child);
              });
              this._getViewModel().sceneCleared();
              (_a = this._componentDimensioningHelper) === null || _a === void 0 ? void 0 : _a.invalidateDimensioningsCache();
              if (shouldHardReset || this._memoryManager.shouldHardReset()) {
                  this._configuratorMeshGenerator.clear();
                  this._renderer.renderLists.dispose();
                  // this executed call should only be done here and NOT within kernel access.
                  // WHY? because we clear memory managers counts, then we won't hard reset our scene.
                  // THIS IS IMPORTANT
                  this._memoryManager.executedHardReset();
              }
              this._renderEverything();
          }
          async preparePerspectiveImage(options = {}) {
              var _a, _b;
              await this._externalMeshesAndMaterialsReady();
              const { showDimensions = false } = options;
              this._cancelDockings(true, null, true, true);
              this._clearSelectionAndHovers();
              const camera = this._getCameraControl().getCamera().clone();
              camera.resetOffset();
              let cameraTarget = this._calculateBoundingBoxOfAllMeshes(0, showDimensions);
              (_a = this._lightSetting) === null || _a === void 0 ? void 0 : _a.removeFromScene();
              const dimensionsEnabled = this._dimensionHelper
                  ? this._dimensionHelper.areDimensionsEnabled()
                  : false;
              if (dimensionsEnabled) {
                  this._dimensionHelper.disableDimensions();
              }
              const objectRotation = this._getCameraControl().getObjectRotation();
              if (showDimensions) {
                  await this._initDimensions();
                  await this._dimensionHelper.isInitialized();
                  const angleY = -30 + toDegrees(objectRotation);
                  ImageRenderer.placeCameraForPerspectiveImage(camera, cameraTarget, -20, angleY);
                  this._dimensionHelper.enableDimensions();
                  this._dimensionHelper.moveCameraEnd(camera.position);
                  // update camera target again when dimensions are initialized
                  cameraTarget = this._calculateBoundingBoxOfAllMeshes(0, showDimensions);
              }
              if (this._componentDimensioningHelper &&
                  this._componentDimensioningHelper.hasComponentDimensions()) {
                  await this._componentDimensioningHelper.reset();
              }
              const image = await this._imageRenderer.preparePerspectiveImage(this._scene, this._uiScene, camera, cameraTarget, options, objectRotation, this._initData.e2e);
              if (dimensionsEnabled) {
                  this._dimensionHelper.enableDimensions();
              }
              else if (showDimensions) {
                  this._dimensionHelper.disableDimensions();
              }
              (_b = this._lightSetting) === null || _b === void 0 ? void 0 : _b.addToScene();
              this._requestRender();
              return image;
          }
          async renderImage(renderOptions) {
              await this._externalMeshesAndMaterialsReady();
              if (this._getViewModel().getPreviews()) {
                  this._cancelDockings(true, null, true, true);
              }
              this._clearSelectionAndHovers();
              let camera = this._getCameraControl().getCamera();
              let cameraTarget = null;
              if (!renderOptions.useCurrentPerspective) {
                  camera = this._getCameraControl().getCamera().clone();
                  camera.resetOffset();
                  cameraTarget = this._calculateBoundingBoxOfAllMeshes();
              }
              const dimensionsEnabled = this._dimensionHelper
                  ? this._dimensionHelper.areDimensionsEnabled()
                  : false;
              if (dimensionsEnabled) {
                  this._dimensionHelper.disableDimensions();
              }
              if (this._componentDimensioningHelper &&
                  this._componentDimensioningHelper.hasComponentDimensions()) {
                  await this._componentDimensioningHelper.reset();
              }
              const image = await this._imageRenderer.renderPerspectiveImage(this._scene, camera, cameraTarget);
              if (dimensionsEnabled) {
                  this._dimensionHelper.enableDimensions();
              }
              this._requestRender();
              return image;
          }
          async preparePartImage(partId, options) {
              return new Promise((resolve, reject) => {
                  this._getViewModel()
                      .requestSubPartConstruction(partId)
                      .then(async (mesh) => {
                      if (!options.size) {
                          options.size = 256;
                      }
                      const camera = this._getCameraControl().getCamera().clone();
                      camera.resetOffset();
                      let cameraTarget = ImageRenderer.getCameraTargetForBBox(new Box3().setFromObject(mesh));
                      const scene = createEmptySceneFromCurrent(this._scene);
                      scene.add(mesh);
                      const image = await this._imageRenderer.preparePerspectiveImage(scene, null, camera, cameraTarget, options);
                      dispose(scene);
                      resolve(image);
                  }, reject);
              });
          }
          _calculateBoundingBoxOfAllMeshes(spacing = 0, showDimensions) {
              let bbox = null;
              if (showDimensions && this._dimensionHelper) {
                  bbox = this._dimensionHelper.getBoundingBox();
              }
              else {
                  bbox = this._getViewModel().getBoundingBox();
              }
              return ImageRenderer.getCameraTargetForBBox(bbox, spacing);
          }
          async _externalMeshesAndMaterialsReady() {
              // wait for external meshes and then wait for materials
              // materials are loaded AFTER external meshes are loaded
              await this._getKernelAccess().externalMeshQueue.finished(true);
              await this._getViewModel().materialQueue.finished(true);
          }
          async prepareTopImage(options = {}) {
              var _a, _b;
              await this._externalMeshesAndMaterialsReady();
              const { showDimensions = false } = options;
              this._cancelDockings(true, null, true, true);
              this._clearSelectionAndHovers();
              if (showDimensions) {
                  await this._initDimensions();
                  await this._dimensionHelper.isInitialized();
                  this._dimensionHelper.enableTopDimensions();
              }
              if (this._componentDimensioningHelper &&
                  this._componentDimensioningHelper.hasComponentDimensions()) {
                  await this._componentDimensioningHelper.reset();
              }
              let cameraTarget = this._calculateBoundingBoxOfAllMeshes(0.1, showDimensions);
              (_a = this._lightSetting) === null || _a === void 0 ? void 0 : _a.removeFromScene();
              let image = await this._imageRenderer.prepareTopImage(this._scene, this._uiScene, cameraTarget, options);
              if (showDimensions) {
                  this._dimensionHelper.disableTopDimensions();
              }
              (_b = this._lightSetting) === null || _b === void 0 ? void 0 : _b.addToScene();
              this._requestRender();
              return image;
          }
          enableDragIn(dragEvent) {
              this._sceneEventHandler.setDragIn(true, dragEvent);
              this._requestRender();
          }
          zoomToComponent(component) {
              this._cameraControl.saveState(false);
              let bounds = component.boundingBox.getSize(new Vector3());
              let wantedAngle = getYRotationOfObject(component);
              let rotation = new Euler(0, wantedAngle, 0);
              let target = component
                  .getWorldPosition(new Vector3())
                  .clone()
                  .add(component.boundingBox.getCenter(new Vector3()).applyEuler(rotation));
              const size = new Vector2();
              this._renderer.getSize(size);
              const targetCameraParams = {
                  yaw: rotation.y,
                  pitch: toRadiant(15),
                  distance: getIdealDistance(bounds.x, bounds.y, bounds.z, this._getCameraControl().getCamera().fov, size.width, size.height) * DISTANCE_FACTOR,
                  targetX: target.x,
                  targetY: target.y,
                  targetZ: target.z,
                  blockOtherTweens: true,
              };
              // Don't zoom to component if we are already zoomed in.
              if (!areCameraParametersEqual(this._cameraControl.getCurrentCameraParameters(), targetCameraParams)) {
                  this._configuratorUiCallbacks.onZoomToComponent();
                  this._getCameraControl().zoomTo(targetCameraParams);
              }
          }
          resetCamera() {
              if (this._cameraControl.hasSavedState()) {
                  this.resetCameraToState();
              }
              else {
                  this.resetCameraPositionToStart(false);
              }
          }
          resetCameraToState() {
              if (this._cameraControl.hasSavedState()) {
                  this._cameraControl.resetToState();
              }
          }
          resetCameraPositionToStart(animate = true) {
              this._requestRender();
              const boundingBox = this._getViewModel().getBoundingBox();
              if (!boundingBox || !(this._cameraControl instanceof CameraControl3D)) {
                  // this could happen if Core breaks during parsing of a rootComponent
                  return;
              }
              this._getCameraControl().reset(boundingBox, undefined, undefined, undefined, animate);
          }
          _clearSelectionAndHovers() {
              this.cancelComponentSelection();
              this._getViewModel().clearRootComponent();
          }
          resetPreviews() {
              this._getViewModel().removePreviews();
              this._requestRender();
          }
          changeOffset(offset) {
              this._getCameraControl().getCamera().offset = offset;
              if (this._uiIntersectionHelper) {
                  this._uiIntersectionHelper.canvasOffset = offset;
              }
          }
          updateCamera(changeCamera = true) {
              super.updateCamera();
              this._updateCameraToBounds(null, changeCamera);
          }
          setCameraOffset(offset) {
              this._offsetAnimationStart();
              if (this._getCameraControl().getCamera().offset) {
                  this._getCameraControl().getCamera().offset = offset;
                  this._renderEverything();
              }
              this._offsetAnimationEnd();
          }
          /**
           * This function is modified with callAgainAfter, see constructor
           * @private
           */
          _offsetAnimationStart() {
              this._onCameraMove();
          }
          /**
           * This function is modified with debounce, see constructor
           * @private
           */
          _offsetAnimationEnd() {
              this._onCameraIdle();
          }
          getCameraOffset() {
              var _a, _b;
              if (!((_b = (_a = this._getCameraControl()) === null || _a === void 0 ? void 0 : _a.getCamera()) === null || _b === void 0 ? void 0 : _b.offset)) {
                  return { left: 0, top: 1, right: 1, bottom: 0 };
              }
              return JSON.parse(JSON.stringify(this._getCameraControl().getCamera().offset));
          }
          _onKeyDown(event) {
              super._onKeyDown(event);
              if (event.key && (event.key === 'Escape' || event.key === 'Esc')) {
                  this.cancelComponentSelection();
                  event.preventDefault();
              }
              if (event.key &&
                  event.key.includes('Shift') &&
                  this._cameraControl instanceof CameraControl3D) {
                  this._getCameraControl().enablePanning();
                  event.preventDefault();
              }
              if (this._sceneEventHandler &&
                  this._sceneEventHandler.hasSelection() &&
                  event.key &&
                  (event.key === 'Backspace' || event.key === 'Delete')) {
                  this.requestDeleteSelectedComponent();
                  event.preventDefault();
              }
          }
          _onKeyUp(event) {
              super._onKeyUp(event);
              if (event.key && event.key.includes('Shift')) {
                  this._getCameraControl().disablePanning();
                  event.preventDefault();
              }
          }
          cancelPreviousDockings() {
              var _a;
              this._cancelDockings(true, null, false, false);
              (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.forceShadowUpdates(true);
              this._renderEverything();
          }
          cancelComponentSelection(resetCamera) {
              if (!this._sceneEventHandler.hasSelection() &&
                  this._sceneEventHandler.getSelectionMode() === "standard" /* SELECTION_MODE.STANDARD */) {
                  return;
              }
              this._cancelSelection(resetCamera);
          }
          _cancelSelection(resetCamera) {
              this._sceneEventHandler.cancelSelection();
              //set configurator context in webgl since scene event handler and webgl are not linked
              this._configuratorContext.selectionMode = "standard" /* SELECTION_MODE.STANDARD */;
              this._configuratorContext.selectedRuntimeComponentIds = [];
              this._getViewModel().removePreviews();
              if (resetCamera && !this._initData.debug) {
                  this.resetCameraToState();
              }
              this._getKernelAccess().updatePlanObjectDependencies(this._configuratorContext.planObjectId);
              this._configuratorUiCallbacks.onSelectionCancel();
          }
          _selectComponent(component, consecutive) {
              this._configuratorContext.selectedRuntimeComponentIds =
                  this._sceneEventHandler.getSelectedRuntimeComponentIds();
              if (!consecutive) {
                  if (this._sceneEventHandler.getSelectionMode() === "standard" /* SELECTION_MODE.STANDARD */) {
                      this._onSelectedRuntimeComponentChange(component);
                  }
                  else {
                      this._onSelectedRuntimeComponentsChange(this._sceneEventHandler.getSelectedRuntimeComponentIds());
                  }
              }
              this._highlightComponent(component);
              if (!this._initData.debug && consecutive) {
                  this.zoomToComponent(component);
              }
          }
          _deselectComponent(component, resetCamera) {
              if (this._sceneEventHandler.getSelectionMode() === "standard" /* SELECTION_MODE.STANDARD */) {
                  this._cancelSelection(resetCamera);
                  this._highlightComponent();
              }
              if (this._sceneEventHandler.getSelectionMode() === "multiselect" /* SELECTION_MODE.MULTISELECT */) {
                  if (this._sceneEventHandler.hasSelection()) {
                      this._configuratorContext.selectedRuntimeComponentIds =
                          this._sceneEventHandler.getSelectedRuntimeComponentIds();
                  }
                  else {
                      this._cancelSelection(resetCamera);
                      this._highlightComponent();
                  }
              }
              if (this._componentRaycastHelper) {
                  this._componentRaycastHelper.changeMaterialsOnSelect(this._scene, null);
              }
          }
          getScreenXY(position) {
              return getScreenXY(position, this._getCameraControl().getCamera(), this._domHelper.element.clientWidth, this._domHelper.element.clientHeight);
          }
          setSelectionMode(mode) {
              this._sceneEventHandler.setSelectionMode(mode);
          }
          changeFloorMaterial(material) {
              if (!this._environment ||
                  !(this._environment instanceof FloorEnvironment)) {
                  this._environment = new FloorEnvironment(this._scene, this._environment, true);
                  this._uiIntersectionHelper.floorEnvironment = true;
              }
              return new Promise((resolve, reject) => {
                  this._environment
                      .changeFloorMaterial(material, this._maxAnisotropy)
                      .then(() => {
                      this._requestRender();
                      resolve();
                  }, reject);
              });
          }
          //https://threejs.org/docs/#examples/exporters/GLTFExporter
          exportGLB() {
              // three-refactor - GLTFExporter - works in SDK but breaks the UI build, deactivate until UI can handle optional chaining
              // three-refactor - GLTFExporter - the main issue here is that the UI still relies on vue-cli which is deprecated and uses
              // - an old version of webpack which can not deal with optional chaining
              //this._scriptLoader
              //  .fetch(GLTF_EXPORTER_FILE_NAME, { id: 'gltf-exporter' })
              //  .then(() => {
              //    let exporter = new (THREE as any).GLTFExporter();
              //
              //    let exportObjects: any[] = [];
              //    this._scene.children.forEach((child: any) => {
              //      if (child.type === 'Object3D' || child.type === 'Mesh') {
              //        exportObjects.push(child);
              //      }
              //    });
              //
              //    // Parse the input and generate the glTF output
              //    exporter.parse(
              //      exportObjects,
              //      (gltf: any) => {
              //        console.log(gltf);
              //        const blob = new Blob([gltf], { type: 'model/gltf-binary' });
              //        download('scene.glb', URL.createObjectURL(blob));
              //      },
              //      { binary: true, embedImages: true, forceIndices: true }
              //    );
              //  });
          }
          zoomIn(value) {
              this._getCameraControl().zoomIn(value);
              this._renderEverything();
          }
          zoomOut(value) {
              this._getCameraControl().zoomOut(value);
              this._renderEverything();
          }
          async showDimensions() {
              await this._initDimensions();
              this._dimensionHelper.enableDimensions();
              this._dimensionHelper.onDimensionsVisibilityChanged((visible) => {
                  if (visible) {
                      this._renderEverything();
                  }
                  this._configuratorUiCallbacks.onDimensionsVisibilityChange(visible);
              });
              this._configuratorUiCallbacks.onDimensionsVisibilityChange(true);
              this._renderEverything();
          }
          async _initDimensions() {
              if (!this._dimensionHelper) {
                  await module.import('./dimensioning-helper-41cec16e.nomodule.js').then(({ default: DimensionHelper }) => {
                      this._dimensionHelper = new DimensionHelper(this._creator_);
                      this._pluginSystem.addPlugin(this._dimensionHelper);
                  });
              }
          }
          hideDimensions() {
              if (this._dimensionHelper) {
                  this._dimensionHelper.disableDimensions();
              }
              if (this._componentDimensioningHelper &&
                  this._componentDimensioningHelper.hasComponentDimensions()) {
                  this._componentDimensioningHelper.reset();
              }
              this._renderEverything();
          }
          async loadSceneSettings(sceneSetting) {
              await super.loadSceneSettings(sceneSetting);
              this._uiIntersectionHelper.floorEnvironment =
                  this._environment instanceof FloorEnvironment;
          }
          _updateCameraToBounds(boundingBox, changeCamera = true, animate = false) {
              if (!boundingBox) {
                  boundingBox = this._getViewModel().getBoundingBox();
              }
              if (!boundingBox || !(this._cameraControl instanceof CameraControl3D)) {
                  return;
              }
              if (animate) {
                  this._getCameraControl().zoomToFitBounds(boundingBox);
              }
              else {
                  this._getCameraControl().updateToBounds(boundingBox, false, changeCamera);
              }
              this._configuratorUiCallbacks.onCameraPositionChanges();
              this._updateComponentPosition();
          }
          requestDockingsPreview(userInitiated, possibleChild, dragEvent, dragIn) {
              if (!dragIn) {
                  dragIn = false;
              }
              if (userInitiated) {
                  this.cancelPreviousDockings();
              }
              this.cancelComponentSelection();
              if (dragIn) {
                  this.enableDragIn(dragEvent);
              }
              if (possibleChild) {
                  this._configuratorContext.lastPossibleChild = possibleChild;
              }
              this._configuratorContext.requestPreviewsIsUserInitiated = userInitiated;
              this.resetPreviews();
              this._getKernelAccess().webGlPreviewDockings(this._configuratorContext, dragIn);
              this._showDockings();
          }
          _requestDockingsPreviewWithDrag(componentId) {
              this.cancelPreviousDockings();
              if (this._configuratorContext.rootComponentId !== componentId) {
                  this.resetPreviews();
                  this._getKernelAccess().previewDockingsWithDrag(componentId, this._configuratorContext.planObjectId);
                  this._showDockings();
              }
          }
          _dockComponent(previewComponent) {
              Benchmark.start('dock_component_' + previewComponent.childId);
              this._getKernelAccess().dockComponent(previewComponent.parentId, previewComponent.parentDockId, previewComponent.childId, previewComponent.childDockId);
              this._configuratorContext.dockingRootComponentId = null; // Fix #126
              this.saveConfigToIdb();
          }
          _onSelectedRuntimeComponentsChange(selectedRuntimeComponentIds) {
              this._getKernelAccess().multiSelectionChange(selectedRuntimeComponentIds, this._configuratorContext.rootComponentId);
          }
          _onSelectedRuntimeComponentChange(component) {
              let isRoot = false;
              let componentId = null;
              if (component) {
                  isRoot =
                      component.runtimeId === this._configuratorContext.rootComponentId;
                  componentId = component.runtimeId;
              }
              this._getKernelAccess().selectionChange(componentId, isRoot);
              if (component) {
                  this._getKernelAccess().selectedComponent(component.runtimeId);
              }
          }
          requestDeleteSelectedComponent() {
              const selection = this._configuratorContext.selectedRuntimeComponentIds;
              const rootComponentId = this._configuratorContext.rootComponentId;
              if (!Array.isArray(selection) ||
                  selection.length === 0 ||
                  !rootComponentId ||
                  selection.indexOf(rootComponentId) !== -1) {
                  return;
              }
              switch (this._configuratorContext.selectionMode) {
                  case "standard" /* SELECTION_MODE.STANDARD */:
                      this.resetCamera();
                      this._getKernelAccess().requestDeleteComponent(this._configuratorContext.selectedRuntimeComponentId);
                      break;
                  case "multiselect" /* SELECTION_MODE.MULTISELECT */:
                      this.resetCamera();
                      this._getKernelAccess().requestDeleteComponents(this._configuratorContext.selectedRuntimeComponentIds);
                      break;
              }
              this._configuratorContext.selectedRuntimeComponentIds = [];
          }
          componentUpdated(component, _kernelComponent) {
              var _a;
              if (component.runtimeId === this._configuratorContext.rootComponentId) {
                  let rootComponentPosition = new Vector3(component.position.x / 1000, component.position.z / 1000, component.position.y / -1000);
                  this._sceneEventHandler.update(null, rootComponentPosition, null);
              }
              const geometryChanged = component.geometryChanged !== undefined
                  ? component.geometryChanged
                  : true;
              if (geometryChanged) {
                  this._renderEverything();
              }
              else {
                  this._renderWithoutShadowsAndAO();
              }
              (_a = this._componentDimensioningHelper) === null || _a === void 0 ? void 0 : _a.invalidateDimensioningsCache(component.runtimeId);
          }
          planObjectUpdated(planObject, geometryChanged, pendingDocking) {
              const configuration = this._getKernelAccess().kernelInstance.getSerializedConfiguration(this._configuratorContext.planObjectId);
              if (!pendingDocking) {
                  this._configuratorHistory.push(configuration);
              }
              if (!planObject.bounds) {
                  return;
              }
              if (this._configuratorContext.planObjectId === planObject.id) {
                  const box = this._getViewModel().getBoundingBox();
                  this._updateBounds(box, geometryChanged);
              }
              // Update highlights because some component meshes may have changed
              this._highlightComponent();
              this._requestRender();
          }
          componentDeleted(component) {
              if (this._sceneEventHandler
                  .getSelectedRuntimeComponentIds()
                  .indexOf(component.runtimeId) !== -1 ||
                  this._sceneEventHandler.getSelectionMode() === "multiselect" /* SELECTION_MODE.MULTISELECT */) {
                  this.cancelComponentSelection();
              }
          }
          previewConstructionDone(component, hasPreviews) {
              const boundingBox = this._getViewModel().getBoundingBoxWithPreviews();
              if (!hasPreviews) {
                  this._cancelDockings(true, null, false, false, false);
                  if (this._configuratorContext.requestPreviewsIsUserInitiated) {
                      this._configuratorUiCallbacks.onNoDockingsAvailable();
                  }
              }
              let updateToBounds = true;
              if (this._componentRaycastHelper) {
                  const areAllPreviewsVisible = this._componentRaycastHelper.areAllComponentsInFrustum(this._getViewModel().getPreviews());
                  updateToBounds = !areAllPreviewsVisible;
              }
              if (this._configuratorContext.requestPreviewsIsUserInitiated &&
                  updateToBounds) {
                  this._updateCameraToBounds(boundingBox, true, true);
              }
              if (this._lightSetting && this._lightSetting.needsBounds()) {
                  this._lightSetting.updateBounds(boundingBox);
                  if (this._environment && this._environment.needsBounds()) {
                      this._environment.updateBounds(boundingBox.getSize(new Vector3()));
                  }
              }
              if (this._componentRaycastHelper) {
                  this._componentRaycastHelper.checkPreviewVisibility(this._getViewModel());
              }
          }
          configurationLoaded(component, isFreeFlying) {
              if (component && isFreeFlying && this._sceneEventHandler.isDragIn()) {
                  component.position.copy(new Vector3(0, 100, 0));
                  this._scene.add(component);
                  this._sceneEventHandler.addComponentDragInHandler(component);
                  this._requestRender();
              }
              else if (!isFreeFlying && !this._initData.debug && !this._initData.moc) {
                  // reset camera initially
                  this.resetCamera();
              }
              if (this._environment) {
                  this._environment.reload();
              }
          }
          addComponentHandlers(component) {
              this._sceneEventHandler.addComponentHandlers(component);
          }
          addPreviewHandlers(previewComponent) {
              this._sceneEventHandler.addPreviewHandlers(previewComponent);
          }
          addPreviewLineHandlers(previewLineComponent) {
              this._sceneEventHandler.addPreviewLineHandlers(previewLineComponent);
          }
          _updateComponentPosition() {
              if (!this._configuratorUiCallbacks.onComponentPositionsUpdated) {
                  return;
              }
              const componentPositions = [];
              this._getViewModel()
                  .getComponents()
                  .forEach((component) => {
                  if (!component.boundingBoxMesh) {
                      return;
                  }
                  const box = new Box3().setFromObject(component.boundingBoxMesh);
                  let kernelComponent = this._getKernelAccess().kernelInstance.getComponent(component.runtimeId);
                  const editable = kernelComponent.parameters || kernelComponent.possibleChildren;
                  const actions = editable ? ['edit'] : [];
                  componentPositions.push({
                      id: component.runtimeId,
                      position: this.getScreenXY(box.getCenter(new Vector3())),
                      type: 'component',
                      actions,
                  });
              });
              this._getViewModel()
                  .getPreviews()
                  .forEach((preview) => {
                  const box = new Box3().setFromObject(preview);
                  const actions = ['add'];
                  componentPositions.push({
                      id: preview.runtimeId,
                      position: this.getScreenXY(box.getCenter(new Vector3())),
                      type: 'preview',
                      actions,
                  });
              });
              this._configuratorUiCallbacks.onComponentPositionsUpdated(componentPositions);
          }
          _updateBounds(box, geometryChanged = false) {
              super._updateBounds(box, geometryChanged);
              if (!box) {
                  return;
              }
              let size = box.getSize(new Vector3());
              if (!this._sceneEventHandler.hasSelection()) {
                  this._updateCameraToBounds(box, false);
              }
              this._sceneEventHandler.update(size, null, null);
              this._uiIntersectionHelper.updateToBounds(size, this._domHelper.element.clientWidth, this._domHelper.element.clientHeight);
              if (this._componentDimensioningHelper &&
                  this._componentDimensioningHelper.hasComponentDimensions()) {
                  this._componentDimensioningHelper.reset();
              }
              this._getCameraControl().getCamera().updateProjectionMatrix();
          }
          async moveCamera(cameraParameter) {
              return this._getCameraControl().moveCamera(cameraParameter);
          }
          selectComponent(runtimeId) {
              if (!runtimeId) {
                  return;
              }
              const components = this._getViewModel().getComponents();
              const component = components.find((c) => c.runtimeId === runtimeId);
              if (!component) {
                  console.warn('Can not select "' + runtimeId + '" because it was not found');
                  return;
              }
              this._sceneEventHandler.clickComponent(component);
          }
          highlightParts(ids) {
              this._highlightComponent(null, ids);
              this._requestRender();
          }
          _shouldHighlight() {
              if (this._initData.highlighting === ROOMLE_HIGHLIGHTNG.ALWAYS) {
                  return true;
              }
              if (this._initData.highlighting === ROOMLE_HIGHLIGHTNG.OFF) {
                  return false;
              }
              const amount = this._plannerKernelAccess.kernelInstance.getChildrenOfPlanComponent(this._configuratorContext.rootComponentId, true, false);
              return (amount || []).length > 1;
          }
          saveConfigToIdb() {
              if (!this._initData.moc) {
                  const id = this._configuratorContext.lastLoadedRapiId;
                  const configuration = this._getKernelAccess().kernelInstance.getSerializedConfiguration(this._configuratorContext.planObjectId);
                  const key = this._idbManager.getKey(getHostname(), id);
                  this._idbManager.setValue(key, configuration, this._idbManager.configStore);
              }
          }
          _getInputManager() {
              return this._configuratorInputManager;
          }
          // override
          createCameraControl(_mode, offset) {
              this._componentFactory = RoomleComponentFactoryInitializer();
              const clientDimensions = this._domHelper.getClientDimensions();
              const width = clientDimensions.x;
              const height = clientDimensions.y;
              const camera = this._componentFactory.createPerspectiveCamera(30, width / height, 0.1, 20, offset);
              camera.layers.set(3 /* LAYER.OBJECT */);
              camera.layers.enable(1 /* LAYER.LIGHTING */);
              camera.layers.enable(2 /* LAYER.BACKGROUND */);
              camera.layers.enable(6 /* LAYER.UI */);
              camera.layers.enable(5 /* LAYER.PREVIEW */);
              camera.position.copy(new Vector3(0, 0.5, 5));
              this._changeCameraControl(new CameraControl3D(this._creator_, this._getInputManager(), null, camera));
          }
          getBounds() {
              return this._getViewModel().getBoundingBox();
          }
          sceneChanged() {
              // TODO Implement
          }
          _getCameraControl() {
              return this._cameraControl;
          }
          _onCameraIdle() {
              return super._onCameraIdle();
          }
          _onCameraMove() {
              return super._onCameraMove();
          }
          getComponent(componentRuntimeId) {
              return this._plannerKernelAccess.kernelInstance.getComponent(componentRuntimeId);
          }
          cameraControlChanged() {
              var _a;
              super.cameraControlChanged();
              (_a = this._sceneEventHandler) === null || _a === void 0 ? void 0 : _a.setCamera(this._cameraControl.getCamera());
          }
      } exports('C', ConfiguratorSceneManager);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_configuratorInputManager", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_configuratorUiCallbacks", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_configuratorMeshGenerator", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_memoryManager", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_configuratorContext", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_componentDimensioningHelper", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_configuratorViewModel", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_configuratorHistory", void 0);
      __decorate([
          inject
      ], ConfiguratorSceneManager.prototype, "_plannerKernelAccess", void 0);

      const sortBySort = (a, b) => {
          if (!a.sort && !b.sort) {
              return 0;
          }
          if (!a.sort) {
              return 1;
          }
          if (!b.sort) {
              return -1;
          }
          return a.sort - b.sort;
      };
      const sortByString = (aLabel, bLabel) => {
          if (aLabel && !bLabel) {
              return 1;
          }
          if (!aLabel && bLabel) {
              return -1;
          }
          if (aLabel && bLabel) {
              return aLabel.localeCompare(bLabel);
          }
          return 0;
      };

      class RoomleConfigurator {
          _isInitDone() {
              return this._isKernelReady && this._isWebGlReady && this._isPreloadReady;
          }
          _checkInitDone() {
              if (this._isInitDone()) {
                  this._onInitDoneCollection.forEach((onInitDone) => onInitDone());
                  this._onInitDoneCollection = [];
              }
          }
          _onInitDone(onInitDone) {
              if (this._isInitDone()) {
                  onInitDone();
              }
              else {
                  this._onInitDoneCollection.push(onInitDone);
              }
          }
          constructor(creator) {
              this._onInitDoneCollection = [];
              this._isKernelReady = false;
              this._isWebGlReady = false;
              this._isPreloadReady = true;
              this._isLoadError = false;
              this._isReloading = false;
              this._needsSync = false;
              this._creator_ = creator;
              this._configuratorKernelAccessCallback.addListener(this);
              const { dls, ls } = this._initData;
              if (ls || dls) {
                  this._initData.legacyLight = true;
              }
              if (this._initData.legacyLight) {
                  this._initData.envMapIntensity = 0.9;
              }
              const errorHandler = this._errorHandler;
              errorHandler.subscribe(0 /* ERROR_CODES.OFFLINE */, (error) => this._configuratorUiCallbacks.onErrorDueToOffline(error));
              errorHandler.subscribe(1 /* ERROR_CODES.GENERIC_RAPI_ERROR */, (error) => this._configuratorUiCallbacks.onError(error));
              errorHandler.subscribe(2 /* ERROR_CODES.CONTENT_PROBLEM */, (rapiPath, ids) => this._configuratorUiCallbacks.onContentProblem({
                  rapiPath,
                  ids,
                  message: 'Could not load the ids',
              }));
          }
          initSceneManager(sceneManager) {
              if (!sceneManager) {
                  this._sceneManager =
                      RoomleDependencyInjection.lookup('configurator-scene-manager', this._creator_);
              }
              else {
                  this._sceneManager = sceneManager;
              }
          }
          getScene() {
              return this._sceneManager.getScene();
          }
          updateScene() {
              this._sceneManager.updateScene();
          }
          _loadWebGlLib(element, offset) {
              this._loadingWebGlSuccess(element, offset);
          }
          _loadingWebGlSuccess(element, offset) {
              this.initSceneManager();
              if (offset) {
                  this._sceneManager.changeOffset(offset);
              }
              const { initialFloorMaterial, dls, ls, stats } = this._initData;
              const dynamicLightSettingSource = DynamicLightSettingLoader.createDynamicLightSettingSource(dls, ls);
              if (stats) {
                  this.showStats();
              }
              this._sceneManager.enableHD(dynamicLightSettingSource);
              if (this._needsSync) {
                  this._needsSync = false;
                  this._plannerKernelAccess.requestSync(DEFAULT_CONVERSATION_ID, this._configuratorContext.planObjectId);
              }
              const promises = [
                  this._scriptLoader.fetch(TWEEN_FILE_NAME, { id: 'tween-js' }),
              ];
              if (initialFloorMaterial) {
                  promises.push(this._rapiAccess
                      .getMaterial(initialFloorMaterial)
                      .then((material) => this._sceneManager.changeFloorMaterial(material)));
              }
              Promise.all(promises).then(this._webGlIsReady.bind(this), this.loadError.bind(this));
          }
          _webGlIsReady() {
              this._isWebGlReady = true;
              this._checkInitDone();
          }
          _initPromiseCallback(resolve, reject) {
              if (this._isInitDone()) {
                  resolve();
                  return;
              }
              if (this._isLoadError) {
                  reject('_initPromiseCallback failed');
                  return;
              }
              this._onInitDone(() => resolve());
              this._rejectOnLoadError = reject;
          }
          _notifyOnConfigurationReady(resolver) {
              return async (data) => {
                  const enhancedPartList = await this._plannerKernelAccess.addUiDataAndPriceToPartList(data.partList, data.hash);
                  data.partList = enhancedPartList;
                  resolver(data);
                  this._configuratorUiCallbacks.onConfigurationReady(enhancedPartList, data.hash, data.rootComponentLabel);
              };
          }
          _notifyOnConfigurationLoadingError(reject) {
              return (error) => {
                  this._configuratorUiCallbacks.onConfigurationLoadError();
                  reject(error);
              };
          }
          _loadItemOrConfigById(id, isConfig) {
              this._configuratorContext.lastLoadedRapiId = id;
              this._onLoadConfiguration();
              this._preloadPackage(id);
              this._clearScene();
              const { offlineSync } = this._initData;
              if (offlineSync) {
                  const catalogId = getCatalogIdFromItemOrConfigurationId(id);
                  if (catalogId) {
                      this._dataSyncer.start(catalogId);
                  }
              }
              return new Promise((resolve, reject) => {
                  const rapiPromise = isConfig
                      ? this._rapiAccess.getConfiguration(id)
                      : this._rapiAccess.getItem(id);
                  rapiPromise.then((data) => {
                      if (!data || !data.configuration) {
                          reject(new Error('Could not load item or config with id ' + id));
                          return;
                      }
                      this._loadConfiguration(data.configuration).then((loadedData) => {
                          const resolver = this._notifyOnConfigurationReady(resolve);
                          if (!data.label) {
                              this._notifyUiAboutNewConfiguration(data);
                          }
                          else {
                              this._notifyUiAboutNewItem(data, loadedData.rootComponentLabel);
                          }
                          resolver(loadedData);
                      }, this._notifyOnConfigurationLoadingError(reject).bind(this));
                  }, reject);
              });
          }
          _shouldBroadcastToUi(parameterUpdateType) {
              if (parameterUpdateType === 0 /* PARAMETER_UPDATE_TYPE.PLAN_OBJECT */ &&
                  this._configuratorContext.selectedRuntimeComponentId) {
                  return false;
              }
              if (parameterUpdateType === 1 /* PARAMETER_UPDATE_TYPE.PLAN_COMPONENT */ &&
                  !this._configuratorContext.selectedRuntimeComponentId) {
                  return false;
              }
              if (parameterUpdateType === 2 /* PARAMETER_UPDATE_TYPE.COMMON_COMPONENTS */ &&
                  !this._configuratorContext.selectedRuntimeComponentIds.length) {
                  return false;
              }
              return true;
          }
          _isCorrectResponse(parameterUpdateType, elementId) {
              if (parameterUpdateType === 0 /* PARAMETER_UPDATE_TYPE.PLAN_OBJECT */) {
                  return elementId === this._configuratorContext.planObjectId;
              }
              if (parameterUpdateType === 1 /* PARAMETER_UPDATE_TYPE.PLAN_COMPONENT */) {
                  return elementId === this._configuratorContext.selectedRuntimeComponentId;
              }
              const length = elementId.length;
              if (length !== this._configuratorContext.selectedRuntimeComponentIds.length) {
                  return false;
              }
              for (let i = 0; i < length; i++) {
                  if (elementId[i] !==
                      this._configuratorContext.selectedRuntimeComponentIds[i]) {
                      return false;
                  }
              }
              return true;
          }
          _onLoadConfiguration() {
              this._clearScene();
              this._configuratorUiCallbacks.onLoadConfiguration();
          }
          _clearScene() {
              if (this._sceneManager) {
                  this._sceneManager.clearScene();
              }
          }
          _notifyUiAboutNewItem(rapiItem, rootComponentLabel) {
              this._rapiAccess
                  .getCatalog(rapiItem.catalog)
                  .then((catalog) => this._configuratorUiCallbacks.onConfigurationLabelChange(catalog.name, rapiItem.label, rootComponentLabel));
          }
          _notifyUiAboutNewConfiguration(rapiConfiguration) {
              Promise.all([
                  this._rapiAccess.getCatalog(rapiConfiguration.catalog),
                  this._rapiAccess.getComponent(rapiConfiguration.rootComponentId),
              ]).then(([catalog, rootComponent]) => this._configuratorUiCallbacks.onConfigurationLabelChange(catalog.name, null, rootComponent.label));
          }
          notifyUiAboutNewLabel(id) {
              if (!isIdItemId(id)) {
                  this._notifyUiAboutNewConfiguration(this._rapiAccess.peekConfiguration(id));
              }
              else {
                  const data = this._rapiAccess.peekItem(id);
                  const component = this._rapiAccess.peekComponent(data.rootComponentId);
                  this._notifyUiAboutNewItem(data, component.label);
              }
          }
          _getMaterialGroups(parameter) {
              const comparer = (a, b) => {
                  let sortResult = sortBySort(a, b);
                  if (sortResult !== 0) {
                      return sortResult;
                  }
                  sortResult = sortByString(a.label, b.label);
                  if (sortResult !== 0) {
                      return sortResult;
                  }
                  return sortByString(a.id, b.id);
              };
              const sortGroupsAndMaterials = (materialGroupsToSort) => {
                  materialGroupsToSort.sort(comparer);
                  materialGroupsToSort.forEach((group) => group.materials.sort(comparer));
                  return materialGroupsToSort;
              };
              if (parameter.validGroups.length > 0) {
                  return new Promise((resolve, reject) => this._rapiAccess
                      .getMaterialsByGroup(parameter.validGroups)
                      .then((materialGroups) => resolve(sortGroupsAndMaterials(materialGroups)), reject));
              }
              const ids = [];
              parameter.validValues.forEach((validValue) => ids.push(validValue.value));
              return new Promise((resolve, reject) => {
                  this._rapiAccess.getMaterials(ids).then((materials) => {
                      this._rapiAccess.combineMaterialsToGroups(materials).then((groups) => {
                          resolve(sortGroupsAndMaterials(groups));
                      });
                  }, reject);
              });
          }
          _loadConfiguration(configuration) {
              this._plannerKernelAccess.externalMeshQueue.clear();
              return new Promise((resolve, reject) => {
                  const loadConfiguration = () => {
                      const { x, y } = this._domHelper.getClientDimensions();
                      if (x <= 0 && y <= 0) {
                          let message = 'Size of canvas is 0/0! When using embedding set correct size or remove id to load in idle mode!';
                          console.error(message);
                          return reject(message);
                      }
                      this.resumeKernelCallbacks();
                      Benchmark.start("ui_load_configuration" /* MARKS.UI_LOAD_CONFIGURATION */);
                      const promises = [];
                      if (this._initData.applyCurrentGlobalParameters) {
                          const planObjectId = this._configuratorContext.planObjectId;
                          const rootComponentParametersAsGlobal = this._configuratorContext.rootComponentParametersAsGlobal;
                          promises.push(this._plannerKernelAccess.getGlobalParameters(planObjectId, rootComponentParametersAsGlobal));
                      }
                      Promise.all(promises).then(([parameters]) => {
                          const loadPromises = [
                              AsyncHelper.waitFor(4 /* ASYNC_OPERATIONS.CONFIGURATION_LOADED */),
                              AsyncHelper.waitFor(2 /* ASYNC_OPERATIONS.KERNEL_PLAN_OBJECT_CONSTRUCTION_DONE */),
                          ];
                          Promise.all(loadPromises).then(([configurationLoadedData, [_planObject, partList, hash, rootComponentId],]) => {
                              const parameterPromises = [];
                              if (parameters && this._initData.applyCurrentGlobalParameters) {
                                  parameters.forEach((parameter) => parameterPromises.push(this.setParameter(parameter, parameter.value, true /* isRaw */)));
                              }
                              const rootComponent = this._rapiAccess.peekComponent(rootComponentId);
                              Promise.all(parameterPromises).then(() => {
                                  const partListPromises = [];
                                  if (parameterPromises.length) {
                                      partListPromises.push(this._plannerKernelAccess.getPartList());
                                      partListPromises.push(this._plannerKernelAccess.getConfigurationHash(this._configuratorContext));
                                  }
                                  Promise.all(partListPromises).then(async (partListData) => {
                                      const partListToUse = partListData && partListData[0]
                                          ? partListData[0]
                                          : partList;
                                      const hashToUse = partListData && partListData[1] ? partListData[1] : hash;
                                      const enhancedPartList = await this._plannerKernelAccess.addUiDataAndPriceToPartList(partListToUse, hashToUse);
                                      let errorsFromLoad = configurationLoadedData.errors;
                                      const errors = errorsFromLoad
                                          ? convertCObject(errorsFromLoad)
                                          : [];
                                      this._configuratorUiCallbacks.onPartListUpdate(enhancedPartList, window.btoa(hash));
                                      resolve({
                                          partList: enhancedPartList,
                                          hash: hashToUse,
                                          rootComponentLabel: rootComponent
                                              ? rootComponent.label
                                              : '',
                                          errors,
                                      });
                                  });
                              });
                          }, reject);
                          this._plannerKernelAccess.loadConfiguration(configuration);
                      }, reject);
                  };
                  this._onInitDone(() => loadConfiguration());
              });
          }
          _preLoadItemOrConfig(id, isConfig) {
              return new Promise((resolve, reject) => {
                  const rapiPromise = isConfig
                      ? this._rapiAccess.getConfiguration(id)
                      : this._rapiAccess.getItem(id);
                  rapiPromise.then(resolve, reject);
              });
          }
          _preloadPackage(id) {
              this._isPreloadReady = false;
              // @todo as long as RAPI does not return something useful we have to estimate for the user what he wants!
              let promise = null;
              if (isIdItemId(id)) {
                  promise = this._rapiAccess.getPreloadForItem.bind(this._rapiAccess);
              }
              else {
                  promise = this._rapiAccess.getPreloadForConfiguration.bind(this._rapiAccess);
              }
              Benchmark.start("rapi_preloads" /* MARKS.RAPI_PRELOADS */);
              const trackTiming = () => {
                  const measures = Benchmark.getMeasure("rapi_preloads" /* MARKS.RAPI_PRELOADS */);
                  if (Array.isArray(measures) && measures.length === 1) {
                      const measure = measures[0];
                      this._configuratorUiCallbacks.onTrackTiming("Timing" /* TRACKING_CATEGORIES.TIMING */, "RapiPreloads" /* UI_TRACKING.RAPI_PRELOADS */, Math.round(measure.duration), {
                          id,
                      });
                  }
              };
              promise(id).then(() => {
                  this._isPreloadReady = true;
                  this._checkInitDone();
                  trackTiming();
              }, (error) => {
                  this._isPreloadReady = true;
                  this._checkInitDone();
                  console.error(error);
                  trackTiming();
              });
          }
          _reloadConfiguration(configuration, preloadHint, resolve, reject) {
              return this._performLoadConfiguration(configuration).then((response) => {
                  this._isReloading = false;
                  resolve(response);
              }, (error) => {
                  this._isReloading = false;
                  reject(error);
              });
          }
          _performLoadConfiguration(configuration) {
              this._onLoadConfiguration();
              return new Promise((resolve, reject) => {
                  if (this._initData.preloadHint) {
                      this._preloadPackage(this._initData.preloadHint);
                  }
                  else {
                      console.warn('When loading a configuration string you have to supply a preloadHint to use fast loading!');
                  }
                  setTimeout(() => {
                      this._loadConfiguration(configuration).then(this._notifyOnConfigurationReady(resolve).bind(this), this._notifyOnConfigurationLoadingError(reject).bind(this));
                  }, 0);
              });
          }
          _changeHDGeometry(requestEnable) {
              return new Promise((resolve, reject) => {
                  if (requestEnable === AppContext.useHDGeometry) {
                      return resolve();
                  }
                  if (this._isReloading) {
                      return reject('Change of HD Geometry in progress');
                  }
                  this._isReloading = true;
                  AsyncHelper.waitFor(3 /* ASYNC_OPERATIONS.UI_RELOAD_CONFIGURATION */).then(([configuration, preloadHint]) => {
                      this._reloadConfiguration(configuration, preloadHint, resolve, reject);
                  }, reject);
                  AppContext.useHDGeometry = requestEnable;
                  this._plannerKernelAccess.changeUseOfHDGeometry(this._configuratorContext, AppContext.useHDGeometry);
              });
          }
          async _callOnPartListUpdate() {
              const { hash } = await AsyncHelper.waitFor(4 /* ASYNC_OPERATIONS.CONFIGURATION_LOADED */);
              const partListToUse = (await this._plannerKernelAccess.getPartList());
              const hashToUse = await this._plannerKernelAccess.getConfigurationHash(this._configuratorContext);
              const enhancedPartList = await this._plannerKernelAccess.addUiDataAndPriceToPartList(partListToUse, hashToUse);
              this._configuratorUiCallbacks.onPartListUpdate(enhancedPartList, window.btoa(hash));
          }
          /**
           * Set general configuration parameter
           * @param initData
           */
          setOverrides(initData) {
              if (!initData) {
                  return;
              }
              this._initData.setOverrides(initData);
              this._globalInitData.setOverrides(initData);
          }
          /**
           * This method has to be called before configurator is ready to use
           *
           * @param element which should contain the configurator
           * @param initData
           * @return Promise which is resolved when configurator is initialized
           */
          init(element, initData) {
              this.setOverrides(initData);
              const { preloadHint, offset, startTag } = this._initData;
              this._domHelper.setDomElement(element);
              if (preloadHint) {
                  this._preloadPackage(preloadHint);
              }
              else {
                  console.warn('No preload hint! Therefore no preload during init!!');
              }
              if (startTag) {
                  this.getTagById(startTag, { include: ["items" /* RAPI_PATHS.ITEMS */] }).then((tag) => this._configuratorUiCallbacks.onOpenTag(tag), (error) => console.error(error));
              }
              this._loadWebGlLib(element, offset);
              return new Promise(this._initPromiseCallback.bind(this));
          }
          /**
           * Cancels the selection of all currently selected components
           */
          cancelSelection() {
              this._sceneManager.cancelComponentSelection();
          }
          /**
           * Enable the use of HD geometry. Also reloads the object with HD geometry enabled
           */
          enableHDGeometry() {
              return this._changeHDGeometry(true);
          }
          /**
           * Disable the use of HD Geometry
           */
          disableHDGeometry() {
              return this._changeHDGeometry(false);
          }
          /**
           * Change the camera offset
           * @param offset
           */
          changeOffset(offset) {
              this._sceneManager.changeOffset(offset);
          }
          /**
           * Shows dockings/ghosts for the selected possible child
           *
           * @param possibleChild
           * @param dragEvent
           * @param dragIn
           */
          previewDockings(possibleChild, dragEvent, dragIn) {
              this._sceneManager.requestDockingsPreview(true, possibleChild, dragEvent, dragIn);
          }
          /**
           * Remove/cancel all dockings/ghosts
           */
          cancelDockings() {
              this._sceneManager.cancelDockings();
          }
          /**
           * Deletes the currently selected component if possible
           */
          requestDeleteComponent() {
              this._sceneManager.requestDeleteSelectedComponent();
          }
          /**
           * Renders the current item in high quality, it also uses the current lightsetting
           * @param renderOptions
           */
          renderImage(renderOptions) {
              return this._sceneManager.renderImage(renderOptions);
          }
          /**
           * Generates a perspective image (slightly from the side) and returns it as base 64
           */
          preparePerspectiveImage(options = {}) {
              return this._sceneManager.preparePerspectiveImage(options);
          }
          /**
           * Generates an image of one part (slightly from the side) and returns it as base 64
           * WARNING: It's only possible to render one sub part at a time
           * * @param partId id of the sub part, received from part list
           * * @param size size of the rendered image in pixel (default is 256), will render faster when size is smaller
           */
          preparePartImage(partId, options) {
              // the fact that the param type is PrepareImageOptions | number is for legacy reasons
              // if we remove the number ans change to PrepareImageOptions we would introduce a breaking change
              let processedOptions = {};
              if (typeof options === 'number') {
                  processedOptions.size = options;
              }
              else {
                  if (!options) {
                      options = {};
                  }
                  if (typeof options.size !== 'number') {
                      options.size = 256;
                  }
                  processedOptions = options;
              }
              return this._sceneManager.preparePartImage(partId, processedOptions);
          }
          /**
           * Saves the current configuration (parameters etc)
           * and returns a new configuration object including the configuration hash
           */
          saveCurrentConfiguration() {
              return new Promise((resolve, reject) => {
                  this._plannerKernelAccess
                      .getConfigurationData(this._configuratorContext.planObjectId)
                      .then((configuration) => {
                      this._rapiAccess
                          .saveConfiguration(configuration)
                          .then((savedConfiguration) => {
                          this._configuratorUiCallbacks.onConfigurationSaved(savedConfiguration.configurationHash);
                          this._rapiAccess
                              .getComponent(savedConfiguration.rootComponentId)
                              .then((rootComponentFromDb) => {
                              let perspectiveImageFinished = true;
                              let topImageFinished = true;
                              let perspectiveImageUrl = savedConfiguration.perspectiveImage;
                              let topImageUrl = savedConfiguration.topImage;
                              if (!savedConfiguration.perspectiveImage) {
                                  perspectiveImageFinished = false;
                                  this._sceneManager
                                      .preparePerspectiveImage()
                                      .then((base64Image) => {
                                      this._rapiAccess
                                          .savePerspectiveImage(savedConfiguration, base64Image)
                                          .then((savedConfigurationFromDb) => {
                                          perspectiveImageFinished = true;
                                          perspectiveImageUrl =
                                              savedConfigurationFromDb.perspectiveImage;
                                          if (topImageFinished) {
                                              savedConfiguration.label =
                                                  rootComponentFromDb.label;
                                              savedConfiguration.topImage = topImageUrl;
                                              savedConfiguration.perspectiveImage =
                                                  perspectiveImageUrl;
                                              resolve(savedConfiguration);
                                          }
                                      }, reject);
                                  });
                              }
                              if (!savedConfiguration.topImage) {
                                  topImageFinished = false;
                                  this._sceneManager
                                      .prepareTopImage()
                                      .then((base64Image) => {
                                      this._rapiAccess
                                          .saveTopImage(savedConfiguration, base64Image)
                                          .then((savedConfigurationFromDb) => {
                                          topImageFinished = true;
                                          topImageUrl = savedConfigurationFromDb.topImage;
                                          if (perspectiveImageFinished) {
                                              savedConfiguration.label =
                                                  rootComponentFromDb.label;
                                              savedConfiguration.perspectiveImage =
                                                  perspectiveImageUrl;
                                              savedConfiguration.topImage = topImageUrl;
                                              resolve(savedConfiguration);
                                          }
                                      }, reject);
                                  });
                              }
                              if (perspectiveImageFinished && topImageFinished) {
                                  savedConfiguration.label = rootComponentFromDb.label;
                                  resolve(savedConfiguration);
                              }
                          }, (error) => {
                              throw new Error(error);
                          });
                      }, reject);
                  })
                      .catch(reject);
              });
          }
          /**
           * Generates images of the current configuration
           *
           * @return Promise containing the `topImage`, `perspectgetAdditionalContentsOfiveImage` and a boolean `isLocally` which indicates if the images were generated while being offline
           */
          generateImagesOfCurrentConfiguration() {
              return new Promise((resolve, reject) => this.saveCurrentConfiguration().then((data) => resolve({
                  topImage: data.topImage,
                  perspectiveImage: data.perspectiveImage,
                  isLocally: data.isLocally,
              }), reject));
          }
          /**
           * Generates a top image (birds perspective) and returns it as base 64
           * @param showDimensions should object dimensions be visible
           */
          prepareTopImage(options) {
              // the fact that the param type is PrepareTopImageOptions | boolean is for legacy reasons
              // if we remove the boolean ans change to PrepareTopImageOptions we would introduce a breaking change
              let processedOptions = {};
              if (typeof options === 'boolean') {
                  processedOptions.showDimensions = options;
              }
              else {
                  if (!options) {
                      options = {};
                  }
                  if (typeof options.showDimensions !== 'boolean') {
                      options.showDimensions = false;
                  }
                  processedOptions = options;
              }
              return this._sceneManager.prepareTopImage(processedOptions);
          }
          /**
           * Resets the camera back to the start position
           */
          resetCameraPosition() {
              this._sceneManager.resetCameraPositionToStart();
          }
          /**
           * For testing purpose only
           * @hidden
           * @param filter
           */
          showBenchmarks(filter) {
              Benchmark.showBenchmarks(filter);
          }
          /**
           * Shows current scene graph, used for debug purposes only
           * @hidden
           * @param id
           */
          debugSceneGraph(id) {
              this._sceneManager.debugSceneGraph(id);
          }
          /**
           * Loads an item based on a configuration string
           *
           * For example: `{'componentId":"muuto:Muuto-Stacked'}`
           * @param configuration
           * @param initData
           */
          async loadConfiguration(configuration, initData) {
              this.setOverrides(initData);
              this._configuratorContext.lastLoadedRapiId = null;
              if (this._sceneManager) {
                  this._sceneManager.clearScene();
              }
              const response = await this._performLoadConfiguration(configuration);
              this._rapiAccess.trackView('configuration string');
              return response;
          }
          /**
           * Loads an item based on a configuration hash
           *
           * For example: `koinor:FORMIA_LeftGroup:79FBF0D6C79A2598B5FF943111EA29DC0C6884AA97F4383582B47F69C14DDB2C`
           * @param configurationId
           * @param initData
           */
          async loadConfigurationById(configurationId, initData) {
              this.setOverrides(initData);
              const response = await this._loadItemOrConfigById(configurationId, true /*isConfiguration*/);
              this._rapiAccess.trackView(configurationId);
              return response;
          }
          syncPlanObjectToView(conversationId, objectId) {
              this.resumeKernelCallbacks();
              this._plannerKernelAccess.requestSync(conversationId, objectId);
              this._plannerKernelAccess.requestPlanObjectConstruction(objectId);
              const configurationString = this._plannerKernelAccess.getSerializedConfiguration(objectId);
              const configurationHash = this._plannerKernelAccess.getCurrentConfigurationHash(objectId);
              this._plannerKernelAccess.planObjectConfigurationUpdated(objectId, configurationString, configurationHash, -1, true, false);
              this._sceneManager.resetCameraPositionToStart(false);
          }
          /**
           * Loads a configuration based on the item id
           * @param itemId
           * @param initData
           */
          async loadConfigurableItemById(itemId, initData) {
              this.setOverrides(initData);
              const response = await this._loadItemOrConfigById(itemId, false /*isConfiguration*/);
              this._rapiAccess.trackView(itemId);
              return response;
          }
          /**
           * Downloads and caches the selected configuration id for faster use
           * @param configurationId
           */
          preLoadConfigurationById(configurationId) {
              return this._preLoadItemOrConfig(configurationId, true);
          }
          /**
           * Downloads and caches the selected item id for faster use
           * @param itemId
           */
          preLoadConfigurableItemById(itemId) {
              return this._preLoadItemOrConfig(itemId, false);
          }
          _getTag(tag) {
              return this._rapiAccess.getTag(tag);
          }
          _dispatchSetParameter(key, type, value, resolve, reject) {
              const suffix = this._configuratorContext.selectedRuntimeComponentId
                  ? 'local'
                  : 'global';
              Benchmark.start('kernel_change_param_' + suffix + '_' + key);
              switch (this._configuratorContext.selectionMode) {
                  case "standard" /* SELECTION_MODE.STANDARD */:
                      if (this._configuratorContext.selectedRuntimeComponentId ||
                          this._configuratorContext.rootComponentParametersAsGlobal) {
                          let applyToId = this._configuratorContext.selectedRuntimeComponentId
                              ? this._configuratorContext.selectedRuntimeComponentId
                              : this._configuratorContext.rootComponentId;
                          this._plannerKernelAccess.changeComponentParameter(applyToId, key, type, value, resolve, reject);
                      }
                      else {
                          this._plannerKernelAccess.changePlanObjectParameter(this._configuratorContext.planObjectId, key, type, value, resolve, reject);
                      }
                      break;
                  case "multiselect" /* SELECTION_MODE.MULTISELECT */:
                      this._plannerKernelAccess.changeCommonComponentParameter(this._configuratorContext.selectedRuntimeComponentIds, key, type, value, resolve, reject);
                      break;
              }
          }
          /**
           * Sets the parameter of the selected component. If nothing is selected the parameters of the
           * parameters of the plan object are set
           * @param parameter an instance of the kernel parameter we want to set, use 'key: "your-key"' if
           *                  you do not have a kernel instance and do not need validation of the input
           * @param value the value we want to set on the parameter as string
           * @param isRaw turn this to true if you dont want the kernel to parse the value string, e.g. convert 100cm to 1000
           */
          setParameter(parameter, value, isRaw = false) {
              return new Promise((resolve, reject) => {
                  const { key, type } = parameter;
                  if (isRange(parameter)) {
                      if (!isRaw &&
                          !this._unitFormatter.isParseableUnitString(value, parameter)) {
                          return reject(new SyntaxError('Value "' + value + '" is not parseable'));
                      }
                      const parsedValue = isRaw
                          ? value
                          : this._unitFormatter.parseValue(value, parameter);
                      const { valueFrom, valueTo } = parameter.validRange;
                      const allowedDelta = this._unitFormatter.getAllowedDelta();
                      if (!Number.isNaN(valueFrom) &&
                          parsedValue < valueFrom - allowedDelta) {
                          return reject(new RangeError('Value "' + value + '" is too small, min-val "' + valueFrom + '"'));
                      }
                      if (!Number.isNaN(valueTo) && parsedValue > valueTo + allowedDelta) {
                          return reject(new RangeError('Value "' + value + '" is too big, max-val "' + valueTo + '"'));
                      }
                      value =
                          type === "Integer" /* PARAMETER_KERNEL_TYPE.INTEGER */ &&
                              typeof parsedValue === 'number'
                              ? parsedValue.toFixed()
                              : parsedValue.toString();
                  }
                  this._sceneManager.cancelDockings();
                  this._dispatchSetParameter(key, type, value, resolve, reject);
                  this._sceneManager.saveConfigToIdb();
              });
          }
          /**
           * Method to set a parameter on the plan object. This is used by embedding as well
           * @param parameter an instance of the kernel parameter we want to set, use 'key: "your-key"' if
           *                  you do not have a kernel instance and do not need validation of the input
           * @param value the value we want to set on the parameter as string
           */
          setParameterOfPlanObject(parameter, value) {
              return new Promise((resolve, reject) => {
                  const { planObjectId, rootComponentId, rootComponentParametersAsGlobal } = this._configuratorContext;
                  const { type, key } = parameter;
                  if (rootComponentParametersAsGlobal) {
                      this._plannerKernelAccess.changeComponentParameter(rootComponentId, key, type, value, resolve, reject);
                  }
                  else {
                      this._plannerKernelAccess.changePlanObjectParameter(planObjectId, key, type, value, resolve, reject);
                  }
              });
          }
          /**
           * Returns all parameters which correspond to the plan object. This is also exposed for embedding
           */
          getParametersOfPlanObject() {
              const { planObjectId, rootComponentParametersAsGlobal } = this._configuratorContext;
              return this._plannerKernelAccess.getGlobalParameters(planObjectId, rootComponentParametersAsGlobal);
          }
          /**
           * Method to set a parameter on the root component. This is used by embedding as well
           * @param parameter an instance of the kernel parameter we want to set, use 'key: "your-key"' if
           *                  you do not have a kernel instance and do not need validation of the input
           * @param value the value we want to set on the parameter as string
           */
          setParameterOfRootComponent(parameter, value) {
              return new Promise((resolve, reject) => {
                  const { rootComponentId } = this._configuratorContext;
                  const { type, key } = parameter;
                  this._plannerKernelAccess.changeComponentParameter(rootComponentId, key, type, value, resolve, reject);
              });
          }
          /**
           * Returns all parameters which correspond to the root component. This is also exposed for embedding
           */
          getParametersOfRootComponent() {
              const { planObjectId } = this._configuratorContext;
              return this._plannerKernelAccess.getGlobalParameters(planObjectId, true);
          }
          /**
           * Enable the selection of multiple components.
           * Common parameters shared between those components can then be changed at once
           */
          enableMultiselect() {
              this._sceneManager.setSelectionMode("multiselect" /* SELECTION_MODE.MULTISELECT */);
              this._configuratorContext.selectionMode = "multiselect" /* SELECTION_MODE.MULTISELECT */;
          }
          /**
           * Disable selection of multiple components. By default only one component can be selected at a time
           */
          disableMultiselect() {
              this._sceneManager.setSelectionMode("standard" /* SELECTION_MODE.STANDARD */);
              this._configuratorContext.selectionMode = "standard" /* SELECTION_MODE.STANDARD */;
          }
          /**
           * @return Promise with the current configuration string/hash
           */
          getCurrentConfiguration() {
              const startCommand = () => this._plannerKernelAccess.uiRequestConfiguration(this._configuratorContext.planObjectId);
              return AsyncHelper.waitFor(1 /* ASYNC_OPERATIONS.KERNEL_SERIALIZED_CONFIGURATION */, startCommand);
          }
          /**
           * Loads the component (defined as string) into the kernel
           *
           * @param componentString
           * @return Promise which gets resolved when the component has been loaded
           */
          loadComponentIntoKernel(componentString) {
              const startCommand = () => {
                  let componentId = null;
                  try {
                      componentId = JSON.parse(componentString).id;
                      if (!componentId) {
                          throw new Error('Component string has no ID');
                      }
                  }
                  catch (e) {
                      this._configuratorUiCallbacks.onContentProblem({
                          rapiPath: "components" /* RAPI_PATHS.COMPONENTS */,
                          ids: [componentId],
                          message: 'Component string is not a valid JSON or has no ID',
                      });
                      AsyncHelper.failOperation(0 /* ASYNC_OPERATIONS.COMPONENT_DEFINITION_LOADED */, e);
                      return;
                  }
                  this._kernelIo.setMeta({ componentId });
                  this._plannerKernelAccess.loadComponentIntoKernel(componentString, componentId);
              };
              return AsyncHelper.waitFor(0 /* ASYNC_OPERATIONS.COMPONENT_DEFINITION_LOADED */, startCommand);
          }
          /**
           * @return Promise containing the short url for the current configuration
           */
          getShortUrlOfCurrentConfiguration() {
              return new Promise((resolve, reject) => {
                  this.saveCurrentConfiguration().then((configuration) => {
                      if (!navigator.onLine) {
                          return reject('Can not generate short url when offline');
                      }
                      return this._rapiAccess
                          .getShortUrl(configuration.id, 3 /* SHORT_TYPES.CONFIGURATION */)
                          .then((shortId) => {
                          // @todo georg check why the environment doesnt work
                          // const id = (Env.detailEnvironment === Env.environments.PRODUCTION || Env.detailEnvironment === Env.environments.ALPHA) ? shortId.shortId : shortId.referencedId;
                          const id = shortId.shortId;
                          const url = Env.APP.SHORTENER_URL + id;
                          resolve(url);
                      }, reject);
                  }, reject);
              });
          }
          /**
           * Returns the formatted value based on the parameter.unitType
           *
           * @param value
           * @param parameter
           */
          formatValueToUnitString(value, parameter) {
              return this._unitFormatter.formatValueToUnitString(value, parameter);
          }
          /**
           * Get tag for a given tag id
           *
           * @param tagId
           * @param options `{ include: RAPI_PATHS[] }`
           * @return Promise containing the tag including items and materials for that tag
           */
          getTagById(tagId, options) {
              return new Promise((resolve, reject) => {
                  this._getTag(tagId).then((tag) => {
                      let materialPromise = Promise.resolve([]);
                      let itemPromise = Promise.resolve([]);
                      if (options && options.include) {
                          options.include.forEach((type) => {
                              if (type === "materials" /* RAPI_PATHS.MATERIALS */) {
                                  materialPromise = this._rapiAccess.getMaterialsOf(tag);
                              }
                              if (type === "items" /* RAPI_PATHS.ITEMS */) {
                                  itemPromise = this._rapiAccess.getItems(tag.items);
                              }
                          });
                      }
                      // resolve({...tag, items} as RapiTagWithItems); // create a new object, otherwise stuff in store is overwritten
                      Promise.all([materialPromise, itemPromise]).then(([materials, items]) => {
                          items.sort(sortBySort);
                          materials.sort(sortBySort);
                          return resolve({
                              ...tag,
                              items,
                              materials,
                          });
                      }, reject);
                  }, reject);
              });
          }
          /**
           * Returns same url when online or caches url when offline
           * @param url
           */
          requestAsset(url) {
              return this._dataSyncer.requestAsset(url);
          }
          /**
           * Sets the material of the floor to the given RapiMaterial.
           * If the current environment is not floor environment it will be changed
           *
           * @param material
           * @return promise that resolves when material has been changed
           */
          changeFloorMaterial(material) {
              return this._sceneManager.changeFloorMaterial(material);
          }
          /**
           * Sets the material of the floor to the given material id.
           * If the current environment is not floor environment it will be changed
           *
           * Example material ids are:
           * roomle_floor:DresdenEiche
           * roomle_floor:Ibiza
           * roomle_floor:Palma
           * roomle_floor:Elba
           * roomle_floor:Manacor
           * roomle_floor:KernEiche
           * roomle_floor:KieferScandic
           * roomle_floor:EicheHabsburg
           * roomle_floor:FuldaKiefer
           * roomle_floor:Ashton
           * roomle_floor:EicheLondon
           *
           * @param materialId
           * @return promise that resolves when material has been changed
           */
          async changeFloorMaterialById(materialId) {
              const material = await this._rapiAccess.getMaterial(materialId);
              return this._sceneManager.changeFloorMaterial(material);
          }
          /**
           * In embedding scenario the core dispatches the onOpenFloorMaterials event
           * if someone outside of the iframe wants to open the floor materials popup
           * @hidden
           */
          openFloorMaterials() {
              this._configuratorUiCallbacks.onOpenFloorMaterials();
          }
          /**
           * In embedding scenario the core dispatches the onOpenPartList event
           * if someone outside of the iframe wants to open the part list popup
           * @hidden
           */
          openPartList() {
              this._configuratorUiCallbacks.onOpenPartList();
          }
          /**
           * It is possible to add additional content to a configurable-item in our backend
           * for example, product images, product videos etc. To fetch them you can use this method
           * @param rapiItems
           */
          getAdditionalContentsOf(rapiItems) {
              return this._rapiAccess.getAdditionalContentsOfItems(rapiItems);
          }
          /**
           * @hidden
           *
           * @param rapiId
           */
          changeTypeChangeTag(rapiId) {
              if (navigator.onLine && this._initData.offlineSync) {
                  this._dataSyncer.syncTypeChangeTag(rapiId);
              }
              this._configuratorUiCallbacks.onChangeTypeChangeTag(rapiId);
          }
          /**
           * After calling this method the UiCallback removeTypeChangeTag is triggered (see: {@link @roomle/web-sdk/configurator-core/src/services/configurator-ui-callback#ConfiguratorUiCallbacks.onRemoveTypeChangeTag})
           * @param rapiId
           */
          removeTypeChangeTag(rapiId) {
              this._configuratorUiCallbacks.onRemoveTypeChangeTag(rapiId);
          }
          showGUI() {
              this._sceneManager.showGUI();
          }
          /**
           * Show overlay with statistic data for:
           * fps
           * memory in MB
           * number of draw calls
           * number of poly/triangle count
           * number of geometries
           * number of textures
           */
          showStats() {
              this._sceneManager.showStats();
          }
          /**
           * Show dimensions (width, height, depth) of object
           *
           * See {@link @roomle/web-sdk/configurator-core/src/services/configurator-ui-callback#ConfiguratorUiCallbacks.onDimensionsVisibilityChange} to get notified when dimension visibility changes
           */
          showDimensions() {
              this._sceneManager.showDimensions();
          }
          /**
           * Hides dimensions when they are shown (see {@link showDimensions}).
           * Calling hideDimensions does not force dimensions to be always hidden.
           *
           * See {@link @roomle/web-sdk/configurator-core/src/services/configurator-ui-callback#ConfiguratorUiCallbacks.onDimensionsVisibilityChange} to get notified when dimension visibility changes
           */
          hideDimensions() {
              this._sceneManager.hideDimensions();
          }
          /**
           * Start sync of catalog to make it offline available
           * @param catalogId
           */
          syncCatalog(catalogId) {
              return this._dataSyncer.syncCatalog(catalogId);
          }
          /**
           * Start sync of floor tag to make it offline available
           * @param tagId
           */
          syncFloorTag(tagId) {
              return this._dataSyncer.syncFloorTag(tagId);
          }
          /**
           * Start sync of type change tag to make it offline available
           * @param tagId
           */
          syncTypeChangeTag(tagId) {
              return this._dataSyncer.syncTypeChangeTag(tagId);
          }
          /**
             * Loads a dynamic light settings into the scene. The dynamic light setting source can be an
             * object (js), json, or an url (url to json). See {@link @roomle/web-sdk/common-core/src/scene-settings-loader#SceneSettings} how to define it.
             *
             * Exampe:
             * ```
             {
              "lights": [
                {
                  "type": "rectarea",
                  "name": "main",
                  "intensity": 240,
                  "color": "#ffffff",
                  "position": {
                    "x": -0.5,
                    "y": 6,
                    "z": 3
                  },
                  "target": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                  },
                  "castShadow": true,
                  "width": 0.8,
                  "height": 0.8
                },
                {
                  "type": "spot",
                  "name": "side",
                  "intensity": 0.3,
                  "color": "#ffffff",
                  "position": {
                    "x": 2,
                    "y": 3,
                    "z": 1.5
                  },
                  "target": {
                    "x": 0,
                    "y": 0.1,
                    "z": 0
                  },
                  "castShadow": false,
                  "angle": 50,
                  "penumbra": 0.5
                },
                {
                  "type": "ambient",
                  "name": "ambient",
                  "intensity": 0.3,
                  "color": "#ffffff",
                  "position": {
                    "x": 0,
                    "y": 0,
                    "z": 0
                  }
                }
              ]
            }
             ```
             * @param source
             */
          loadDynamicLightSetting(source) {
              return this._sceneManager.loadDynamicLightSetting(source);
          }
          /**
           * Used for test puprose only
           * @hidden
           * @param hex
           */
          setBackgroundColor(hex) {
              this._sceneManager.setBackgroundColor(hex);
          }
          /**
           * Used for test puprose only
           * @hidden
           * @param url
           */
          setBackgroundImage(url) {
              this._sceneManager.setBackgroundImage(url);
          }
          /**
           * Loads a SceneSettings object, currently it can can contain a light setting definition
           * (see {@link @roomle/web-sdk/configurator-core/src/roomle-configurator#RoomleConfigurator.loadDynamicLightSetting}) and an environment definition (see {@link @roomle/web-sdk/common-core/src/environment/dynamic-environment-setting-loader#EnvironmentSetting}).
           * @param sceneSettings
           */
          loadSceneSetting(sceneSettings) {
              return this._sceneManager.loadSceneSettings(sceneSettings);
          }
          /**
           * By default the outline pass uses the bounding box mesh of each component to highlight the object.
           * When mesh selection is enabled, the meshes of the object are used directly.
           * This is the recommended setting for non square/rectangular (shelf) components like sofas.
           *
           * @param enabled
           */
          enableMeshSelection(enabled) {
              this._initData.meshSelection = enabled;
          }
          /**
           * This function has to be called when the size of the container
           * (the html element which has been used in the init method) changes
           * It is VERY important to call this method because the SDK can not
           * detect if the DOM element which embeds the canvas of the 3D scene
           * changes in size
           */
          updateSize() {
              this._sceneManager.updateCamera();
          }
          setCameraOffset(offset) {
              this._sceneManager.setCameraOffset(offset);
          }
          getCameraOffset() {
              return this._sceneManager.getCameraOffset();
          }
          /**
           * Return the main class which has access to lifecycle events and RapiAccess.
           * Hidden because it's only useful for embedding API.
           * Has to be overridden by main class.
           * @hidden
           */
          getMain() {
              return undefined;
          }
          /**
           * Clears the scene and all components/meshes.
           * Also unregisters configurator callbacks in kernel.
           * @param options CleanupOptions
           */
          cleanup(options = {}) {
              this._configuratorContext.selectedRuntimeComponentIds = [];
              this._plannerKernelAccess.cleanUpCallbacks();
              this._sceneManager.sceneCleared(!!options.resetMeshCache);
              if (options.resetCoreCache) {
                  this._plannerKernelAccess.kernelInstance.clearAll();
              }
              if (options.resetApiCache) {
                  this._rapiAccess.cleanUp();
              }
          }
          /**
           * This method is used for lifecycle tests only
           * @hidden
           */
          resumeTest(element) {
              if (element) {
                  this._domHelper.setDomElement(element);
              }
              this._lifeCycleManager.resume();
          }
          /**
           * This method is used for lifecycle tests only
           * @hidden
           */
          pauseTest() {
              this._lifeCycleManager.pause();
          }
          /**
           * Moves the camera closer to the object. Default value (when no value given) is 4, higher value moves a bigger distance.
           * @param value
           */
          zoomIn(value) {
              this._sceneManager.zoomIn(value);
          }
          /**
           * Moves the camera away from the object. Default value (when no value given) is 4, higher value moves a bigger distance.
           * @param value
           */
          zoomOut(value) {
              this._sceneManager.zoomOut(value);
          }
          /**
           * Use this callbacks to hook in your functionality
           */
          get callbacks() {
              return this._configuratorUiCallbacks;
          }
          /**
           * @internal
           * Use this callbacks to hook in your functionality
           */
          get globalCallbacks() {
              return this._globalCallback;
          }
          /**
           * Returns the runtime component id of root component of the current plan object
           * @return number the number of the runtime id of the root component
           */
          getRuntimeComponentIdOfRootComponent() {
              // Maybe we refactor this to a own class in future
              // abstract class then must have a getConfiguratorKernelMethod and getRuntimeComponentIdOfRootComponent
              // further more we need to think how to deal with planObjectId vs no planObjectId (see roomle-configurator vs roomle-planner)
              const planObjectId = this._configuratorContext.planObjectId;
              if (!planObjectId) {
                  console.warn('planObjectId not set');
                  return 0; // Kernel returns 0 if something is invalid, to be same as kernel also return 0 here
              }
              return this._plannerKernelAccess.getRuntimeComponentIdOfRootComponent(planObjectId);
          }
          /**
           * returns the current configuration hash, this can be used for analytics or other stuff like caching etc
           * @return string current configuration hash
           */
          getCurrentConfigurationHash() {
              return this._plannerKernelAccess.getConfigurationHash(this._configuratorContext);
          }
          getCurrentSelection() {
              let ids = this._configuratorContext.selectedRuntimeComponentIds;
              if (!ids || !ids.length) {
                  ids = [this._configuratorContext.rootComponentId];
              }
              return ids.map((id) => this._plannerKernelAccess.getRuntimeComponentId(id));
          }
          isReady() {
              const measures = Benchmark.getMeasure("kernel_is_ready" /* MARKS.KERNEL_IS_READY */);
              if (Array.isArray(measures) && measures.length === 1) {
                  const measure = measures[0];
                  const benchmarkMeta = Benchmark.getMeta("kernel_is_ready" /* MARKS.KERNEL_IS_READY */);
                  this._configuratorUiCallbacks.onTrackTiming("Timing" /* TRACKING_CATEGORIES.TIMING */, "KernelIsReady" /* UI_TRACKING.KERNEL_IS_READY */, Math.round(measure.duration), Object.assign(benchmarkMeta, { startTime: measure.startTime }));
              }
              this._isKernelReady = true;
              this._checkInitDone();
              // this is for legacy! remove if not needed later
              if (typeof this._configuratorUiCallbacks.onKernelIsReady === 'function') {
                  this._configuratorUiCallbacks.onKernelIsReady();
              }
          }
          async updatePossibleChildren(elementId, children, parameterUpdateType) {
              const possibleChildren = await this._addAdditionalInfoToPossibleChildren(elementId, children, parameterUpdateType);
              if (possibleChildren) {
                  const { tags, defaultChild } = possibleChildren;
                  if (this._shouldBroadcastToUi(parameterUpdateType)) {
                      this._configuratorUiCallbacks.onUpdatePossibleChildren(tags, defaultChild);
                  }
              }
          }
          updateParameters(parameters, parameterGroups, elementId, parameterUpdateType) {
              // Mapping tooltip for parameters key only
              this._setParameterTooltip(parameters, elementId);
              this._addGroupsToParameters(elementId, parameters, parameterGroups, parameterUpdateType);
              if (!this._shouldBroadcastToUi(parameterUpdateType)) {
                  return;
              }
              this._configuratorUiCallbacks.onUpdateParameters(parameters);
          }
          loadError(error) {
              this._isLoadError = true;
              if (this._rejectOnLoadError) {
                  this._rejectOnLoadError(error);
              }
          }
          resumeKernelCallbacks() {
              this._plannerKernelAccess.muteKernelCallbacks = false;
              this._plannerKernelAccess.resume();
          }
          pauseKernelCallbacks() {
              this._plannerKernelAccess.muteKernelCallbacks = true;
              this._plannerKernelAccess.pause();
          }
          /**
           * Set the name of the parameter group which is selected at the moment
           * @param group
           */
          setActiveGroupInView(group) {
              this._plannerKernelAccess.setActiveGroupInView(group);
          }
          /**
           * Set the name of the parameter group which is selected at the moment
           * @param group
           * @param runtimeId
           */
          setActiveGroupInViewForPlanObject(group, runtimeId) {
              this._plannerKernelAccess.setActiveGroupInViewForPlanObject(group, runtimeId);
          }
          /**
           * Get all parameter groups defined on the component, even if it has no parameters assigned
           */
          getParameterGroups() {
              return this._plannerKernelAccess.getParameterGroups();
          }
          /**
           * Get the data which is assigned to the configurator object, especially things like allowed hosts
           */
          async getConfiguratorSettings(id) {
              return this._rapiAccess.getConfiguratorSettings(id);
          }
          async moveCamera(cameraParameter) {
              return this._sceneManager.moveCamera(cameraParameter);
          }
          /**
           * Select a component by runtime id. You can retrieve this ID from partlist etc
           * If it's already selected it will be deselected to mimic the behavior of click/touch
           * @param runtimeId number, the runtime id of the component. You can retrieve this ID from partlist etc
           */
          selectComponent(runtimeId) {
              if (this._configuratorContext.selectedRuntimeComponentId === runtimeId) {
                  return Promise.resolve();
              }
              return Promise.resolve(this._sceneManager.selectComponent(runtimeId));
          }
          /**
           * Sets the parameter of the component by it's runtime id
           * parameters of the plan object are set
           * @param runtimeId number, the runtime id of the component. You can retrieve this ID from partlist etc
           * @param parameter an instance of the kernel parameter we want to set, use 'key: "your-key"' if
           *                  you do not have a kernel instance and do not need validation of the input
           * @param value the value we want to set on the parameter as string
           */
          setComponentParameter(runtimeId, parameter, value) {
              const { key, type } = parameter;
              return new Promise((resolve, reject) => this._plannerKernelAccess.changeComponentParameter(runtimeId, key, type, value, resolve, reject));
          }
          /**
           * Highlight parts in the scene with the given ids
           * Use empty array to remove highlights
           * @param ids
           */
          highlightParts(ids) {
              this._sceneManager.highlightParts(ids);
          }
          /**
           * Undo last action
           * calls configuratorHistory.undo where array of last configuration are stored
           */
          undo() {
              return new Promise((resolve, reject) => {
                  const configurationString = this._configuratorHistory.undo();
                  if (configurationString) {
                      this._callOnPartListUpdate().then(resolve, reject);
                      this._plannerKernelAccess.loadConfiguration(configurationString);
                  }
              });
          }
          /**
           * Redo last action
           * calls configuratorHistory.redo where array of last configuration are stored
           * only possible if undo was called before
           */
          redo() {
              return new Promise((resolve, reject) => {
                  const configurationString = this._configuratorHistory.redo();
                  if (configurationString) {
                      this._callOnPartListUpdate().then(resolve, reject);
                      this._plannerKernelAccess.loadConfiguration(configurationString);
                  }
              });
          }
          /**
           * clears current configurator history
           */
          clearHistory() {
              this._configuratorHistory.clearHistory();
          }
          /**
           * Returns the hash of the given serialized configuration
           * @param serializedConfiguration
           */
          getHashOfSerializedConfiguration(serializedConfiguration) {
              return this._plannerKernelAccess.kernelInstance.getHashOfSerializedConfiguration(serializedConfiguration);
          }
          /**
           * Returns parameters of the component including groups
           * @param componentRuntimeId
           */
          getParametersOfComponent(componentRuntimeId) {
              const parameterUpdateType = 1 /* PARAMETER_UPDATE_TYPE.PLAN_COMPONENT */;
              const parameters = this._plannerKernelAccess.kernelInstance.getComponentParameters(componentRuntimeId);
              const parameterGroups = this.getParameterGroups();
              this._mapComponentTooltipsToParamKeys(parameters, componentRuntimeId);
              return this._addGroupsToParameters(componentRuntimeId, parameters, parameterGroups, parameterUpdateType, true);
          }
          _mapComponentTooltipsToParamKeys(parameters, componentRuntimeId) {
              const componentId = this._plannerKernelAccess.kernelInstance.getComponentId(componentRuntimeId);
              const component = this._rapiAccess.peekComponent(componentId);
              if (!component || !component.additionalInfos) {
                  return;
              }
              for (const param of parameters) {
                  const matchingParameter = component.additionalInfos.find((info) => info.key.toLocaleLowerCase() === param.key.toLocaleLowerCase() &&
                      info.type === 'parameter');
                  if (matchingParameter) {
                      param.tooltip = matchingParameter.tooltip;
                  }
              }
          }
          _setParameterTooltip(parameters, componentRuntimeId) {
              if (Array.isArray(componentRuntimeId)) {
                  componentRuntimeId.forEach((id) => this._mapComponentTooltipsToParamKeys(parameters, id));
              }
              else {
                  this._mapComponentTooltipsToParamKeys(parameters, componentRuntimeId);
              }
          }
          _addGroupsToParameters(componentRuntimeId, parameters, parameterGroups, parameterUpdateType, alwaysResolve = false) {
              if (!parameterGroups) {
                  parameterGroups = [];
                  console.warn('Kernel returned no parameter groups! Check why!');
              }
              const parameterGroupMapping = {};
              parameterGroups.forEach((parameterGroup) => {
                  parameterGroupMapping[parameterGroup.key] = parameterGroup;
              });
              parameters.sort(sortBySort);
              parameters.forEach((parameter) => {
                  if (parameter.group) {
                      parameter.grouping = parameterGroupMapping[parameter.group];
                  }
                  else {
                      parameter.grouping = null;
                  }
                  this._unitFormatter.formatParameter(parameter);
                  if (isMaterial(parameter)) {
                      Object.defineProperty(parameter, 'groups', {
                          get: () => {
                              return new Promise((resolve, reject) => {
                                  this._getMaterialGroups(parameter).then((materialGroups) => {
                                      if ((this._isCorrectResponse(parameterUpdateType, componentRuntimeId) &&
                                          this._shouldBroadcastToUi(parameterUpdateType)) ||
                                          alwaysResolve) {
                                          resolve(materialGroups);
                                      }
                                      else {
                                          reject('Response does not match to ids');
                                      }
                                  }, reject);
                              });
                          },
                      });
                  }
              });
              return parameters;
          }
          async _getChildrenOf(id, onlyPossible, onlyVisible, childrenGetter) {
              const children = childrenGetter(id, onlyPossible, onlyVisible);
              const parameterUpdateType = 2 /* PARAMETER_UPDATE_TYPE.COMMON_COMPONENTS */;
              const childrenWithInfo = await this._addAdditionalInfoToPossibleChildren(id, children, parameterUpdateType, false, true);
              return childrenWithInfo;
          }
          /**
           * Returns all possible children and the default child for a given component
           * @param componentRuntimeId
           * @param onlyPossible: boolean true if you only want possibleChildren
           * @param onlyVisible: boolean true if you only want visible children
           */
          async getChildrenOfPlanComponent(componentRuntimeId, onlyPossible = false, onlyVisible = false) {
              const getter = this._plannerKernelAccess.kernelInstance.getChildrenOfPlanComponent.bind(this._plannerKernelAccess.kernelInstance);
              return this._getChildrenOf(componentRuntimeId, onlyPossible, onlyVisible, getter);
          }
          /**
           * Returns all possible children and the default child for the plan object
           * @param onlyPossible: boolean true if you only want possibleChildren
           * @param onlyVisible: boolean true if you only want visible children
           */
          async getChildrenOfPlanObject(onlyPossible = false, onlyVisible = false) {
              const { planObjectId } = this._configuratorContext;
              const getter = this._plannerKernelAccess.kernelInstance.getChildrenOfPlanObject.bind(this._plannerKernelAccess.kernelInstance);
              return this._getChildrenOf(planObjectId, onlyPossible, onlyVisible, getter);
          }
          async _addAdditionalInfoToPossibleChildren(componentRuntimeId, children, parameterUpdateType, checkCorrectResponse = true, returnAllChildren = false) {
              const { possibleChildren, defaultChild } = await this._getPossibleChildrenForKernelPossibleChildren(children, returnAllChildren);
              const tagIds = [];
              const associations = new Map();
              const noTagChilds = [];
              possibleChildren.forEach((entry) => {
                  const tags = entry.tags;
                  if (entry.tags && Array.isArray(entry.tags) && entry.tags.length) {
                      for (let j = 0, tagLength = entry.tags.length; j < tagLength; j++) {
                          const tagId = tags[j];
                          if (tagIds.indexOf(tagId) === -1) {
                              tagIds.push(tagId);
                          }
                          let associationsToTag = associations.get(tagId);
                          if (!associationsToTag) {
                              const elements = [];
                              associations.set(tagId, elements);
                              associationsToTag = associations.get(tagId);
                          }
                          associationsToTag.push(entry);
                      }
                  }
                  else {
                      noTagChilds.push(entry);
                  }
              });
              if (this._isCorrectResponse(parameterUpdateType, componentRuntimeId) ||
                  !checkCorrectResponse) {
                  let tags;
                  try {
                      tags = await this._rapiAccess.getTags(tagIds);
                  }
                  catch (error) {
                      console.error('Couldnt load tags of possible children');
                      console.error(error);
                  }
                  tags.forEach((tag) => {
                      tag.possibleChildren = associations.get(tag.id);
                  });
                  tags.sort(sortBySort);
                  if (noTagChilds.length) {
                      tags.unshift({
                          id: '',
                          externalIdentifier: '',
                          global: false,
                          created: new Date().toISOString(),
                          updated: new Date().toISOString(),
                          language: this._globalInitData.locale,
                          catalog: null,
                          tags: [],
                          parents: [],
                          materials: [],
                          items: [],
                          possibleChildren: noTagChilds,
                      });
                  }
                  return { tags, defaultChild };
              }
              return null;
          }
          async _getPossibleChildrenForKernelPossibleChildren(children, returnAllChildren = false) {
              const componentIds = [];
              const itemIds = [];
              let defaultChildId;
              const componentChildren = new Map();
              const itemChildren = new Map();
              children.forEach((child) => {
                  if (!child.possible && !returnAllChildren) {
                      return;
                  }
                  let id = child.itemId;
                  if (child.itemId) {
                      itemIds.push(child.itemId);
                      itemChildren.set(child.itemId, child);
                  }
                  else {
                      componentIds.push(child.componentId);
                      componentChildren.set(child.componentId, child);
                      id = child.componentId;
                  }
                  if (child.isDefault && !defaultChildId) {
                      defaultChildId = id;
                  }
              });
              const componentsAndItems = await Promise.all([
                  this._rapiAccess.getComponents(componentIds),
                  this._rapiAccess.getItems(itemIds),
              ]);
              const components = componentsAndItems[0];
              const items = componentsAndItems[1];
              const possibleChildren = [];
              let defaultChild = null;
              components.forEach((component) => {
                  component.isItem = false;
                  component.isComponent = true;
                  const kernelPossibleChild = componentChildren.get(component.id);
                  if (kernelPossibleChild) {
                      component.group = kernelPossibleChild.group;
                      component.possible = kernelPossibleChild.possible;
                  }
                  if (component.id === defaultChildId) {
                      component.isDefault = true;
                      defaultChild = component;
                  }
                  possibleChildren.push(component);
              });
              items.forEach((item) => {
                  item.isItem = true;
                  item.isComponent = false;
                  const kernelPossibleChild = itemChildren.get(item.id);
                  if (kernelPossibleChild) {
                      item.group = kernelPossibleChild.group;
                      item.possible = kernelPossibleChild.possible;
                  }
                  if (item.id === defaultChildId) {
                      item.isDefault = true;
                      defaultChild = item;
                  }
                  possibleChildren.push(item);
              });
              possibleChildren.sort(sortBySort);
              return { possibleChildren, defaultChild };
          }
          /**
           * returns unit formatter for formatting input und output values in scene
           */
          getUnitFormatter() {
              return this._unitFormatter;
          }
          /**
           * returns manager class to interface with indexedDB storage
           */
          getStorage() {
              return this._idbManager;
          }
          /**
           * returns class containing configurator specific data properties
           */
          getConfiguratorContext() {
              return this._configuratorContext;
          }
          /**
           * Returns the KernelComponent object for the given componentRuntimeId
           * @param componentRuntimeId
           */
          getComponent(componentRuntimeId) {
              return this._sceneManager.getComponent(componentRuntimeId);
          }
          async getTools() {
              const roomleToolsCore = RoomleDependencyInjection.lookup('roomle-tools-core', this._creator_);
              await roomleToolsCore.init();
              return roomleToolsCore;
          }
          exportImageFromCamera(filename = 'image') {
              this._sceneManager.exportImageFromCamera(filename);
          }
          calcPartsPriceSum(partList) {
              return this._plannerKernelAccess.calcPartsPriceSum(partList);
          }
          async generateProductionServiceExport(defaultExportDefinition = '') {
              return this.generateExport(0 /* ExportType.TC */, defaultExportDefinition);
          }
          async generateTCExport(defaultExportDefinition = '') {
              return this.generateExport(0 /* ExportType.TC */, defaultExportDefinition);
          }
          async generateIMOSiXExport(defaultExportDefinition = '') {
              return this.generateExport(1 /* ExportType.IMOSiX */, defaultExportDefinition);
          }
          async generateExport(exportType, defaultExportDefinition = '') {
              const planObjectId = this._configuratorContext.planObjectId;
              try {
                  this._plannerKernelAccess.configurationExporter.setDefaultExportDataDefinition(defaultExportDefinition);
                  return Promise.resolve(JSON.parse(this._plannerKernelAccess.configurationExporter.generateExport(exportType, planObjectId, this._plannerKernelAccess.kernelInstance)));
              }
              catch (e) {
                  console.error(e);
                  return Promise.reject(`Could not create export JSON ${exportType}`);
              }
          }
          setEnvironmentMap(params) {
              const { url, intensity, rotation, maxLightSources } = params;
              this._sceneManager.setEnvironmentMap(url, intensity, rotation, maxLightSources);
          }
      } exports('R', RoomleConfigurator);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_rapiAccess", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_dataSyncer", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_errorHandler", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_unitFormatter", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_idbManager", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_domHelper", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_configuratorUiCallbacks", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_configuratorKernelAccessCallback", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_lifeCycleManager", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_plannerKernelAccess", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_scriptLoader", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_configuratorContext", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_initData", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_globalInitData", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_globalCallback", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_kernelIo", void 0);
      __decorate([
          inject
      ], RoomleConfigurator.prototype, "_configuratorHistory", void 0);

    })
  };
}));
//# sourceMappingURL=roomle-configurator-d1c08338.nomodule.js.map
