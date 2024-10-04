import { _ as __decorate, i as inject, E as EventDispatcher, t as toRadiant, H as position3VectorsAreEqual, J as position2VectorsAreEqual, K as compareBox3Size, p as getIdealDistance, s as toDegrees, M as MaterialCreator, N as createMaterial, O as addTexture, Q as getGUI, S as rotationQuaternionsAreEqual, T as getDelta, U as MIN_MOVE_DISTANCE, V as LightSourceDetector, W as EnvironmentMapDecodeMaterial, X as RoomleWebGLRenderer, Y as standaloneConfiguratorQualityLevels, Z as ENV_HDR_256_FILE_NAME, n as dispose, j as DynamicLightSettingLoader, r as RoomleComponentFactoryInitializer } from './roomle-dependency-injection-2055fbaa.js';
import { a as Vector3, bz as debounce, N as PerspectiveCamera, V as Vector2, bB as areCameraParametersEqual, ae as Sphere, ad as Box3, ag as Euler, Q as Quaternion, aB as deepMerge, O as Object3D, z as Mesh, bD as Shape, bE as Path, bF as ShapeGeometry, m as TextureLoader, bG as Fog, C as Color, r as RepeatWrapping, w as DoubleSide, W as OrthographicCamera, U as MathUtils, aT as handleJsonResponse, S as SpotLight, A as AmbientLight, D as DirectionalLight, R as RectAreaLight, bH as IcosahedronGeometry, ao as ShaderMaterial, b8 as PlaneGeometry, h as MeshBasicMaterial, bI as CircleGeometry, u as LineBasicMaterial, B as BufferGeometry, E as LineSegments, bJ as PMREMGenerator, an as Matrix3, au as NoBlending, ah as CubeTexture, a9 as Texture, al as Scene, aN as BoxGeometry, bK as Clock, bC as sanitizedCameraMode, bA as getColor, bv as WebGLRenderer, i as SRGBColorSpace, bk as PCFSoftShadowMap, bL as download } from './main-thread-to-worker-8a755a37.js';

var ENV_HDR_1K_FILE_NAME = "static/default_1k-2aa6d42244d30fb1.exr";

var ENV_LEGACY = "static/legacy_env-d5810ec5057d4716.exr";

var TWEEN_FILE_NAME = "static/Tween-d57ee5d181fce582.js";

const INITIAL_YAW = -30;
const INITIAL_PITCH = 10;
const INITIAL_CAMERA_DISTANCE = -1;
const DEBUG_CAMERA_POSITION = 'debug_camera_position';
class CameraControl extends EventDispatcher {
    constructor(creator, inputManager, initialCameraPosition) {
        super();
        this._tweenEnd = null;
        this._cameraStandingStill = true;
        this._pitch = toRadiant(INITIAL_PITCH);
        this._yaw = toRadiant(INITIAL_YAW);
        this._distance = INITIAL_CAMERA_DISTANCE;
        this._locked = false;
        this._inputListeners = [];
        this._lerpEnabled = true;
        this._creator_ = creator;
        this._inputManager = inputManager;
        this._initInputListener();
        this._addInputListeners();
        this._cameraPosition = new Vector3();
        this._targetPosition = new Vector3();
        if (initialCameraPosition) {
            this._cameraPosition.copy(initialCameraPosition);
        }
        else {
            this._cameraPosition = new Vector3(0, 0.5, 3);
        }
        if (this._initData.debug) {
            const debugCameraPosition = this.getDebugCameraPosition();
            if (debugCameraPosition) {
                this._setCurrentCameraParameters(debugCameraPosition);
            }
        }
        let clientDimensions = this._domHelper.getClientDimensions();
        this._width = clientDimensions.x;
        this._height = clientDimensions.y;
        this._dispatchCameraIdle = debounce(this._dispatchCameraIdle.bind(this), 32);
    }
    getCamera() {
        return this._getCamera();
    }
    _addInputListeners() {
        this._inputListeners.forEach((listener) => {
            this._inputManager.addEventListener(listener.key, listener.fun, this);
        });
    }
    _removeInputListeners() {
        this._inputListeners.forEach((listener) => {
            this._inputManager.removeEventListener(listener.key, listener.fun);
        });
        this._inputListeners = [];
    }
    cleanUp() {
        this._removeInputListeners();
    }
    animateCamera(delta) {
        let desiredPosition = this._cameraPosition;
        if (!desiredPosition ||
            position3VectorsAreEqual(desiredPosition, this.getCamera().position)) {
            if (!this._cameraStandingStill) {
                this._cameraStandingStill = true;
                setTimeout(() => this._dispatchCameraIdle(), 16);
                if (this._initData.debug) {
                    this.saveDebugCameraPosition();
                }
            }
            return false;
        }
        if (this._cameraStandingStill) {
            this.dispatchEvent(7 /* CAMERA_EVENT.MOVING */, 3 /* INPUT_EVENT_TYPE.AUTO */);
        }
        this._cameraStandingStill = false;
        if (this._lerpEnabled && !this._tweenEnd && !this._initData.e2e) {
            let newCameraPosition = this.getCamera().position.clone();
            const lerpFactor = Math.min(delta * 10, 1);
            newCameraPosition.lerp(desiredPosition, lerpFactor);
            this.getCamera().position.copy(newCameraPosition);
        }
        else {
            this.getCamera().position.copy(desiredPosition);
        }
        return true;
    }
    getDebugCameraPosition() {
        return JSON.parse(localStorage.getItem(DEBUG_CAMERA_POSITION));
    }
    saveDebugCameraPosition() {
        localStorage.setItem(DEBUG_CAMERA_POSITION, JSON.stringify(this.getCurrentCameraParameters()));
    }
    _dispatchCameraIdle() {
        this.dispatchEvent(8 /* CAMERA_EVENT.IDLE */, 3 /* INPUT_EVENT_TYPE.AUTO */);
    }
    _tweenCameraParameter(start, end, ignoreChecks = false) {
        if (this._initData.e2e) {
            this.dispatchEvent(0 /* CAMERA_EVENT.ORBIT_START */, 3 /* INPUT_EVENT_TYPE.AUTO */);
            this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */, 3 /* INPUT_EVENT_TYPE.AUTO */);
            this._yaw = end.yaw;
            this._pitch = end.pitch;
            this._distance = end.distance;
            this._setCameraNear();
            this._update(new Vector3(end.targetX, end.targetY, end.targetZ), ignoreChecks);
            this.dispatchEvent(2 /* CAMERA_EVENT.ORBIT_END */, 3 /* INPUT_EVENT_TYPE.AUTO */);
            return Promise.resolve();
        }
        return new Promise((resolve) => {
            if (end.yaw - start.yaw <= -Math.PI) {
                start.yaw -= Math.PI * 2;
            }
            else if (end.yaw - start.yaw >= Math.PI) {
                start.yaw += Math.PI * 2;
            }
            if (window.TWEEN) {
                if (this._tweenEnd !== null && this._tweenEnd.blockOtherTweens) {
                    return;
                }
                this._tweenEnd = end;
                new TWEEN.Tween(start)
                    .to(end, 400)
                    .easing(TWEEN.Easing.Sinusoidal.In)
                    .onUpdate(() => {
                    this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */, 3 /* INPUT_EVENT_TYPE.AUTO */);
                    this._yaw = start.yaw;
                    this._pitch = start.pitch;
                    this._distance = start.distance;
                    this._setCameraNear();
                    this._update(new Vector3(start.targetX, start.targetY, start.targetZ), ignoreChecks);
                })
                    .onComplete(() => {
                    this.dispatchEvent(2 /* CAMERA_EVENT.ORBIT_END */, 3 /* INPUT_EVENT_TYPE.AUTO */);
                    this._dispatchCameraIdle();
                    this._tweenEnd = null;
                    resolve();
                })
                    .start();
                this.dispatchEvent(0 /* CAMERA_EVENT.ORBIT_START */, 3 /* INPUT_EVENT_TYPE.AUTO */);
            }
        });
    }
    _setCameraNear() {
        const camera = this.getCamera();
        if (camera instanceof PerspectiveCamera) {
            const near = Math.max(0.1, this._distance / 6);
            camera.near = near;
        }
    }
    getCurrentCameraParameters() {
        const targetClone = this._targetPosition.clone();
        return {
            yaw: this._yaw,
            pitch: this._pitch,
            distance: this._distance,
            targetX: targetClone.x,
            targetY: targetClone.y,
            targetZ: targetClone.z,
        };
    }
    _setCurrentCameraParameters(cameraParameters) {
        this._yaw = cameraParameters.yaw;
        this._pitch = cameraParameters.pitch;
        this._distance = cameraParameters.distance;
        this._targetPosition.copy(new Vector3(cameraParameters.targetX, cameraParameters.targetY, cameraParameters.targetZ));
    }
    _rotateHorizontal(angle) {
        this._yaw -= angle;
        if (this._yaw < -Math.PI) {
            this._yaw += 2 * Math.PI;
        }
        else if (this._yaw > Math.PI) {
            this._yaw -= 2 * Math.PI;
        }
    }
    _rotateVertical(angle) {
        this._pitch += angle;
        if (this._pitch < -Math.PI) {
            this._pitch += 2 * Math.PI;
        }
        else if (this._pitch > Math.PI) {
            this._pitch -= 2 * Math.PI;
        }
    }
    saveState(override) {
        if (override || !this._stateSaved) {
            let savedYaw = this._yaw;
            let savedPitch = this._pitch;
            let savedDistance = this._distance;
            let targetClone = this._targetPosition.clone();
            this._stateSaved = {
                yaw: savedYaw,
                pitch: savedPitch,
                distance: savedDistance,
                targetX: targetClone.x,
                targetY: targetClone.y,
                targetZ: targetClone.z,
                blockOtherTweens: true,
            };
            if (this._getCamera().fov) {
                let camera = this._getCamera();
                this._stateSaved.fov = camera.fov;
                this._stateSaved.near = camera.near;
                this._stateSaved.far = camera.far;
            }
            return this._stateSaved;
        }
        return null;
    }
    resetToState() {
        if (this._stateSaved) {
            this._stateSaved.blockOtherTweens = false;
            let targetClone = this._targetPosition.clone();
            this._tweenCameraParameter({
                yaw: this._yaw,
                pitch: this._pitch,
                distance: this._distance,
                targetX: targetClone.x,
                targetY: targetClone.y,
                targetZ: targetClone.z,
            }, this._stateSaved, true);
        }
        this._stateSaved = null;
    }
    setToState(start, state) {
        this._tweenCameraParameter(start, state, true);
    }
    hasSavedState() {
        return this._stateSaved != null;
    }
    lock() {
        this._locked = true;
    }
    unlock() {
        this._locked = false;
    }
    isLocked() {
        return this._locked;
    }
    getTargetPosition() {
        return this._targetPosition;
    }
    _saveYawAndPitch() {
        // save current yaw in camera userdata to reduce dependencies
        this._getCamera().userData.yaw = this._yaw;
        this._getCamera().userData.pitch = this._pitch;
    }
    getInputPosition(position) {
        const { x, y } = this._domHelper.getClientDimensions();
        return new Vector3((position.x / x) * 2 - 1, -(position.y / y) * 2 + 1, 0.5);
    }
    addLightContainer(container) {
        container.name = 'lights';
        const camera = this._getCamera();
        const currentContainer = camera.children.find((child) => child.name === 'lights');
        if (currentContainer) {
            camera.remove(currentContainer);
        }
        camera.add(container);
    }
    checkNearFarDistance(point) {
        if (!point) {
            return;
        }
        const distance = this._cameraPosition.distanceTo(point);
        const camera = this._getCamera();
        if (camera instanceof PerspectiveCamera && distance > camera.far) {
            camera.far = distance + 1;
        }
    }
    setBounds(boundingBox) {
        this._boundingBox = boundingBox;
    }
}
__decorate([
    inject
], CameraControl.prototype, "_domHelper", void 0);
__decorate([
    inject
], CameraControl.prototype, "_initData", void 0);

class ZoomChangeEvent {
    constructor(minZoom, maxZoom) {
        this.minZoom = false;
        this.maxZoom = false;
        this.minZoom = minZoom;
        this.maxZoom = maxZoom;
    }
}
const ROTATION_SPEED$1 = 1;
const PAN_SPEED = 4;
const MIN_PAN_SPEED = 2;
const ZOOM_SPEED$1 = 3;
const MAX_DISTANCE_MINIMAL = 2;
const DISTANCE_FACTOR = 2.725;
const MAX_POLAR_ANGLE$1 = 85;
class CameraControl3D extends CameraControl {
    constructor(creator, inputManager, initialCameraPosition, camera) {
        super(creator, inputManager, initialCameraPosition);
        this._bounds = new Vector3();
        this._scale = 1;
        this._state = 0 /* STATE.NONE */;
        this._zoomSpeed = Math.pow(0.95, ZOOM_SPEED$1);
        this.minDistance = 0;
        this.maxDistance = 5;
        this.minPolarAngle = toRadiant(0);
        this.maxPolarAngle = toRadiant(MAX_POLAR_ANGLE$1);
        this._objectRotation = 0;
        this.minAzimuthAngle = Number.NEGATIVE_INFINITY;
        this.maxAzimuthAngle = Number.POSITIVE_INFINITY;
        this._zoomDistance = 0.1;
        this._userInteraction = false;
        this._currentZoomHash = '';
        this._maxZoomedIn = false;
        this._maxZoomedOut = false;
        this._panningEnabled = false;
        this._targetPositionIsPanned = false;
        if (!camera) {
            this._initCamera();
        }
        else {
            this._camera = camera;
        }
        this._camera.fov = 30;
        if (!this._targetPosition) {
            this._targetPosition = new Vector3(0, 0, 0);
            this._targetPositionIsPanned = false;
        }
        const { cameraRestriction, zoomDistance, minVerticalCameraAngle, maxVerticalCameraAngle, minHorizontalCameraAngle, maxHorizontalCameraAngle, } = this._initData;
        if (zoomDistance) {
            this._zoomDistance = zoomDistance / 100;
        }
        if (minVerticalCameraAngle !== undefined) {
            this.minPolarAngle = toRadiant(minVerticalCameraAngle < 0
                ? minVerticalCameraAngle
                : minVerticalCameraAngle * -1);
        }
        if (maxVerticalCameraAngle !== undefined) {
            this.maxPolarAngle = toRadiant(maxVerticalCameraAngle);
        }
        if (minHorizontalCameraAngle !== undefined) {
            this.minAzimuthAngle = toRadiant(minHorizontalCameraAngle < 0
                ? minHorizontalCameraAngle
                : minHorizontalCameraAngle * -1);
        }
        if (maxHorizontalCameraAngle !== undefined) {
            this.maxAzimuthAngle = toRadiant(maxHorizontalCameraAngle);
        }
        if (cameraRestriction !== undefined) {
            let cameraRestrictionRadiant = Math.abs(toRadiant(cameraRestriction));
            this.minAzimuthAngle = -cameraRestrictionRadiant;
            this.maxAzimuthAngle = cameraRestrictionRadiant;
            this.maxPolarAngle = Math.min(cameraRestrictionRadiant, toRadiant(MAX_POLAR_ANGLE$1));
        }
        this._update();
    }
    _getCamera() {
        if (this._camera) {
            return this._camera;
        }
        this._initCamera();
        return this._camera;
    }
    getCamera() {
        return super.getCamera();
    }
    _initCamera() {
        this._camera =
            new PerspectiveCamera();
        this._camera.fov = 30;
        this._camera.aspect = this._width / this._height;
        this._camera.near = 0.1;
        this._camera.far = 100;
        this._camera.updateProjectionMatrix();
        this._camera.layers.set(3 /* LAYER.OBJECT */);
        this._camera.layers.enable(1 /* LAYER.LIGHTING */);
        this._camera.layers.enable(2 /* LAYER.BACKGROUND */);
        this._camera.layers.enable(6 /* LAYER.UI */);
        this._camera.layers.enable(5 /* LAYER.PREVIEW */);
    }
    setObjectRotation(objectRotation) {
        this._objectRotation = objectRotation;
    }
    getObjectRotation() {
        return this._objectRotation;
    }
    updateCamera() {
        let { x, y } = this._domHelper.getClientDimensions();
        this._camera.aspect = x / y;
        this._camera.updateProjectionMatrix();
    }
    animateCamera(delta) {
        if (!super.animateCamera(delta)) {
            return false;
        }
        let target = this._targetPosition;
        if (!target) {
            return false;
        }
        this.getCamera().lookAt(target);
        return true;
    }
    _initInputListener() {
        this._inputListeners.push({
            key: 3 /* INPUT_EVENT.DOWN */,
            fun: ( /*event: InputEvent*/) => {
                this._state = 1 /* STATE.ORBIT */;
            },
        });
        this._inputListeners.push({
            key: 6 /* INPUT_EVENT.MOVE */,
            fun: (event) => {
                var _a, _b;
                if (this._state === 1 /* STATE.ORBIT */ && !this._locked) {
                    this._userInteraction = true;
                    const shiftHeld = ((_a = event.event) === null || _a === void 0 ? void 0 : _a.shiftKey) !== undefined &&
                        ((_b = event.event) === null || _b === void 0 ? void 0 : _b.shiftKey);
                    if (!shiftHeld && this._panningEnabled) {
                        this.disablePanning();
                    }
                    this._move(new Vector2(event.position.x, event.position.y), event.type);
                }
            },
        });
        this._inputListeners.push({
            key: 11 /* INPUT_EVENT.PAN */,
            fun: (event) => {
                if (this._state !== 1 /* STATE.ORBIT */ && !this._locked) {
                    this._userInteraction = true;
                    this._pan(new Vector2(event.position.x, event.position.y), event.type);
                }
            },
        });
        this._inputListeners.push({
            key: 4 /* INPUT_EVENT.UP */,
            fun: (event) => {
                if (this._state === 1 /* STATE.ORBIT */) {
                    this.dispatchEvent(2 /* CAMERA_EVENT.ORBIT_END */, event.type);
                }
                this._state = 0 /* STATE.NONE */;
                this._orbitPosition = null;
                this._lerpEnabled = true;
            },
        });
        this._inputListeners.push({
            key: 7 /* INPUT_EVENT.ZOOM_IN */,
            fun: ({ event }) => {
                if (!this._maxZoomedIn) {
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    this.zoomIn();
                }
            },
        });
        this._inputListeners.push({
            key: 8 /* INPUT_EVENT.ZOOM_OUT */,
            fun: ({ event }) => {
                if (!this._maxZoomedOut) {
                    if (event) {
                        event.preventDefault();
                        event.stopPropagation();
                    }
                    this.zoomOut();
                }
            },
        });
    }
    _panTargetPosition(position) {
        const orbitDelta = position.clone().sub(this._orbitPosition);
        const element = this._domHelper.element;
        // get the point in the cameras coordinate system
        const cameraTargetPoint = this._targetPosition.project(this._camera);
        const panSpeed = Math.max(MIN_PAN_SPEED, (1 - this._distance / this.maxDistance) * PAN_SPEED);
        cameraTargetPoint.x =
            cameraTargetPoint.x - (orbitDelta.x / element.clientHeight) * panSpeed;
        cameraTargetPoint.y =
            cameraTargetPoint.y + (orbitDelta.y / element.clientHeight) * panSpeed;
        this._targetPositionIsPanned = true;
        // get the camera target point in the world coordinate system
        this._targetPosition.copy(cameraTargetPoint.unproject(this._camera));
    }
    _pan(position, type) {
        this._lerpEnabled = false;
        if (!this._orbitPosition) {
            this._orbitPosition = new Vector2(position.x, position.y);
            this.dispatchEvent(0 /* CAMERA_EVENT.ORBIT_START */, type);
        }
        this._panTargetPosition(position);
        if (!position2VectorsAreEqual(this._orbitPosition, position)) {
            this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */, type);
        }
        this._orbitPosition.copy(position);
        this._update();
    }
    _move(position, type) {
        if (!this._orbitPosition) {
            this._orbitPosition = new Vector2(position.x, position.y);
            this.dispatchEvent(0 /* CAMERA_EVENT.ORBIT_START */, type);
        }
        const orbitDelta = position.clone().sub(this._orbitPosition);
        const element = this._domHelper.element;
        if (this._panningEnabled) {
            this._panTargetPosition(position);
        }
        else {
            this._rotateHorizontal(((2 * Math.PI * orbitDelta.x) / element.clientWidth) * ROTATION_SPEED$1);
            this._rotateVertical(((2 * Math.PI * orbitDelta.y) / element.clientHeight) * ROTATION_SPEED$1);
        }
        if (!position2VectorsAreEqual(this._orbitPosition, position)) {
            this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */, type);
        }
        this._orbitPosition.copy(position);
        this._update();
    }
    checkBoundsAndPlaceCamera(boundingBox, reset = true) {
        // should not zoom if box is smaller or equal, for example when bounds get smaller or user is zoomed in and moves and object
        if (this._boundingBox &&
            compareBox3Size(boundingBox, this._boundingBox) <= 0) {
            this.setBounds(boundingBox);
            return;
        }
        this.zoomToFitBounds(boundingBox, reset);
    }
    zoomToFitBounds(boundingBox, reset = true) {
        this.setBounds(boundingBox);
        const size = boundingBox.getSize(new Vector3());
        if (this._initData.debug || size.x + size.y + size.z === 0) {
            return;
        }
        const currentCameraParameter = this.getCurrentCameraParameters();
        const target = boundingBox.getCenter(new Vector3());
        const idealDistance = this._setDistanceAndRangesBasedOnBounds(size);
        this._checkZoomDistance(boundingBox, idealDistance);
        const endCameraParameter = {
            yaw: reset ? this._yaw : currentCameraParameter.yaw,
            pitch: reset ? this._pitch : currentCameraParameter.pitch,
            distance: idealDistance,
            targetX: target.x,
            targetY: target.y,
            targetZ: target.z,
        };
        if (areCameraParametersEqual(currentCameraParameter, endCameraParameter)) {
            return;
        }
        this._tweenCameraParameter(currentCameraParameter, endCameraParameter, false);
    }
    updateToBounds(boundingBox, isPreview, changeCamera = true, target) {
        this.setBounds(boundingBox);
        if (this._initData.debug) {
            return;
        }
        const position = boundingBox.getCenter(new Vector3());
        if (target) {
            this._targetPosition = target.clone();
            this._targetPositionIsPanned = false;
        }
        else if (!this._targetPositionIsPanned) {
            this._targetPosition = new Vector3(position.x, position.y, position.z);
        }
        const currentCameraParameter = this.getCurrentCameraParameters();
        const size = boundingBox.getSize(new Vector3());
        if (changeCamera) {
            const idealDistance = this._setDistanceAndRangesBasedOnBounds(size);
            this._distance = idealDistance;
            this._checkZoomDistance(boundingBox, idealDistance);
            if (!this._userInteraction) {
                this._update();
            }
            else {
                this._tweenCameraParameter(currentCameraParameter, {
                    yaw: this._yaw,
                    pitch: this._pitch,
                    distance: this._distance,
                    targetX: this._targetPosition.x,
                    targetY: this._targetPosition.y,
                    targetZ: this._targetPosition.z,
                }, isPreview);
            }
        }
        else {
            this._setDistanceAndRangesBasedOnBounds(size, false);
        }
        this._update();
    }
    _checkZoomDistance(boundingBox, idealDistance) {
        const boundingSphere = boundingBox.getBoundingSphere(new Sphere());
        if (idealDistance - boundingSphere.radius < this._zoomDistance) {
            console.warn('the initial camera position is closer than the zoomDistance param, zoomDistance is set to initial camera position.');
            this._zoomDistance = idealDistance - boundingSphere.radius;
        }
    }
    _setDistanceAndRangesBasedOnBounds(bounds, updateDistance = true) {
        const { offsetWidth, offsetHeight } = this._getOffset();
        this._bounds.copy(bounds);
        const { cameraSpacing } = this._initData;
        bounds.addScalar(cameraSpacing / 100);
        this.minDistance = Math.sqrt(bounds.x * bounds.x + bounds.y * bounds.y + bounds.z * bounds.z);
        const maxBounds = Math.max(bounds.x, bounds.y);
        const { x, y } = this._getMargin(offsetWidth, offsetHeight);
        const idealDistance = getIdealDistance(bounds.x + x, bounds.y + y, bounds.z, this._camera.fov, offsetWidth, offsetHeight);
        if (this._distance < idealDistance && updateDistance) {
            this._distance = idealDistance;
        }
        this.maxDistance = idealDistance + maxBounds;
        if (this.maxDistance < MAX_DISTANCE_MINIMAL) {
            this.maxDistance = MAX_DISTANCE_MINIMAL;
        }
        this._camera.far = this.maxDistance * 5;
        this._setCameraNear();
        return idealDistance;
    }
    _getIdealDistance() {
        const { offsetWidth, offsetHeight } = this._getOffset();
        const { x, y } = this._getMargin(offsetWidth, offsetHeight);
        return getIdealDistance(this._bounds.x + x, this._bounds.y + y, this._bounds.z, this._camera.fov, offsetWidth, offsetHeight);
    }
    _getOffset() {
        const dimensions = this._domHelper.getClientDimensions();
        const windowWidth = dimensions.x;
        const windowHeight = dimensions.y;
        const offsetWidth = this._camera.offset
            ? windowWidth -
                windowWidth * this._camera.offset.left -
                windowWidth * (1 - this._camera.offset.right)
            : windowWidth;
        const offsetHeight = this._camera.offset
            ? windowHeight -
                windowHeight * this._camera.offset.bottom -
                windowHeight * (1 - this._camera.offset.top)
            : windowHeight;
        return { offsetWidth, offsetHeight };
    }
    _getMargin(width, height) {
        // always add margin of 1/2 of object size
        let x = this._bounds.x / 2;
        let y = this._bounds.y / 2;
        // change behaviour with size of 1080 which is default for modern smartphones
        const breakingPoint = 1080;
        if (width > breakingPoint) {
            // workaround for very small items on large screens
            x += this._bounds.x < 0.3 ? 0.2 : 0;
            x += this._bounds.x * (width / breakingPoint - 1);
        }
        if (height > breakingPoint) {
            // workaround for very small items on large screens
            x += this._bounds.y < 0.3 ? 0.2 : 0;
            y += this._bounds.y * (height / breakingPoint - 1);
        }
        return { x, y };
    }
    reset(bounds, target, yaw, pitch, animate = true) {
        const size = bounds.getSize(new Vector3());
        if (size) {
            if (!target) {
                const center = bounds.getCenter(new Vector3());
                this._targetPosition.copy(center);
            }
            else {
                this._targetPosition.copy(target);
            }
            const currentCameraParameters = this.getCurrentCameraParameters();
            if (!yaw) {
                yaw = INITIAL_YAW;
            }
            if (!pitch) {
                pitch = INITIAL_PITCH;
            }
            yaw += toDegrees(this._objectRotation);
            if (this._initData.debug) {
                this._distance = this._setDistanceAndRangesBasedOnBounds(size);
                this._update(this._targetPosition);
                this._setDistanceAndRangesBasedOnBounds(size);
                return;
            }
            const idealDistance = this._setDistanceAndRangesBasedOnBounds(size);
            const newPitch = toRadiant(pitch);
            const newYaw = toRadiant(yaw);
            let targetClone = this._targetPosition.clone();
            if (animate) {
                this._tweenCameraParameter(currentCameraParameters, {
                    yaw: newYaw,
                    pitch: newPitch,
                    distance: idealDistance,
                    targetX: targetClone.x,
                    targetY: targetClone.y,
                    targetZ: targetClone.z,
                }, true);
            }
            else {
                this._pitch = newPitch;
                this._yaw = newYaw;
                this._distance = idealDistance;
                this._update(this._targetPosition);
            }
        }
        else {
            console.warn('you cant reset without bounds!');
        }
    }
    updateAndReset(bounds, target, yaw, pitch, spacing, animate = true) {
        const minVector = new Vector3(-bounds.x / 2, 0, -bounds.z / 2);
        const maxVector = new Vector3(bounds.x / 2, bounds.y, bounds.z / 2);
        this._boundingBox = new Box3(minVector, maxVector);
        if (spacing) {
            bounds.addScalar(spacing);
        }
        if (target) {
            this._targetPosition.copy(target);
        }
        else {
            this._targetPosition = new Vector3(0, bounds.y / 2, 0);
            this._targetPositionIsPanned = false;
        }
        if (this._distance === INITIAL_CAMERA_DISTANCE) {
            const idealDistance = this._setDistanceAndRangesBasedOnBounds(bounds);
            this._distance = Math.max(MAX_DISTANCE_MINIMAL, idealDistance);
        }
        const currentCameraParameters = this.getCurrentCameraParameters();
        if (!yaw) {
            yaw = INITIAL_YAW;
        }
        if (!pitch) {
            pitch = INITIAL_PITCH;
        }
        yaw += toDegrees(this._objectRotation);
        this._pitch = toRadiant(pitch);
        this._yaw = toRadiant(yaw);
        this._setDistanceAndRangesBasedOnBounds(bounds);
        let targetClone = this._targetPosition.clone();
        if (animate) {
            this._tweenCameraParameter(currentCameraParameters, {
                yaw: this._yaw,
                pitch: this._pitch,
                distance: this.maxDistance,
                targetX: targetClone.x,
                targetY: targetClone.y,
                targetZ: targetClone.z,
            }, true);
        }
        else {
            this._update(this._targetPosition);
        }
    }
    //override
    _update(overrideTarget, ignoreChecks) {
        if (!this._initData.debug) {
            this._yaw = Math.max(this.minAzimuthAngle, Math.min(this.maxAzimuthAngle, this._yaw));
            this._pitch = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this._pitch));
        }
        else {
            this._pitch = Math.max(toRadiant(-89), Math.min(toRadiant(89), this._pitch));
        }
        this._saveYawAndPitch();
        const euler = new Euler(-this._pitch, this._yaw, 0, 'ZYX');
        const quaternion = new Quaternion().setFromEuler(euler);
        //camera forward
        const direction = new Vector3(0, 0, -1);
        direction.applyQuaternion(quaternion);
        this._distance *= this._scale;
        if (!this._initData.debug) {
            this._distance = Math.min(this.maxDistance, this._distance);
        }
        if (overrideTarget) {
            this._targetPosition.copy(overrideTarget);
        }
        const position = this._targetPosition
            .clone()
            .sub(direction.multiplyScalar(this._distance));
        if (this._initData.debug) {
            this._cameraPosition.copy(position);
            this._zoomChanged(false, false);
        }
        else if (ignoreChecks) {
            this._cameraPosition.copy(position);
        }
        else {
            const cameraSphere = this._getCameraSphere(position);
            if (this._boundingBox != null &&
                this._boundingBox.intersectsSphere(cameraSphere) &&
                this._scale >= 1) {
                //increase distance by sphere radius until it no longer collides
                this._distance += 0.1;
            }
            else if (this._boundingBox != null &&
                !this._boundingBox.intersectsSphere(cameraSphere)) {
                //just set the new camera position, actual position of camera is calculated in scene helper
                this._cameraPosition.copy(position);
                //no min no max
                if (this._distance === this.maxDistance) {
                    //minZoom = true
                    this._zoomChanged(true, false);
                }
                else {
                    this._zoomChanged(false, false);
                }
            }
            else {
                //maxZoom = true
                this._zoomChanged(false, true);
            }
        }
        this._scale = 1;
    }
    _zoomChanged(minZoom, maxZoom) {
        let hash = minZoom + '' + maxZoom;
        if (this._currentZoomHash.length === 0 || this._currentZoomHash !== hash) {
            this.dispatchEvent(5 /* CAMERA_EVENT.ZOOM_CHANGE */, new ZoomChangeEvent(minZoom, maxZoom));
            this._currentZoomHash = hash;
        }
        else if (!minZoom && !maxZoom) {
            this.dispatchEvent(5 /* CAMERA_EVENT.ZOOM_CHANGE */, new ZoomChangeEvent(minZoom, maxZoom));
        }
        this._maxZoomedIn = maxZoom;
        this._maxZoomedOut = minZoom;
    }
    zoomTo(cameraParameters) {
        return this._tweenCameraParameter(this.getCurrentCameraParameters(), cameraParameters, true);
    }
    _getCameraSphere(position) {
        const maxBounds = Math.max(this._bounds.x, this._bounds.y);
        // set max zoom distance based on object size (factor 10)
        const radius = Math.max(maxBounds / 10, this._zoomDistance);
        return new Sphere(position, radius);
    }
    zoomIn(value) {
        this._lerpEnabled = true;
        this._scale *= value ? Math.pow(0.95, value) : this._zoomSpeed;
        this._setCameraNear();
        this._update();
        this.dispatchEvent(3 /* CAMERA_EVENT.ZOOM_IN */);
    }
    zoomOut(value) {
        this._lerpEnabled = true;
        this._scale /= value ? Math.pow(0.95, value) : this._zoomSpeed;
        this._setCameraNear();
        this._update();
        this.dispatchEvent(4 /* CAMERA_EVENT.ZOOM_OUT */);
    }
    clear() {
        this._userInteraction = false;
        if (!this._initData.debug) {
            this._distance = INITIAL_CAMERA_DISTANCE;
            this._targetPosition = new Vector3(0, 0, 0);
            this._targetPositionIsPanned = false;
        }
    }
    /**
     * Move camera based on provided camera parameters
     * - Uses center when target is not set
     * - Uses ideal distance when no distance is provided
     * - For other properties it used current camera parameters if not provided
     * @param cameraParameter
     */
    async moveCamera(cameraParameter) {
        const { x, y, z } = this._boundingBox.getCenter(new Vector3());
        cameraParameter.targetX = cameraParameter.targetX || x;
        cameraParameter.targetY = cameraParameter.targetY || y;
        cameraParameter.targetZ = cameraParameter.targetZ || z;
        cameraParameter.distance =
            cameraParameter.distance || this._getIdealDistance();
        const currentCameraParams = this.getCurrentCameraParameters();
        const newCameraParams = deepMerge(JSON.parse(JSON.stringify(currentCameraParams)), cameraParameter);
        return this._tweenCameraParameter(currentCameraParams, newCameraParams, true);
    }
    enablePanning() {
        this._lerpEnabled = false;
        this._panningEnabled = true;
    }
    disablePanning() {
        this._lerpEnabled = false;
        this._panningEnabled = false;
    }
    getKernelZoomFactor() {
        const minDistance = 2;
        const maxDistance = this.maxDistance;
        // get percentage of how far we are zoomed in 1 is max zoomed in
        const percent = 1 - this._distance / (maxDistance - minDistance);
        // transform to a scale of max zoom 1.2 and min zoom 0.2
        const zoomFactor = percent + 0.2;
        return zoomFactor;
    }
}

class Environment {
    constructor(scene, oldEnvironment) {
        this._scene = scene;
        if (oldEnvironment) {
            oldEnvironment.removeFromScene();
            oldEnvironment.cleanUp();
        }
    }
    updateCamera(_camera) {
        // Keep TSLint quite
    }
    reload() {
        this.removeFromScene();
        this.addToScene();
    }
    updateBounds(bounds, _force) {
        this._bounds = bounds;
    }
    cleanUp() {
        this._scene = null;
    }
}

class BakedShadowPlane {
    constructor(size) {
        this._innerSize = 1;
        this._outerSize = 100;
        this._plane = new Object3D();
        this._plane.rotation.x = -Math.PI / 2;
        const material = MaterialCreator.createMeshStandardMaterial({});
        this._innerPlaneMesh = new Mesh();
        this._innerPlaneMesh.layers.set(2 /* LAYER.BACKGROUND */);
        this._innerPlaneMesh.material = material;
        this._innerPlaneMesh.receiveShadow = true;
        this._outerPlaneMesh = new Mesh();
        this._outerPlaneMesh.layers.set(2 /* LAYER.BACKGROUND */);
        this._outerPlaneMesh.material = material;
        this._outerPlaneMesh.receiveShadow = true;
        this._plane.add(this._innerPlaneMesh);
        this._plane.add(this._outerPlaneMesh);
        this._innerSize = 1;
        this._outerSize = size;
        this._updatePlane(this._innerSize, this._outerSize);
    }
    getRootNode() {
        return this._plane;
    }
    getInnerPlane() {
        return this._innerPlaneMesh;
    }
    getOuterPlane() {
        return this._outerPlaneMesh;
    }
    updateSize(innerSize) {
        this._innerSize = innerSize;
        this._updatePlane(this._innerSize, this._outerSize);
    }
    _updatePlane(innerSize, outerSize) {
        const squareShape1 = new Shape();
        squareShape1.moveTo(-innerSize / 2, -innerSize / 2);
        squareShape1.lineTo(-innerSize / 2, innerSize / 2);
        squareShape1.lineTo(innerSize / 2, innerSize / 2);
        squareShape1.lineTo(innerSize / 2, -innerSize / 2);
        squareShape1.lineTo(-innerSize / 2, -innerSize / 2);
        const squareShape2 = new Shape();
        squareShape2.moveTo(-outerSize / 2, -outerSize / 2);
        squareShape2.lineTo(-outerSize / 2, outerSize / 2);
        squareShape2.lineTo(outerSize / 2, outerSize / 2);
        squareShape2.lineTo(outerSize / 2, -outerSize / 2);
        squareShape2.lineTo(-outerSize / 2, -outerSize / 2);
        const holePath = new Path();
        holePath.moveTo(-innerSize / 2, -innerSize / 2);
        holePath.lineTo(-innerSize / 2, innerSize / 2);
        holePath.lineTo(innerSize / 2, innerSize / 2);
        holePath.lineTo(innerSize / 2, -innerSize / 2);
        holePath.lineTo(-innerSize / 2, -innerSize / 2);
        squareShape2.holes.push(holePath);
        const geometry1 = new ShapeGeometry(squareShape1);
        if (this._innerPlaneMesh.geometry) {
            this._innerPlaneMesh.geometry.dispose();
        }
        this._innerPlaneMesh.geometry = geometry1;
        const geometry2 = new ShapeGeometry(squareShape2);
        if (this._outerPlaneMesh.geometry) {
            this._outerPlaneMesh.geometry.dispose();
        }
        this._outerPlaneMesh.geometry = geometry2;
        const uvs = geometry1.attributes.uv.clone();
        geometry1.setAttribute('uv2', uvs);
        const uvs2 = geometry1.attributes.uv2.array;
        for (let i = 0; i < uvs2.length; ++i) {
            uvs2[i] += 0.5;
        }
    }
}

const INITIAL_FLOOR_SIZE = 100;
const FOG_COLOR = 0xf6f6f6;
class FloorEnvironment extends Environment {
    constructor(scene, oldEnvironment, fog) {
        super(scene, oldEnvironment);
        this._longestSide = 2;
        this._bakedShadowPlane = new BakedShadowPlane(INITIAL_FLOOR_SIZE);
        this._fog = fog ? fog : false;
        this._textureLoader = new TextureLoader();
        this.addToScene();
    }
    needsBounds() {
        return true;
    }
    needsCamera() {
        return this._fog;
    }
    needsRotation() {
        return false;
    }
    updateBounds(bounds) {
        super.updateBounds(bounds);
        this._longestSide = Math.max(bounds.x, bounds.z);
        this._update();
        return true;
    }
    updateCamera(camera) {
        this._cameraDistance = camera.position.distanceTo(new Vector3(0, 0, 0));
        this._update();
    }
    _update() {
        if (this._fog) {
            this._updateFog();
        }
    }
    _updateFog() {
        let distance = this._longestSide / 2;
        let distanceToObject = 3;
        this._scene.fog = new Fog(FOG_COLOR, this._cameraDistance + distance + distanceToObject, this._cameraDistance + distance + distanceToObject + 1);
        this._scene.background = new Color(FOG_COLOR);
    }
    _updateFloor() {
        if (this._floorMaterial) {
            this._bakedShadowPlane.getOuterPlane().material = this._floorMaterial;
            this._bakedShadowPlane.getInnerPlane().material = this._floorMaterial;
        }
        else {
            let textureWidth = this._width / 1000;
            let textureHeight = this._height / 1000;
            if (this._repeatable) {
                this._floorTexture.wrapS = RepeatWrapping;
                this._floorTexture.wrapT = RepeatWrapping;
                this._floorTexture.repeat.set(INITIAL_FLOOR_SIZE / textureWidth, INITIAL_FLOOR_SIZE / textureHeight);
            }
            let material = MaterialCreator.createMeshStandardMaterial({
                map: this._floorTexture,
                side: DoubleSide,
            });
            this._bakedShadowPlane.getInnerPlane().material = material;
            this._bakedShadowPlane.getOuterPlane().material = material;
        }
    }
    addToScene() {
        if (!this._scene) {
            return;
        }
        this._scene.add(this._bakedShadowPlane.getRootNode());
    }
    removeFromScene() {
        this._scene.remove(this._bakedShadowPlane.getRootNode());
    }
    setFloorMaterial(url, width, height, repeatable) {
        this._width = width;
        this._height = height;
        this._repeatable = repeatable;
        this._floorPromise = new Promise((resolve, reject) => {
            this._textureLoader.load(url, (texture) => {
                this._floorTexture = texture;
                resolve();
            }, 
            /* no onProgress callback needed */ null, reject);
        });
        return new Promise((resolve, reject) => {
            this._floorPromise.then(() => {
                this._updateFloor();
                this._update();
                resolve();
            }, reject);
        });
    }
    changeFloorMaterial(rapiMaterial, maxAnisotropy) {
        this._floorPromise = new Promise((resolve, reject) => {
            this._floorMaterial = createMaterial(rapiMaterial);
            this._rapiAccess
                .getTexturesOf(rapiMaterial)
                .then((rapiTextures) => {
                if (rapiTextures.length > 0) {
                    let texturePromises = [];
                    rapiTextures.forEach((rapiTexture) => {
                        texturePromises.push(addTexture(this._dataSyncer.requestAsset(rapiTexture.image, true /* use rapiTexture.image as fallback */), rapiTexture, this._floorMaterial, maxAnisotropy, 1, 1));
                    });
                    Promise.all(texturePromises).then(() => {
                        setTimeout(() => resolve(), 0);
                    }, reject);
                }
                else {
                    setTimeout(() => resolve(), 0);
                }
            });
        });
        let promises = [this._floorPromise];
        return new Promise((resolve, reject) => {
            Promise.all(promises).then(() => {
                this._updateFloor();
                this._update();
                resolve();
            }, reject);
        });
    }
    showGUI() {
        if (!this._floorMaterial) {
            if (this._floorPromise) {
                this._floorPromise.then(() => this._addGUI());
            }
        }
        else {
            this._addGUI();
        }
    }
    _addGUI() {
        let gui = getGUI();
        if (!gui) {
            return;
        }
        let floor = gui.addFolder('Floor');
        floor.add(this._floorMaterial, 'roughness').min(0).max(1).step(0.01);
        floor
            .add(this._floorMaterial, 'reflectivity')
            .min(0)
            .max(1)
            .step(0.01);
        floor.add(this._floorMaterial, 'clearCoat').min(0).max(1).step(0.01);
        floor
            .add(this._floorMaterial, 'clearCoatRoughness')
            .min(0)
            .max(1)
            .step(0.01);
        floor.add(this._floorMaterial, 'opacity').min(0).max(1).step(0.01);
        floor.add(this._floorMaterial, 'metalness').min(0).max(1).step(0.01);
        floor.add(this._floorMaterial, 'bumpScale').min(0).max(1).step(0.01);
    }
}
__decorate([
    inject
], FloorEnvironment.prototype, "_rapiAccess", void 0);
__decorate([
    inject
], FloorEnvironment.prototype, "_dataSyncer", void 0);

const ZOOM_SPEED = 2;
const MAX_ZOOM = 5;
const MIN_ZOOM = 0.1;
const TOUCH_PANNING_SPEED = 1.1;
class CameraControl2D extends CameraControl {
    constructor(creator, inputManager, initialCameraPosition, camera) {
        super(creator, inputManager, initialCameraPosition);
        this._scale = 1;
        this._cameraZoom = 1;
        this._state = 0 /* STATE.NONE */;
        this._size = 5;
        this._lastPosition = new Vector2();
        this._zoomPosition = new Vector3();
        this._lastZoom = 0;
        this._zoomSpeed = Math.pow(0.95, ZOOM_SPEED);
        if (!camera) {
            this._initCamera(initialCameraPosition ? initialCameraPosition : new Vector3(0, 10, 0));
        }
        else {
            this._camera = camera;
            this._cameraPosition = new Vector3().copy(this._camera.position);
        }
    }
    _getCamera() {
        if (this._camera) {
            return this._camera;
        }
        this._initCamera(new Vector3(0, 10, 0));
        return this._camera;
    }
    _initCamera(initialCameraPosition) {
        let { x, y } = this._domHelper.getClientDimensions();
        let aspectRatio = x / y;
        let frustumWidth = aspectRatio * this._size;
        let frustumHeight = this._size;
        this._camera = new OrthographicCamera(frustumWidth / -2, frustumWidth / 2, frustumHeight / 2, frustumHeight / -2, 1, 1000);
        this._camera.position.copy(initialCameraPosition);
        this._cameraPosition = initialCameraPosition;
        this._camera.lookAt(new Vector3(0, 0, 0));
    }
    updateCamera() {
        let { x, y } = this._domHelper.getClientDimensions();
        let aspectRatio = x / y;
        let frustumWidth = aspectRatio * this._size;
        let frustumHeight = this._size;
        this._camera.left = frustumWidth / -2;
        this._camera.right = frustumWidth / 2;
        this._camera.top = frustumHeight / 2;
        this._camera.bottom = frustumHeight / -2;
        this._camera.updateProjectionMatrix();
    }
    _initInputListener() {
        this._inputListeners.push({
            key: 3 /* INPUT_EVENT.DOWN */,
            fun: (event) => {
                if (this._locked) {
                    return;
                }
                this._state = 1 /* STATE.MOVE */;
                this._lastPosition.set(event.positionRelative.x, event.positionRelative.y);
                this.dispatchEvent(0 /* CAMERA_EVENT.ORBIT_START */);
            },
        });
        this._inputListeners.push({
            key: 6 /* INPUT_EVENT.MOVE */,
            fun: (event) => {
                if (this._state === 1 /* STATE.MOVE */ && !this._locked) {
                    this._move(new Vector2(event.positionRelative.x, event.positionRelative.y), event.type);
                    this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */);
                }
            },
        });
        this._inputListeners.push({
            key: 4 /* INPUT_EVENT.UP */,
            fun: (_event) => {
                if (this._state === 1 /* STATE.MOVE */) {
                    this.dispatchEvent(2 /* CAMERA_EVENT.ORBIT_END */);
                }
                this._state = 0 /* STATE.NONE */;
            },
        });
        this._inputListeners.push({
            key: 7 /* INPUT_EVENT.ZOOM_IN */,
            fun: (event) => {
                if (event.event) {
                    event.event.stopPropagation();
                    event.event.preventDefault();
                }
                this.dispatchEvent(3 /* CAMERA_EVENT.ZOOM_IN */);
                this._scale /= this._zoomSpeed;
                this._zoomTo(event.positionRelative);
                this._update();
            },
        });
        this._inputListeners.push({
            key: 8 /* INPUT_EVENT.ZOOM_OUT */,
            fun: (event) => {
                if (event.event) {
                    event.event.stopPropagation();
                    event.event.preventDefault();
                }
                this.dispatchEvent(4 /* CAMERA_EVENT.ZOOM_OUT */);
                this._scale *= this._zoomSpeed;
                this._zoomTo(event.positionRelative);
                this._update();
            },
        });
    }
    _zoomTo(position) {
        if (Date.now() - this._lastZoom > 200) {
            let zoomPos = new Vector3(position.x, position.y, 0);
            zoomPos.unproject(this._camera);
            this._zoomPosition.copy(zoomPos);
        }
        this._lastZoom = Date.now();
    }
    _move(position, type) {
        // event.positionRelative is a coordinate in normalized device space [-1.0, 1.0]
        // unproject(this._camera) uses the OrthographicCamera to convert form normalized device space to world space
        let delta = new Vector3();
        let prevPos = new Vector3(this._lastPosition.x, this._lastPosition.y, 0);
        let newPos = new Vector3(position.x, position.y, 0);
        prevPos.unproject(this._camera);
        newPos.unproject(this._camera);
        delta.subVectors(newPos, prevPos);
        this._cameraPosition.x -=
            delta.x * (type === 2 /* INPUT_EVENT_TYPE.TOUCH */ ? TOUCH_PANNING_SPEED : 1);
        this._cameraPosition.z -=
            delta.z * (type === 2 /* INPUT_EVENT_TYPE.TOUCH */ ? TOUCH_PANNING_SPEED : 1);
        this._lastPosition.copy(position);
    }
    zoomToFitBounds(bounds, zoomInAllowed, force) {
        if (compareBox3Size(bounds, this._boundingBox) < 0 && !force) {
            this.setBounds(bounds);
            return;
        }
        this.setBounds(bounds);
        const size = bounds.getSize(new Vector3());
        const center = bounds.getCenter(new Vector3());
        const widthRatio = size.x / -2 / this._camera.left;
        const heightRatio = size.z / -2 / this._camera.bottom;
        const ratio = Math.max(widthRatio, heightRatio);
        const newZoom = 1 / ratio;
        // only update camera when camera is not already zoomed out
        if (newZoom < this._cameraZoom || zoomInAllowed) {
            this._scale = newZoom;
            this._cameraZoom = newZoom;
            this._cameraPosition.x = center.x;
            this._cameraPosition.z = center.z;
        }
    }
    //override
    _update(_overrideTarget) {
        this._scale = Math.min(this._scale, MAX_ZOOM);
        this._scale = Math.max(this._scale, MIN_ZOOM);
        // When zooming in on a point or zooming out on a point, the camera position must be moved
        // along the line defined by the camera position and the zoom position
        // The distance the camera position needs to be moved depends
        // on the distance between these points and the relative scale:
        // d = (ZP - CP) * (new_zoom - old_zoom) / new_zoom
        let deltaPosition = new Vector3()
            .subVectors(this._zoomPosition, this._cameraPosition)
            .multiplyScalar((this._scale - this._cameraZoom) / this._scale);
        this._cameraPosition.x += deltaPosition.x;
        this._cameraPosition.z += deltaPosition.z;
        if (this._cameraZoom !== this._scale) {
            this.dispatchEvent(5 /* CAMERA_EVENT.ZOOM_CHANGE */, new ZoomChangeEvent(this._scale === MIN_ZOOM, this._scale === MAX_ZOOM));
        }
        this._cameraZoom = this._scale;
        this._camera.updateProjectionMatrix();
    }
    animateCamera(delta) {
        if (!super.animateCamera(delta) &&
            Math.abs(this._cameraZoom - this._camera.zoom) <= 0.01) {
            return false;
        }
        const lerpFactor = Math.min(delta * 10, 1);
        this._camera.zoom = MathUtils.lerp(this._camera.zoom, this._cameraZoom, lerpFactor);
        return true;
    }
    getKernelZoomFactor() {
        const sceneSizeMM = (this._camera.right - this._camera.left) * 1000;
        const zoomFactor = (this._domHelper.element.clientWidth / sceneSizeMM) * this._camera.zoom;
        return zoomFactor;
    }
}

const KEYBOARD_ROTATION_ANGLE = Math.PI / 4;
const KEYBOARD_MOVING_DISTANCE = 1;
const ROTATION_SPEED = 1;
const ROTATION_SPEED_TOUCH = 0.6;
const RUN_SPEED = 1;
const CONTROLLER_AXIS_THRESHHOLD = 0.2;
const MIN_POLAR_ANGLE = -60;
const MAX_POLAR_ANGLE = 60;
class CameraControlFirstPerson extends CameraControl {
    constructor(creator, inputManager, initialCameraPosition, camera) {
        super(creator, inputManager, initialCameraPosition);
        this._state = 0 /* STATE.NONE */;
        this._rotationSpeed = ROTATION_SPEED;
        this._keyMap = new Map();
        this.minPolarAngle = toRadiant(MIN_POLAR_ANGLE);
        this.maxPolarAngle = toRadiant(MAX_POLAR_ANGLE);
        if (camera) {
            this._camera = camera;
        }
        else {
            this._camera = new PerspectiveCamera();
        }
        this._camera.fov = 70;
        this._camera.aspect = this._width / this._height;
        this._camera.near = 0.1;
        this._camera.far = 100;
        this._camera.updateProjectionMatrix();
        this._camera.layers.set(3 /* LAYER.OBJECT */);
        this._camera.layers.enable(1 /* LAYER.LIGHTING */);
        this._camera.layers.enable(2 /* LAYER.BACKGROUND */);
        this._camera.layers.enable(6 /* LAYER.UI */);
        this._camera.layers.enable(5 /* LAYER.PREVIEW */);
        if (!initialCameraPosition) {
            this._camera.position.set(0, 1.5, 0);
        }
        else {
            this._camera.position.set(initialCameraPosition.x, 1.5, initialCameraPosition.z);
        }
        this._cameraPosition = new Vector3();
        this._cameraPosition.copy(this._camera.position);
        this._cameraRotation = new Quaternion();
        this._pitch = 0;
        this._yaw = 0;
        let euler = new Euler(-this._pitch, this._yaw, 0, 'ZYX');
        this._cameraRotation.setFromEuler(euler);
        window.addEventListener('gamepadconnected', this._gamepadConnected.bind(this));
        window.addEventListener('gamepaddisconnected', this._gamepadDisconnected.bind(this));
    }
    _gamepadConnected(_e) {
        console.log('gamepad connected');
        this.startButtonPressListener();
    }
    _gamepadDisconnected(_e) {
        console.log('gamepad disconnected');
        window.cancelAnimationFrame(this._listenerLoopAnimationFrame);
    }
    startButtonPressListener() {
        this._listenerLoopAnimationFrame = window.requestAnimationFrame(() => {
            this.buttonPressListener();
        });
    }
    buttonPressListener() {
        let gamepad = navigator.getGamepads()[0];
        this._checkRightStick(gamepad);
        this._checkLeftStick(gamepad);
        this._checkButtons(gamepad);
        this._processKeyMap(this._keyMap, 0.001);
        this.startButtonPressListener();
    }
    _checkRightStick(gamepad) {
        let rightStickHorizontal = gamepad.axes[2]; //right 1, left -1
        let rightStickVertical = gamepad.axes[3]; //up -1, down 1
        if (Math.abs(rightStickHorizontal) > CONTROLLER_AXIS_THRESHHOLD) {
            this._rotateHorizontal(KEYBOARD_ROTATION_ANGLE * 0.01 * rightStickHorizontal);
            this._update();
            this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */);
        }
        if (Math.abs(rightStickVertical) > CONTROLLER_AXIS_THRESHHOLD) {
            this._rotateVertical(KEYBOARD_ROTATION_ANGLE * 0.01 * rightStickVertical);
            this._update();
            this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */);
        }
    }
    _checkLeftStick(gamepad) {
        let leftStickHorizontal = gamepad.axes[0]; //left -1, right 1
        let leftStickVertical = gamepad.axes[1]; //up -1, down 1
        if (Math.abs(leftStickVertical) > CONTROLLER_AXIS_THRESHHOLD) {
            if (leftStickVertical < 0) {
                this._keyMap.set(87, true); //move forward
            }
            else {
                this._keyMap.set(83, true); //move backward
            }
        }
        else if (gamepad.buttons &&
            gamepad.buttons[12] &&
            gamepad.buttons[12].pressed) {
            //move forward
            this._keyMap.set(87, true);
        }
        else if (gamepad.buttons &&
            gamepad.buttons[13] &&
            gamepad.buttons[13].pressed) {
            //move backward
            this._keyMap.set(83, true);
        }
        else {
            this._keyMap.set(87, false);
            this._keyMap.set(83, false);
        }
        if (Math.abs(leftStickHorizontal) > CONTROLLER_AXIS_THRESHHOLD) {
            if (leftStickHorizontal < 0) {
                this._keyMap.set(65, true);
            }
            else {
                this._keyMap.set(68, true);
            }
        }
        else {
            this._keyMap.set(65, false);
            this._keyMap.set(68, false);
        }
    }
    _checkButtons(gamepad) {
        //buttons 14/left, 15/right, 12/up, 13/down
        if (gamepad.buttons && gamepad.buttons[6] && gamepad.buttons[6].pressed) {
            //xbox controller left trigger
            this._keyMap.set(16, true);
        }
        else {
            this._keyMap.set(16, false);
        }
        if (gamepad.buttons && gamepad.buttons[14] && gamepad.buttons[14].pressed) {
            //turn right
            this._keyMap.set(37, true);
            this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */);
        }
        else {
            this._keyMap.set(37, false);
        }
        if (gamepad.buttons && gamepad.buttons[15] && gamepad.buttons[15].pressed) {
            //turn left
            this._keyMap.set(39, true);
            this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */);
        }
        else {
            this._keyMap.set(39, false);
        }
    }
    animateCamera(delta) {
        let desiredPosition = this._cameraPosition;
        let desiredRotation = this._cameraRotation;
        let camera = this.getCamera();
        let positionsAreEqual = position3VectorsAreEqual(desiredPosition, camera.position);
        let rotationsAreEqual = rotationQuaternionsAreEqual(desiredRotation, camera.quaternion);
        if (!desiredPosition || (positionsAreEqual && rotationsAreEqual)) {
            return false;
        }
        let newCameraPosition = this.getCamera().position.clone();
        let lerpFactor = Math.min(delta * 10, 1);
        newCameraPosition.lerp(desiredPosition, lerpFactor);
        this.getCamera().position.copy(newCameraPosition);
        let newCameraRotation = this.getCamera().quaternion.clone();
        let slerpFactor = Math.min(delta * 5, 1);
        newCameraRotation.slerp(desiredRotation, slerpFactor);
        this.getCamera().setRotationFromQuaternion(newCameraRotation);
        let shouldProcess = false;
        this._keyMap.forEach((value) => {
            if (value) {
                shouldProcess = true;
            }
        });
        if (shouldProcess) {
            this._processKeyMap(this._keyMap, delta);
        }
        return true;
    }
    _getCamera() {
        return this._camera;
    }
    _initInputListener() {
        // keys are used to move character
        window.addEventListener('keyup', this._onKeyChanged.bind(this), false);
        window.addEventListener('keydown', this._onKeyChanged.bind(this), false);
        // MOVE = ORBIT
        this._inputListeners.push({
            key: 3 /* INPUT_EVENT.DOWN */,
            fun: (event) => {
                this._down(event);
            },
        });
        this._inputListeners.push({
            key: 6 /* INPUT_EVENT.MOVE */,
            fun: (event) => {
                this._move(event);
            },
        });
        this._inputListeners.push({
            key: 4 /* INPUT_EVENT.UP */,
            fun: (event) => {
                this._up(event);
            },
        });
    }
    _down(event) {
        this._downPosition = event.position;
        this._position = event.position;
        this._state = 1 /* STATE.ORBIT */;
        if (event.type === 2 /* INPUT_EVENT_TYPE.TOUCH */) {
            window.setTimeout(this._onLongDown.bind(this), 350);
        }
        if (event.type === 2 /* INPUT_EVENT_TYPE.TOUCH */) {
            this._rotationSpeed = ROTATION_SPEED_TOUCH;
        }
        else {
            this._rotationSpeed = ROTATION_SPEED;
        }
    }
    _move(event) {
        this._position = event.position;
        if (this._state === 1 /* STATE.ORBIT */ && !this._locked) {
            this._orbit(new Vector2(event.position.x, event.position.y));
        }
        if (this._state === 2 /* STATE.MOVE */ && !this._locked) {
            this._orbit(new Vector2(event.position.x, event.position.y));
            this._moveForward();
        }
    }
    _up(_event) {
        if (this._state === 1 /* STATE.ORBIT */) {
            this.dispatchEvent(2 /* CAMERA_EVENT.ORBIT_END */);
        }
        if (this._state === 2 /* STATE.MOVE */) {
            this._keyMap.set(87, false);
        }
        this._state = 0 /* STATE.NONE */;
        this._orbitPosition = null;
    }
    _onLongDown() {
        let delta = getDelta(this._downPosition, this._position);
        if (delta < MIN_MOVE_DISTANCE && this._state === 1 /* STATE.ORBIT */) {
            this._state = 2 /* STATE.MOVE */;
            this._orbit(new Vector2(this._position.x, this._position.y));
            this._moveForward();
        }
    }
    _update(_overrideTarget) {
        let euler = new Euler(-this._pitch, this._yaw, 0, 'ZYX');
        //camera forward
        this._cameraRotation.setFromEuler(euler);
    }
    updateCamera() {
        let { x, y } = this._domHelper.getClientDimensions();
        this._camera.aspect = x / y;
        this._camera.updateProjectionMatrix();
    }
    _onKeyChanged(event) {
        this._keyMap.set(event.keyCode, event.type === 'keydown');
        this.dispatchEvent(6 /* CAMERA_EVENT.KEYBOARD_PRESSED */);
        let boundKeybindPressed = this._processKeyMap(this._keyMap, 0.001);
        if (boundKeybindPressed) {
            event.preventDefault();
        }
    }
    _processKeyMap(map, delta) {
        /*
            move forward => w = 87 || up = 38
            move backward => s = 83 || down = 40
            move left => a = 65
            move right => d = 68
            turn left => left = 37
            turn right => right = 39
            sprint => shift = 16
             */
        delta = Math.min(delta, 0.1);
        let direction = new Vector3(0, 0, 0);
        let shouldRotate = false;
        this._processUpDown(map, direction, delta);
        if (map.get(65)) {
            direction.x = -KEYBOARD_MOVING_DISTANCE * RUN_SPEED * delta;
        }
        if (map.get(68)) {
            direction.x = KEYBOARD_MOVING_DISTANCE * RUN_SPEED * delta;
        }
        if (map.get(37)) {
            this._rotateHorizontal(-KEYBOARD_ROTATION_ANGLE * this._rotationSpeed * delta);
            shouldRotate = true;
        }
        if (map.get(39)) {
            this._rotateHorizontal(KEYBOARD_ROTATION_ANGLE * this._rotationSpeed * delta);
            shouldRotate = true;
        }
        if (map.get(16)) {
            direction.x *= 3;
            direction.z *= 3;
        }
        if (direction.x !== 0 ||
            direction.y !== 0 ||
            direction.z !== 0 ||
            shouldRotate) {
            direction.applyQuaternion(this.getCamera().quaternion);
            this._cameraPosition.add(new Vector3(direction.x, 0, direction.z));
            this._update();
            return true;
        }
        else {
            return false;
        }
    }
    _processUpDown(map, direction, delta) {
        /*
            move forward => w = 87 || up = 38
            move backward => s = 83 || down = 40
             */
        if (map.get(87) || map.get(38)) {
            //camera forward
            direction.z = -KEYBOARD_MOVING_DISTANCE * RUN_SPEED * delta;
        }
        if (map.get(83) || map.get(40)) {
            //camera backward
            direction.z = KEYBOARD_MOVING_DISTANCE * RUN_SPEED * delta;
        }
    }
    _orbit(position) {
        if (!this._orbitPosition) {
            this._orbitPosition = new Vector2(position.x, position.y);
            this.dispatchEvent(0 /* CAMERA_EVENT.ORBIT_START */);
        }
        let orbitDelta = position.clone().sub(this._orbitPosition);
        let element = this._domHelper.element instanceof Document
            ? this._domHelper.element.body
            : this._domHelper.element;
        {
            orbitDelta.multiplyScalar(-1);
        }
        this._rotateHorizontal(((2 * Math.PI * orbitDelta.x) / element.clientWidth) * ROTATION_SPEED);
        this._rotateVertical(((2 * Math.PI * orbitDelta.y) / element.clientHeight) * ROTATION_SPEED);
        if (!position2VectorsAreEqual(this._orbitPosition, position)) {
            this.dispatchEvent(1 /* CAMERA_EVENT.ORBIT_MOVE */);
        }
        this._orbitPosition.copy(position);
        this._update();
    }
    _moveForward() {
        this._keyMap.set(87, true);
        this._processKeyMap(this._keyMap, 0.001);
    }
    _rotateVertical(angle) {
        let newPitch = this._pitch + angle;
        if (newPitch > this.maxPolarAngle || newPitch < this.minPolarAngle) {
            return;
        }
        this._pitch = newPitch;
        if (this._pitch < -Math.PI) {
            this._pitch += 2 * Math.PI;
        }
        else if (this._pitch > Math.PI) {
            this._pitch -= 2 * Math.PI;
        }
        this._saveYawAndPitch();
    }
    getKernelZoomFactor() {
        return this._camera.zoom;
    }
}

const BACKGROUND_CLASS_NAME = 'rml-scene-background';
class BackgroundEnvironment extends Environment {
    constructor(scene, oldEnvironment, color, canvas, url) {
        super(scene, oldEnvironment);
        this._color = color;
        this._oldBackground = scene.background;
        if (canvas && url) {
            this._canvas = canvas;
            this._style = document.createElement('style');
            let inlineStyle = 'background-image: url("' + url + '"); background-size: cover;';
            this._style.innerText =
                '.' + BACKGROUND_CLASS_NAME + ' {' + inlineStyle + '}';
            this._canvas.appendChild(this._style);
        }
    }
    needsBounds() {
        return true;
    }
    needsCamera() {
        return false;
    }
    needsRotation() {
        return false;
    }
    addToScene() {
        if (this._scene && this._color) {
            this._scene.background = this._color;
        }
        if (this._canvas && this._canvas.classList) {
            this._scene.background = null;
            this._canvas.classList.add(BACKGROUND_CLASS_NAME);
        }
    }
    removeFromScene() {
        if (this._oldBackground) {
            this._scene.background = this._oldBackground;
        }
        if (this._canvas) {
            this._canvas.classList.remove(BACKGROUND_CLASS_NAME);
        }
    }
    showGUI() {
        // eslint be quite
    }
}

class DynamicEnvironmentSettingLoader {
    parse(scene, canvas, oldEnvironment, json, maxAnisotropy) {
        let jsonObject = JSON.parse(json);
        if (!jsonObject.environment) {
            return null;
        }
        return this.load(scene, canvas, oldEnvironment, jsonObject, maxAnisotropy);
    }
    load(scene, canvas, oldEnvironment, jsonObject, maxAnisotropy) {
        let environmentPromise;
        let environmentObject = jsonObject.environment;
        if (!environmentObject) {
            console.warn('No environment set in scene settings');
            return Promise.resolve(null);
        }
        switch (environmentObject.type) {
            case "color" /* ENVIRONMENT_TYPE.COLOR_ENVIRONMENT */:
                environmentPromise = new Promise((resolve) => resolve(new BackgroundEnvironment(scene, oldEnvironment, new Color(environmentObject.details.color))));
                break;
            case "image" /* ENVIRONMENT_TYPE.IMAGE_ENVIRONMENT */:
                environmentPromise = new Promise((resolve) => resolve(new BackgroundEnvironment(scene, oldEnvironment, null, canvas, environmentObject.details.imageUrl)));
                break;
            case "floor" /* ENVIRONMENT_TYPE.FLOOR_ENVIRONMENT */:
                environmentPromise = new Promise((resolve) => {
                    this._rapiAccess
                        .getMaterial(environmentObject.details.material)
                        .then((material) => {
                        let fog = environmentObject.details.fog === undefined
                            ? true
                            : environmentObject.details.fog;
                        let environment = new FloorEnvironment(scene, oldEnvironment, fog);
                        environment
                            .changeFloorMaterial(material, maxAnisotropy)
                            .then(() => {
                            resolve(environment);
                        });
                    });
                });
                break;
            default:
                console.warn('Could not load environment, return old environment');
                environmentPromise = new Promise((resolve) => resolve(oldEnvironment));
                break;
        }
        return environmentPromise;
    }
}
__decorate([
    inject
], DynamicEnvironmentSettingLoader.prototype, "_rapiAccess", void 0);

class LightSetting {
    constructor(scene, oldLightSetting) {
        this._scene = scene;
        if (oldLightSetting) {
            oldLightSetting.removeFromScene();
        }
    }
    needsBounds() {
        return false;
    }
    updateBounds(_bounds) {
        //override when needed
    }
    getCameraContainer() {
        if (!this._cameraContainer) {
            this._cameraContainer = new Object3D();
        }
        return this._cameraContainer;
    }
}

class DynamicLightSetting extends LightSetting {
    constructor(scene, oldLightSetting) {
        super(scene, oldLightSetting);
        this._lights = [];
    }
    needsBounds() {
        return true;
    }
    updateBounds(bounds) {
        if (this._cameraLight) {
            const punctualLight = this._cameraLight;
            const size = new Vector3();
            bounds.getSize(size);
            const maxSize = 1.5 * Math.max(Math.max(size.x, size.y), size.z);
            this._boundingSize = maxSize;
            punctualLight.shadow.camera.top = maxSize / 2;
            punctualLight.shadow.camera.bottom = -maxSize / 2;
            punctualLight.shadow.camera.left = -maxSize / 2;
            punctualLight.shadow.camera.right = maxSize / 2;
            punctualLight.shadow.camera.updateProjectionMatrix();
        }
    }
    loadFromJSON(json) {
        return new Promise((resolve) => {
            this._lights = this._dynamicLightSettingLoader.parse(json);
            this.addToScene();
            resolve();
        });
    }
    loadFromObject(sceneSettings) {
        return new Promise((resolve) => {
            if (!(sceneSettings === null || sceneSettings === void 0 ? void 0 : sceneSettings.lights)) {
                resolve();
            }
            this._lights = this._dynamicLightSettingLoader.load(sceneSettings);
            this._lights.forEach((light, index) => {
                if (light.userData.movesWithCamera) {
                    this._cameraLight = light;
                    this._lights.splice(index, 1);
                }
            });
            this.addToScene();
            resolve();
        });
    }
    loadFromURL(url) {
        return new Promise((resolve, reject) => {
            fetch(new Request(url, { method: 'GET' }))
                .then(handleJsonResponse)
                .then((jsonObject) => this.loadFromObject(jsonObject).then(resolve, reject));
        });
    }
    addToScene() {
        this._lights.forEach((light) => {
            this._scene.add(light);
        });
        if (this._cameraLight) {
            this._scene.add(this._cameraLight);
        }
    }
    update(camera, target) {
        if (!this._cameraLight) {
            return;
        }
        let dir = new Vector3();
        camera.getWorldDirection(dir);
        dir.multiplyScalar(-this._boundingSize);
        let position = target.clone().add(dir);
        this._cameraLight.position.copy(position);
    }
    removeFromScene() {
        this._lights.forEach((light) => {
            this._scene.remove(light);
        });
        if (this._cameraLight) {
            this._scene.remove(this._cameraLight);
        }
    }
    reload() {
        this.removeFromScene();
        this.addToScene();
    }
    showGUI() {
        let gui = getGUI();
        if (this._cameraLight) {
            this._addToGUI(gui, this._cameraLight);
        }
        this._lights.forEach((light) => {
            this._addToGUI(gui, light);
        });
    }
    // eslint-disable-next-line no-undef
    _addToGUI(gui, light) {
        if (!gui) {
            return;
        }
        if (light instanceof SpotLight) {
            this._addSpotLightToGUI(gui, light);
        }
        if (light instanceof AmbientLight) {
            this._addAmbientLightToGUI(gui, light);
        }
        if (light instanceof DirectionalLight) {
            this._addDirectionalLightToGUI(gui, light);
        }
        if (light instanceof RectAreaLight) {
            this._addRectAreaLightToGUI(gui, light);
        }
    }
    // eslint-disable-next-line no-undef
    _addRectAreaLightToGUI(gui, light) {
        let areaLight = gui.addFolder(light.name);
        let guiLightParam = {
            name: light.name,
            color: '#' + light.color.getHexString(),
            intensity: light.intensity * (light.width * light.height),
        };
        areaLight.add(light, 'visible');
        areaLight
            .add(guiLightParam, 'intensity')
            .min(10)
            .max(400)
            .step(10)
            .onChange((intensity) => {
            light.intensity = intensity / (light.width * light.height);
        });
        areaLight.add(light, 'castShadow');
        areaLight.addColor(guiLightParam, 'color').onChange((color) => {
            light.color = new Color(color);
        });
        areaLight
            .add(light.position, 'x')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
        areaLight
            .add(light.position, 'y')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
        areaLight
            .add(light.position, 'z')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
    }
    // eslint-disable-next-line no-undef
    _addSpotLightToGUI(gui, light) {
        let spot = gui.addFolder(light.name);
        let guiLightParam = {
            name: light.name,
            color: '#' + light.color.getHexString(),
            angle: (light.angle * 180) / Math.PI,
        };
        spot.add(light, 'visible');
        spot.add(light, 'intensity').min(0).max(5).step(0.1);
        spot.add(light, 'penumbra').min(0).max(1).step(0.1);
        spot.addColor(guiLightParam, 'color').onChange((color) => {
            light.color = new Color(color);
        });
        spot
            .add(guiLightParam, 'angle')
            .min(10)
            .max(180)
            .step(1)
            .onChange((angle) => {
            light.angle = (angle * Math.PI) / 180;
        });
        spot
            .add(light.position, 'x')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
        spot
            .add(light.position, 'y')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
        spot
            .add(light.position, 'z')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
    }
    // eslint-disable-next-line no-undef
    _addAmbientLightToGUI(gui, light) {
        let guiLightParam = {
            name: light.name,
            color: '#' + light.color.getHexString(),
        };
        let ambiLight = gui.addFolder(light.name);
        ambiLight.add(light, 'visible');
        ambiLight.add(light, 'intensity').min(0).max(5).step(0.1);
        ambiLight.addColor(guiLightParam, 'color').onChange((color) => {
            light.color = new Color(color);
        });
    }
    // eslint-disable-next-line no-undef
    _addDirectionalLightToGUI(gui, light) {
        let directional = gui.addFolder(light.name);
        let guiLightParam = {
            name: light.name,
            color: '#' + light.color.getHexString(),
        };
        directional.add(light, 'visible');
        directional.add(light, 'intensity').min(0).max(5).step(0.1);
        directional.addColor(guiLightParam, 'color').onChange((color) => {
            light.color = new Color(color);
        });
        directional.add(light, 'castShadow');
        directional
            .add(light.position, 'x')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
        directional
            .add(light.position, 'y')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
        directional
            .add(light.position, 'z')
            .min(-10)
            .max(10)
            .step(0.1)
            .onChange(() => {
            light.lookAt(new Vector3(0, 0, 0));
        });
    }
}
__decorate([
    inject
], DynamicLightSetting.prototype, "_dynamicLightSettingLoader", void 0);

/**
 * Ground projected env map adapted from @react-three/drei.
 * https://github.com/pmndrs/drei/blob/master/src/core/Environment.tsx
 */
class GroundProjectedSkybox extends Mesh {

	constructor( texture, options = {} ) {

		const isCubeMap = texture.isCubeTexture;

		const defines = [
			isCubeMap ? '#define ENVMAP_TYPE_CUBE' : ''
		];

		const vertexShader = /* glsl */ `
			varying vec3 vWorldPosition;

			void main() {

				vec4 worldPosition = ( modelMatrix * vec4( position, 1.0 ) );
				vWorldPosition = worldPosition.xyz;

				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

			}
			`;
		const fragmentShader = defines.join( '\n' ) + /* glsl */ `

				varying vec3 vWorldPosition;

				uniform float radius;
				uniform float height;
				uniform float angle;

				#ifdef ENVMAP_TYPE_CUBE

					uniform samplerCube map;

				#else

					uniform sampler2D map;

				#endif

				// From: https://www.shadertoy.com/view/4tsBD7
				float diskIntersectWithBackFaceCulling( vec3 ro, vec3 rd, vec3 c, vec3 n, float r ) 
				{

					float d = dot ( rd, n );

					if( d > 0.0 ) { return 1e6; }

					vec3 o = ro - c;
					float t = - dot( n, o ) / d;
					vec3 q = o + rd * t;

					return ( dot( q, q ) < r * r ) ? t : 1e6;

				}

				// From: https://www.iquilezles.org/www/articles/intersectors/intersectors.htm
				float sphereIntersect( vec3 ro, vec3 rd, vec3 ce, float ra ) {

					vec3 oc = ro - ce;
					float b = dot( oc, rd );
					float c = dot( oc, oc ) - ra * ra;
					float h = b * b - c;

					if( h < 0.0 ) { return -1.0; }

					h = sqrt( h );

					return - b + h;

				}

				vec3 project() {

					vec3 p = normalize( vWorldPosition );
					vec3 camPos = cameraPosition;
					camPos.y -= height;

					float intersection = sphereIntersect( camPos, p, vec3( 0.0 ), radius );
					if( intersection > 0.0 ) {

						vec3 h = vec3( 0.0, - height, 0.0 );
						float intersection2 = diskIntersectWithBackFaceCulling( camPos, p, h, vec3( 0.0, 1.0, 0.0 ), radius );
						p = ( camPos + min( intersection, intersection2 ) * p ) / radius;

					} else {

						p = vec3( 0.0, 1.0, 0.0 );

					}

					return p;

				}

				#include <common>

				void main() {

					vec3 projectedWorldPosition = project();

					#ifdef ENVMAP_TYPE_CUBE

						vec3 outcolor = textureCube( map, projectedWorldPosition ).rgb;

					#else

						vec3 direction = normalize( projectedWorldPosition );
						vec2 uv = equirectUv( direction );
						vec3 outcolor = texture2D( map, uv ).rgb;

					#endif

					gl_FragColor = vec4( outcolor, 1.0 );

					#include <tonemapping_fragment>
					#include <colorspace_fragment>

				}
				`;

		const uniforms = {
			map: { value: texture },
			height: { value: options.height || 15 },
			radius: { value: options.radius || 100 },
		};

		const geometry = new IcosahedronGeometry( 1, 16 );
		const material = new ShaderMaterial( {
			uniforms,
			fragmentShader,
			vertexShader,
			side: DoubleSide,
		} );

		super( geometry, material );

	}

	set radius( radius ) {

		this.material.uniforms.radius.value = radius;

	}

	get radius() {

		return this.material.uniforms.radius.value;

	}

	set height( height ) {

		this.material.uniforms.height.value = height;

	}

	get height() {

		return this.material.uniforms.height.value;

	}

}

class GroundProjectedEnvironment extends Environment {
    constructor(scene, oldEnvironment, texture) {
        super(scene, oldEnvironment);
        this.updateEnvironmentTexture(texture);
    }
    updateEnvironmentTexture(texture) {
        if (texture) {
            this._environmentTexture = texture;
            this._skybox = new GroundProjectedSkybox(this._environmentTexture);
            this._skybox.name = 'Ground projected skybox';
            this._skybox.scale.setScalar(100);
        }
        this.reload();
    }
    needsBounds() {
        return false;
    }
    needsCamera() {
        return false;
    }
    needsRotation() {
        return false;
    }
    addToScene() {
        if (this._scene && this._skybox) {
            this._scene.add(this._skybox);
        }
    }
    removeFromScene() {
        if (this._scene && this._skybox) {
            this._scene.remove(this._skybox);
        }
    }
    showGUI(updateCallback) {
        let gui = getGUI();
        if (!gui) {
            return;
        }
        let groundProjectedEnvironment = gui.addFolder('Ground Projected Environment');
        groundProjectedEnvironment
            .add(this._skybox, 'height')
            .min(10)
            .max(100)
            .step(0.1)
            .onChange(updateCallback);
        groundProjectedEnvironment
            .add(this._skybox, 'radius')
            .min(20)
            .max(200)
            .step(0.1)
            .onChange(updateCallback);
    }
}

class LightSourceDetectorDebug {
    constructor(lightSourceDetector) {
        this._lightSourceDetector = lightSourceDetector;
    }
    static createPlane(scene, material) {
        const planeGeometry = new PlaneGeometry(2, 1);
        const planeMaterial = material !== null && material !== void 0 ? material : new MeshBasicMaterial({ color: 0xc0c0c0, side: DoubleSide });
        const planeMesh = new Mesh(planeGeometry, planeMaterial);
        planeMesh.position.z = -0.1;
        scene.add(planeMesh);
        return planeMesh;
    }
    createDebugScene(scene, maxNoOfLightSources) {
        this._scene = scene;
        this._createLightGraphInMap(this._lightSourceDetector.sampleUVs, this._lightSourceDetector.lightSamples, this._lightSourceDetector.lightGraph, maxNoOfLightSources);
    }
    _createLightGraphInMap(allLightSamplesUVs, lightSamples, lightGraph, maxNoOfLightSources) {
        let singleLightSamples = [];
        let clusterLightSamples = [];
        for (let i = 0; i < this._lightSourceDetector.lightGraph.noOfNodes; ++i) {
            if (lightGraph.adjacent[i].length === 0) {
                singleLightSamples.push(lightSamples[i]);
            }
            else {
                clusterLightSamples.push(lightSamples[i]);
            }
        }
        const singleLightSampleUVs = singleLightSamples.map((sample) => sample.uv);
        const clusterLightSampleUVs = clusterLightSamples.map((sample) => sample.uv);
        const discardedSamples = allLightSamplesUVs.filter((uv) => !singleLightSampleUVs.includes(uv) &&
            !clusterLightSampleUVs.includes(uv));
        this._createSamplePointsInMap(discardedSamples, 0.005, 0xff0000);
        this._createSamplePointsInMap(singleLightSampleUVs, 0.01, 0x0000ff);
        this._createSamplePointsInMap(clusterLightSampleUVs, 0.01, 0x00ff00);
        this._createClusterLinesInMap(this._lightSourceDetector.lightSamples, this._lightSourceDetector.lightGraph.edges, 0x000080);
        const lightSourceUVs = this._lightSourceDetector.lightSources.map((lightSource) => lightSource.uv);
        this._createSamplePointsInMap(lightSourceUVs, 0.015, 0xffff00);
        let lightSources = this._lightSourceDetector.lightSources;
        if (maxNoOfLightSources !== undefined &&
            maxNoOfLightSources >= 0 &&
            maxNoOfLightSources < lightSources.length) {
            lightSources = lightSources.slice(0, maxNoOfLightSources);
        }
        this._createCirclesInMap(lightSources, 0x808000);
    }
    _createSamplePointsInMap(samplePoints, radius, color) {
        // TODO TREE.Points https://threejs.org/docs/#api/en/objects/Points
        const samplePointGeometry = new CircleGeometry(radius, 8, 4);
        const samplePointMaterial = new MeshBasicMaterial({ color });
        samplePoints.forEach((samplePoint) => {
            var _a;
            const samplePointMesh = new Mesh(samplePointGeometry, samplePointMaterial);
            samplePointMesh.position.copy(this._uvToMapPosition(samplePoint));
            samplePointMesh.name = 'samplePoint';
            (_a = this._scene) === null || _a === void 0 ? void 0 : _a.add(samplePointMesh);
        });
    }
    _createCirclesInMap(lightSources, color) {
        const samplePointMaterial = new MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.5,
        });
        lightSources.forEach((lightSource) => {
            var _a;
            const samplePointGeometry = new CircleGeometry(lightSource.size, 8, 4);
            const samplePointMesh = new Mesh(samplePointGeometry, samplePointMaterial);
            samplePointMesh.position.copy(this._uvToMapPosition(lightSource.uv));
            samplePointMesh.name = 'samplePoint';
            (_a = this._scene) === null || _a === void 0 ? void 0 : _a.add(samplePointMesh);
        });
    }
    _createClusterLinesInMap(lightSamples, clusterSegments, color) {
        var _a;
        const lineMaterial = new LineBasicMaterial({ color });
        const points = [];
        clusterSegments.forEach((cluster) => {
            for (let i = 1; i < cluster.length; i++) {
                const uv0 = lightSamples[cluster[0]].uv;
                const uv1 = lightSamples[cluster[i]].uv;
                points.push(this._uvToMapPosition(uv0));
                if (Math.abs(uv0.x - uv1.x) > 0.5) {
                    const v = (uv0.y + uv1.y) / 2;
                    const u = uv0.x < uv1.x ? 0 : 1;
                    points.push(this._uvToMapPosition(new Vector2(u, v)));
                    points.push(this._uvToMapPosition(new Vector2(1 - u, v)));
                }
                points.push(this._uvToMapPosition(uv1));
            }
        });
        const lineGeometry = new BufferGeometry().setFromPoints(points);
        const lineMesh = new LineSegments(lineGeometry, lineMaterial);
        lineMesh.name = 'clusterLine';
        (_a = this._scene) === null || _a === void 0 ? void 0 : _a.add(lineMesh);
    }
    _uvToMapPosition(uv) {
        return new Vector3(uv.x * 2 - 1, uv.y - 0.5, 0);
    }
}

class EnvironmentPmremGenertor extends PMREMGenerator {
    constructor(renderer) {
        super(renderer);
        this._extendedEquirectMaterial = this._createEquirectMaterial();
    }
    fromEquirectangularTexture(equirectangularTexture, parameters) {
        var _a, _b;
        const rotation = (_a = parameters === null || parameters === void 0 ? void 0 : parameters.rotation) !== null && _a !== void 0 ? _a : 0;
        const intensity = (_b = parameters === null || parameters === void 0 ? void 0 : parameters.intensity) !== null && _b !== void 0 ? _b : 1;
        this._extendedEquirectMaterial.uniforms.intensity.value = intensity;
        // prettier-ignore
        this._extendedEquirectMaterial.uniforms.rotationMatrix.value.set(Math.cos(rotation), 0, -Math.sin(rotation), 0, 1, 0, Math.sin(rotation), 0, Math.cos(rotation));
        return super.fromEquirectangular(equirectangularTexture);
    }
    _createEquirectMaterial() {
        const material = new ShaderMaterial({
            name: 'EquirectangularToCubeUV',
            uniforms: {
                envMap: { value: null },
                intensity: { value: 1.0 },
                rotationMatrix: { value: new Matrix3() },
            },
            vertexShader: equilateralVertexShader,
            fragmentShader: equilateralFragmentShader,
            blending: NoBlending,
            depthTest: false,
            depthWrite: false,
        });
        this._equirectMaterial = material;
        return material;
    }
}
const equilateralVertexShader = `
precision mediump float;
precision mediump int;
attribute float faceIndex;
varying vec3 vOutputDirection;
uniform mat3 rotationMatrix;

// RH coordinate system; PMREM face-indexing convention
vec3 getDirection( vec2 uv, float face ) {
    uv = 2.0 * uv - 1.0;
    vec3 direction = vec3( uv, 1.0 );
    if ( face == 0.0 ) {
        direction = direction.zyx; // ( 1, v, u ) pos x
    } else if ( face == 1.0 ) {
        direction = direction.xzy;
        direction.xz *= -1.0; // ( -u, 1, -v ) pos y
    } else if ( face == 2.0 ) {
        direction.x *= -1.0; // ( -u, v, 1 ) pos z
    } else if ( face == 3.0 ) {
        direction = direction.zyx;
        direction.xz *= -1.0; // ( -1, v, -u ) neg x
    } else if ( face == 4.0 ) {
        direction = direction.xzy;
        direction.xy *= -1.0; // ( -u, -1, v ) neg y
    } else if ( face == 5.0 ) {
        direction.z *= -1.0; // ( u, v, -1 ) neg z
    }
    return direction;
}

void main() {
    vOutputDirection = rotationMatrix * getDirection(uv, faceIndex);
    gl_Position = vec4(position, 1.0);
}
`;
const equilateralFragmentShader = `
precision mediump float;
precision mediump int;
varying vec3 vOutputDirection;
uniform sampler2D envMap;
uniform float intensity;

#include <common>

void main() {    
    vec3 outputDirection = normalize(vOutputDirection);
    vec2 uv = equirectUv(outputDirection);
    gl_FragColor = vec4(texture2D(envMap, uv).rgb * intensity, 1.0);
}
`;

class EnvironmentSceneGenerator {
}
class EnvironmentDefinition {
    get lightSources() {
        return this._lightSources;
    }
    set rotation(rotation) {
        if (this._rotation !== rotation) {
            this._rotation = rotation;
            this.needsUpdate = true;
        }
    }
    set intensity(intensity) {
        if (this._intensity !== intensity) {
            this._intensity = intensity;
            this.needsUpdate = true;
        }
    }
    set maxNoOfLightSources(maxNoOfLightSources) {
        if (this._maxNoOfLightSources !== maxNoOfLightSources) {
            this._maxNoOfLightSources = maxNoOfLightSources;
            this.needsUpdate = true;
        }
    }
    get maxNoOfLightSources() {
        return this._maxNoOfLightSources;
    }
    constructor(environment, parameters) {
        var _a, _b;
        this.needsUpdate = true;
        this._lightSources = [];
        if (environment instanceof EnvironmentSceneGenerator) {
            this.environmentSceneGenerator = environment;
        }
        else if (environment instanceof CubeTexture) {
            this.cubeTexture = environment;
        }
        else if (environment instanceof Texture) {
            this.equirectangularTexture = environment;
        }
        if (parameters === null || parameters === void 0 ? void 0 : parameters.textureData) {
            this.textureData = parameters === null || parameters === void 0 ? void 0 : parameters.textureData;
        }
        this._rotation = (_a = parameters === null || parameters === void 0 ? void 0 : parameters.rotation) !== null && _a !== void 0 ? _a : 0;
        this._intensity = (_b = parameters === null || parameters === void 0 ? void 0 : parameters.intensity) !== null && _b !== void 0 ? _b : 1;
        if ((parameters === null || parameters === void 0 ? void 0 : parameters.maxNoOfLightSources) !== undefined) {
            this._maxNoOfLightSources = parameters.maxNoOfLightSources;
        }
        this._parameters = parameters;
        this._environment = environment;
    }
    clone() {
        return new EnvironmentDefinition(this._environment, this._parameters);
    }
    createNewEnvironment(renderer) {
        const pmremTextue = this._createPmremTexture(renderer);
        const lightSourceDetector = this._detectLightSources(renderer, pmremTextue);
        this._lightSources = lightSourceDetector.lightSources;
        return pmremTextue !== null && pmremTextue !== void 0 ? pmremTextue : null;
    }
    _getTextureOffset() {
        const offestU = (this._rotation / (Math.PI * 2)) % 1;
        return new Vector2(offestU, 0);
    }
    _createPmremTexture(renderer) {
        const pmremGenerator = new EnvironmentPmremGenertor(renderer);
        let pmremRenderTarget;
        if (this.equirectangularTexture) {
            this.equirectangularTexture.offset.copy(this._getTextureOffset());
            pmremRenderTarget = pmremGenerator.fromEquirectangularTexture(this.equirectangularTexture, {
                rotation: this._rotation,
                intensity: this._intensity,
            });
        }
        else if (this.cubeTexture) {
            pmremRenderTarget = pmremGenerator.fromCubemap(this.cubeTexture);
        }
        else if (this.environmentSceneGenerator) {
            const environmentScene = this.environmentSceneGenerator.generateScene(this._intensity, this._rotation);
            pmremRenderTarget = pmremGenerator.fromScene(environmentScene, 0.04);
        }
        this._debugScene = undefined;
        this.needsUpdate = false;
        return pmremRenderTarget === null || pmremRenderTarget === void 0 ? void 0 : pmremRenderTarget.texture;
    }
    _detectLightSources(renderer, pmremTexture) {
        const lightSourceDetector = new LightSourceDetector();
        if (this.equirectangularTexture && this.rotation === 0) {
            lightSourceDetector.detectLightSources(renderer, this.equirectangularTexture, this.textureData);
        }
        else if (pmremTexture) {
            lightSourceDetector.detectLightSources(renderer, pmremTexture);
        }
        return lightSourceDetector;
    }
    createDebugScene(renderer, scene, maxNoOfLightSources) {
        const maxLightSources = maxNoOfLightSources !== null && maxNoOfLightSources !== void 0 ? maxNoOfLightSources : -1;
        if (this._debugScene &&
            maxLightSources === this._debugScene.userData.maximumNumberOfLightSources) {
            return this._debugScene;
        }
        this._debugScene = new Scene();
        const planeMaterial = new EnvironmentMapDecodeMaterial(true, false);
        planeMaterial.setSourceTexture(scene.environment);
        LightSourceDetectorDebug.createPlane(this._debugScene, planeMaterial);
        const lightSourceDetector = this._detectLightSources(renderer, scene.environment);
        const lightSourceDetectorDebug = new LightSourceDetectorDebug(lightSourceDetector);
        lightSourceDetectorDebug.createDebugScene(this._debugScene, maxLightSources);
        this._debugScene.userData.maximumNumberOfLightSources = maxLightSources;
        return this._debugScene;
    }
}

const DEFAULT_ENVIRONMENT_SCENE_TYPES = {
    ALL_AROUND: 'all_around',
    FRONT: 'front',
};
class DefaultEnvironmentSceneGenerator extends EnvironmentSceneGenerator {
    constructor(parameters = {}) {
        super();
        this._parameters = {};
        this._parameters = parameters;
    }
    generateScene(intensity, rotation) {
        const defaultEnvironmentScene = new DefaultEnvironmentScene({
            ...this._parameters,
            lightIntensity: intensity * (this._parameters.lightIntensity || 1.0),
            topLightIntensity: intensity * (this._parameters.topLightIntensity || 1.0),
            sidLightIntensity: intensity * (this._parameters.sidLightIntensity || 1.0),
        });
        defaultEnvironmentScene.rotation.y = rotation;
        return defaultEnvironmentScene;
    }
}
class DefaultEnvironmentScene extends Scene {
    constructor(parameters = {}) {
        var _a;
        super();
        this._type = (_a = parameters === null || parameters === void 0 ? void 0 : parameters.type) !== null && _a !== void 0 ? _a : DEFAULT_ENVIRONMENT_SCENE_TYPES.ALL_AROUND;
        this._topLightIntensity =
            (parameters === null || parameters === void 0 ? void 0 : parameters.topLightIntensity) || (parameters === null || parameters === void 0 ? void 0 : parameters.lightIntensity) || 1.0;
        this._sideLightIntensity =
            (parameters === null || parameters === void 0 ? void 0 : parameters.sidLightIntensity) || (parameters === null || parameters === void 0 ? void 0 : parameters.lightIntensity) || 1.0;
        this._sideReflectorIntensity =
            (parameters === null || parameters === void 0 ? void 0 : parameters.sidLightIntensity) || (parameters === null || parameters === void 0 ? void 0 : parameters.lightIntensity) || 1.0;
        this._ambientLightIntensity = (parameters === null || parameters === void 0 ? void 0 : parameters.ambientLightIntensity) || 0.25;
        this._colorVariation = (parameters === null || parameters === void 0 ? void 0 : parameters.colorVariation) || 0.5;
        this._lightGeometry = new BoxGeometry();
        this._lightGeometry.deleteAttribute('uv');
        this.generateScene(this);
    }
    generateScene(scene) {
        switch (this._type) {
            default:
            case DEFAULT_ENVIRONMENT_SCENE_TYPES.ALL_AROUND:
                this._createAllAroundSceneLight(scene);
                break;
            case DEFAULT_ENVIRONMENT_SCENE_TYPES.FRONT:
                this._createFrontSceneLight(scene);
                break;
        }
    }
    dispose() {
        const resources = new Set();
        this.traverse((object) => {
            if (object.isMesh) {
                resources.add(object.geometry);
                resources.add(object.material);
            }
        });
        for (const resource of resources) {
            resource.dispose();
        }
    }
    _createAllAroundSceneLight(scene) {
        const ambientLight = new AmbientLight(0xffffff);
        ambientLight.intensity = this._ambientLightIntensity;
        this.add(ambientLight);
        this._createTopLight(scene, 6, 1);
        for (let i = 0; i < 6; i++) {
            const azimuthAngleInRad = (i * Math.PI * 2.0) / 6.0;
            const x = Math.sin(azimuthAngleInRad);
            const z = Math.cos(azimuthAngleInRad);
            if (i % 2 === 0) {
                this._createReflector(scene, new Vector2(x, z), 3, 1, 1);
            }
            else {
                this._createSideLight(scene, new Vector2(x, z), (i - 1) / 2, 15, 1.1, 0.33, 1);
            }
        }
    }
    _createFrontSceneLight(scene) {
        const ambientLight = new AmbientLight(0xffffff);
        ambientLight.intensity = this._ambientLightIntensity;
        this.add(ambientLight);
        this._createTopLight(scene, 5, 0.5);
        for (let i = 0; i < 6; i++) {
            const azimuthAngleInRad = (i * Math.PI * 2.0) / 6.0;
            const x = Math.sin(azimuthAngleInRad);
            const z = Math.cos(azimuthAngleInRad);
            if (i === 0) {
                this._createReflector(scene, new Vector2(x, z), 3, 0.8, 0.4);
                for (let j = 0; j < 2; j++) {
                    const tangentialAngleInRad = ((i - 0.3 + j * 0.6) * Math.PI * 2.0) / 6.0;
                    const x0 = Math.sin(tangentialAngleInRad);
                    const z0 = Math.cos(tangentialAngleInRad);
                    this._createSideLight(scene, new Vector2(x0, z0), (i - 1) / 2, 24, 1.2, 1, 0.8);
                }
            }
            else {
                this._createReflector(scene, new Vector2(x, z), 5, 0.8, 1);
            }
        }
    }
    _createAreaLightMaterial(r, g, b) {
        const material = new MeshBasicMaterial();
        material.color.set(r, g !== null && g !== void 0 ? g : r, b !== null && b !== void 0 ? b : r);
        return material;
    }
    _createTopLight(scene, intensity, scale) {
        const topLight = new Mesh(this._lightGeometry, this._createAreaLightMaterial(intensity * this._topLightIntensity));
        topLight.position.set(0.0, 20.0, 0.0);
        topLight.scale.set(5 * scale, 0.1, 5 * scale);
        scene.add(topLight);
    }
    _createSideLight(scene, direction, index, intensity, scale, level, distance) {
        for (let j = 0; j < 3; j++) {
            const li = intensity * this._sideLightIntensity;
            const light = new Mesh(this._lightGeometry, this._createAreaLightMaterial((j + index) % 3 === 0 ? li : li * (1.0 - this._colorVariation), (j + index) % 3 === 1 ? li : li * (1.0 - this._colorVariation), (j + index) % 3 === 2 ? li : li * (1.0 - this._colorVariation)));
            const xOffset = (j === 1 ? -direction.y : j === 2 ? direction.y : 0) / Math.sqrt(2);
            const yOffset = j === 0 ? 0 : 1;
            const zOffset = (j === 1 ? direction.x : j === 2 ? -direction.x : 0) / Math.sqrt(2);
            light.position.set(direction.x * distance * 15.0 + xOffset * 1.1 * scale, level * 15.0 + yOffset * 1.1 * scale, direction.y * distance * 15.0 + zOffset * 1.1 * scale);
            light.rotation.set(0, Math.atan2(direction.x, direction.y), 0);
            light.scale.setScalar(scale);
            scene.add(light);
        }
    }
    _createReflector(scene, direction, intensity, scale, scaleZ) {
        const light = new Mesh(this._lightGeometry, this._createAreaLightMaterial(intensity * this._sideReflectorIntensity));
        light.position.set(direction.x * 15.0, 5.0 * scaleZ, direction.y * 15.0);
        light.rotation.set(0, Math.atan2(direction.x, direction.y), 0);
        light.scale.set(10 * scale, 12 * scale * scaleZ, 10 * scale);
        scene.add(light);
    }
}

const STANDBY_AFTER = 3000;
class SceneManager {
    onBeforeRender() {
        // can be overridden by child classes
    }
    constructor(creator, offset, canvasID, mode) {
        this._depthWriteMaterial = new MeshBasicMaterial({
            colorWrite: false,
        });
        this._maxAnisotropy = 1;
        this._clock = new Clock();
        this._delta = 0;
        this._renderListener = null;
        this._stopRendering = false;
        this._forceRender = false;
        this._lastChange = Date.now();
        this._running = false;
        this._perspectiveOffsetCamera = null;
        this._orthographicOffsetCamera = null;
        this._onAfterRender = () => {
            //set when needed
        };
        this._creator_ = creator;
        this._canvasID = canvasID;
        this.createCameraControl(sanitizedCameraMode(mode), offset);
        this._setupScene(offset, false);
        this._lifeCycleManager.addEventListener(this);
    }
    addEventListener(_listener) {
        throw new Error('Method not implemented.');
    }
    removeEventListener(_listener) {
        throw new Error('Method not implemented.');
    }
    _changeCameraControl(cameraControl) {
        if (this._cameraControl) {
            this._cameraControl.cleanUp();
        }
        if (cameraControl instanceof CameraControlFirstPerson) {
            this._getInputManager().removeEventListener(7 /* INPUT_EVENT.ZOOM_IN */, this._renderListener);
            this._getInputManager().removeEventListener(8 /* INPUT_EVENT.ZOOM_OUT */, this._renderListener);
        }
        if (this._cameraControl instanceof CameraControlFirstPerson) {
            this._getInputManager().addEventListener(7 /* INPUT_EVENT.ZOOM_IN */, this._renderListener, this);
            this._getInputManager().addEventListener(8 /* INPUT_EVENT.ZOOM_OUT */, this._renderListener, this);
        }
        this._cameraControl = cameraControl;
        this.cameraControlChanged();
    }
    cameraControlChanged() {
        //override when needed
    }
    _addCameraControlListener() {
        this._cameraControl.addEventListener(0 /* CAMERA_EVENT.ORBIT_START */, () => {
            var _a;
            (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.movingCameraStarts();
            this._requestRender();
        }, this);
        this._cameraControl.addEventListener(1 /* CAMERA_EVENT.ORBIT_MOVE */, this._requestRender, this);
        this._cameraControl.addEventListener(2 /* CAMERA_EVENT.ORBIT_END */, () => {
            var _a;
            (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.movingCameraStops();
            this._requestRender();
        }, this);
        this._cameraControl.addEventListener(6 /* CAMERA_EVENT.KEYBOARD_PRESSED */, this._requestRender, this);
    }
    /**
     * Start render loop and update everything (AA, AO, Shadows, etc)
     * @private
     */
    _renderEverything() {
        var _a;
        if (this._roomleRenderer) {
            this._forceRender = true;
            (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.forceShadowUpdates(false);
        }
        this._requestRender();
    }
    /**
     * Start render loop and render the scene but keep shadows and AO, needed for material changes
     * @private
     */
    _renderWithoutShadowsAndAO() {
        if (this._roomleRenderer) {
            this._forceRender = true;
        }
        this._requestRender();
    }
    _requestRender() {
        if (!this._renderer || this._stopRendering) {
            return;
        }
        const render = () => {
            var _a, _b;
            this._delta = this._clock.getDelta();
            this._animateCamera();
            this._cameraControl.getCamera().layers.mask = 0xffff;
            if (this._renderLoopFunction) {
                this._renderLoopFunction();
                this._renderLoopFunction = null;
            }
            this.onBeforeRender();
            if (this._roomleRenderer) {
                (_a = this._statsHelper) === null || _a === void 0 ? void 0 : _a.updateRenderInfo(this._roomleRenderer.renderer.info);
                this._roomleRenderer.render(this._scene, this._cameraControl.getCamera());
                this._forceRender = false;
                if (this._shouldRenderUi()) {
                    this._renderUi();
                }
            }
            else {
                (_b = this._statsHelper) === null || _b === void 0 ? void 0 : _b.updateRenderInfo(this._renderer.info);
                this._renderer.render(this._scene, this._cameraControl.getCamera());
            }
            this._onAfterRender();
            if (window.TWEEN) {
                TWEEN.update();
            }
            if (this._lastChange + STANDBY_AFTER < Date.now() ||
                this._stopRendering) {
                this._running = false;
            }
            else {
                this._running = true;
                requestAnimationFrame(render);
            }
        };
        this._lastChange = Date.now();
        if (!this._running && !this._stopRendering) {
            this._running = true;
            requestAnimationFrame(render);
        }
    }
    _shouldRenderUi() {
        return this._pluginSystem && this._pluginSystem.needsUiScene();
    }
    _renderUi() {
        // Render scene depth for depth compare
        const background = this._scene.background
            ? this._scene.background.clone()
            : null;
        this._scene.overrideMaterial = this._depthWriteMaterial;
        this._scene.background = null;
        this._renderer.render(this._scene, this._cameraControl.getCamera());
        this._scene.overrideMaterial = null;
        const oldAutoClear = this._renderer.autoClear;
        this._renderer.autoClear = false;
        this._renderer.clearDepth();
        this._renderer.render(this._uiScene, this._cameraControl.getCamera());
        this._renderer.autoClear = oldAutoClear;
        this._scene.background = background;
    }
    _animateCamera() {
        if (this._cameraControl) {
            if (!(!this._cameraControl.animateCamera(this._delta) &&
                this.shouldClearShadowsAndAO() &&
                !this._forceRender)) {
                if (this._lightSetting instanceof DynamicLightSetting &&
                    this._cameraControl.getCamera() instanceof PerspectiveCamera) {
                    this._lightSetting.update(this._cameraControl.getCamera(), this._cameraControl.getTargetPosition());
                }
            }
        }
        //set background rotation based on camera rotation
        if (this._environment &&
            this._environment.needsCamera() &&
            this._cameraControl instanceof CameraControl3D) {
            this._environment.updateCamera(this._cameraControl.getCamera());
        }
    }
    shouldClearShadowsAndAO() {
        return false;
    }
    _setupScene(offset, transparent) {
        var _a;
        const { x, y } = this._domHelper.getClientDimensions();
        this._scene = new Scene();
        this._uiScene = new Scene();
        transparent = transparent ? transparent : false;
        if (!transparent) {
            this._scene.background = getColor(this._initData.colors.DEFAULT_BACKGROUND);
        }
        this._renderer = new WebGLRenderer({
            antialias: !this._initData.e2e,
            alpha: true,
        });
        // lock max dpr to 1.5 (nearly no visual difference to 2) expect auto quality is turned off
        const dpr = this._initData.autoQuality
            ? Math.min(window.devicePixelRatio, 1.5)
            : window.devicePixelRatio;
        this._renderer.setPixelRatio(dpr);
        this._renderer.setSize(x, y);
        this._renderer.outputColorSpace = SRGBColorSpace;
        this._renderer.autoClear = false;
        this._renderer.shadowMap.enabled = true;
        this._renderer.shadowMap.type = PCFSoftShadowMap;
        this._maxAnisotropy = this._renderer.capabilities.getMaxAnisotropy();
        if (!this._initData.e2e) {
            this._roomleRenderer = new RoomleWebGLRenderer(this._renderer, x, y);
            this._roomleRenderer.setQualityMap(standaloneConfiguratorQualityLevels);
            this._roomleRenderer.setAutoQuality(this._initData.autoQuality);
            this._roomleRenderer.setShadingType(this._initData.shading);
            (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.setSize(x, y);
        }
        this._renderer.domElement.classList.add(this._canvasID);
        this._domHelper.element.appendChild(this._renderer.domElement);
        this._getInputManager().addEvents(this._renderer.domElement);
        this._hdrEnvironmentLoader.registerEnvironmentChangedCallback((maps) => {
            this._setEnvMap(maps);
        });
        if (this._initData.legacyLight) {
            this.loadEnvMap(ENV_LEGACY);
        }
        else if (this._initData.sceneLight) {
            this._setDefaultEnvironmentScene();
        }
        else {
            this.loadEnvMap(this._initData.envMapUrl);
        }
        this._requestRender();
        window.addEventListener("resize" /* WINDOW_EVENT.RESIZE */, this, false);
        window.addEventListener("keydown" /* WINDOW_EVENT.KEY_DOWN */, this, false);
        window.addEventListener("keyup" /* WINDOW_EVENT.KEY_UP */, this, false);
        document.addEventListener("visibilitychange" /* WINDOW_EVENT.VISIBILITY_CHANGE */, this);
        this._pluginSystem.init(this._scene, this._uiScene, this._cameraControl.getCamera().position);
        this._addCameraControlListener();
        this.sceneChanged();
    }
    async loadEnvMap(url) {
        await this._hdrEnvironmentLoader.loadUrl(this._renderer, url);
    }
    _setDefaultEnvironmentScene() {
        const type = this._initData.sceneLight;
        this._scene.userData.environmentDefinition = new EnvironmentDefinition(new DefaultEnvironmentSceneGenerator({ type }), {
            rotation: this._initData.envMapRotation,
            intensity: this._initData.envMapIntensity,
            maxNoOfLightSources: this._initData.maxLightSources,
        });
        this._scene.userData.shadowFromEnvironment = true;
        this._requestRender();
    }
    _setEnvMap(maps) {
        const { url, environmentMap } = maps;
        this._scene.environment = environmentMap;
        this._scene.userData.environmentDefinition = new EnvironmentDefinition(environmentMap, {
            rotation: this._initData.envMapRotation,
            intensity: this._initData.legacyLight
                ? 0.9
                : this._initData.envMapIntensity,
            maxNoOfLightSources: this._initData.maxLightSources,
        });
        this._scene.userData.shadowFromEnvironment = !this._initData.legacyLight;
        if (this._environment instanceof GroundProjectedEnvironment) {
            this._environment.updateEnvironmentTexture(environmentMap);
        }
        if (url === ENV_HDR_256_FILE_NAME && !this._initData.e2e) {
            window.requestIdleCallback(this.loadEnvMap.bind(this, ENV_HDR_1K_FILE_NAME));
        }
        this._requestRender();
    }
    _tabVisible() {
        this.updateCamera(false);
    }
    _releaseKeystrokeStates() {
        const keysToRelease = ['Shift', 'Meta', 'Control', 'Escape'];
        for (const key of keysToRelease) {
            const event = new KeyboardEvent('keyup', { key });
            this._onKeyUp(event);
        }
    }
    updateCamera(_changeCamera = true) {
        var _a;
        const { x, y } = this._domHelper.getClientDimensions();
        (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.setSize(x, y);
        this._cameraControl.updateCamera();
        this._renderEverything();
    }
    _onWindowResize() {
        const inputManager = this._getInputManager();
        if (inputManager) {
            inputManager.updateSize();
        }
        this.updateCamera();
        this._requestRender();
    }
    _isPartOfScene(object) {
        return (object.type === 'Object3D' ||
            object.type === 'Mesh' ||
            object.type === "GLB" /* STATIC_ITEM_TYPE.GLB */ ||
            object.type === "GLTF" /* STATIC_ITEM_TYPE.GLTF */ ||
            object.type === 'Group'); // && (object.name !== 'Sky' && object.name !== 'Sunsphere' && object.name !== 'Ground');
    }
    cleanUp() {
        this._getInputManager().removeEventListener(7 /* INPUT_EVENT.ZOOM_IN */, this._renderListener);
        this._getInputManager().removeEventListener(8 /* INPUT_EVENT.ZOOM_OUT */, this._renderListener);
        if (this._cameraControl) {
            this._cameraControl.cleanUp();
        }
        this._stopRendering = true;
    }
    clearScene() {
        let removals = [];
        this._scene.children.forEach((child) => {
            if (this._isPartOfScene(child)) {
                removals.push(child);
            }
        });
        removals.forEach((item) => {
            dispose(item);
            this._scene.remove(item);
        });
        this._renderer.renderLists.dispose();
    }
    enableHD(source) {
        if (this._renderer.capabilities.maxTextures > 8 && source) {
            this.loadDynamicLightSetting(source);
        }
        this._requestRender();
    }
    _loadGLTF(gltfJSON, position, rotation, size, scale, color, callback) {
        return new Promise((resolve, reject) => {
            this._staticItemLoader
                .loadGLTF(gltfJSON, position, rotation, size, scale, color, null, callback)
                .then((object) => {
                this._setCamera("GLTF" /* STATIC_ITEM_TYPE.GLTF */, object.scene);
                resolve(object.scene);
            }, reject);
        });
    }
    _loadGLB(url, position, rotation, size, scale, color, colorable, callback) {
        return new Promise((resolve, reject) => {
            this._staticItemLoader
                .loadGLB(url, position, rotation, size, scale, color, colorable, callback)
                .then((object) => {
                this._setCamera("GLB" /* STATIC_ITEM_TYPE.GLB */, object.scene);
                resolve(object.scene);
            }, reject);
        });
    }
    _setCamera(type, object) {
        if (!object) {
            console.warn('could not set camera for gltf', object);
            return;
        }
        const boundingBox = new Box3();
        boundingBox.setFromObject(object);
        if (type === "GLB" /* STATIC_ITEM_TYPE.GLB */) {
            if (this._cameraControl instanceof CameraControl3D) {
                this._cameraControl.updateToBounds(boundingBox, false);
            }
        }
        else if (type === "GLTF" /* STATIC_ITEM_TYPE.GLTF */) {
            if (this._cameraControl instanceof CameraControl3D) {
                this._cameraControl.updateAndReset(boundingBox.getSize(new Vector3()), boundingBox.getCenter(new Vector3()), -15, 70, 5, false);
            }
            if (this._cameraControl instanceof CameraControl2D) {
                this._cameraControl.zoomToFitBounds(boundingBox, true);
            }
        }
        this.updateCamera();
    }
    showGUI() {
        if (this._initData.disableDebugGUI) {
            return;
        }
        const guiStyle = document.createElement('style');
        guiStyle.innerText =
            '.dg.main{position:absolute;z-index:999;top:0;left:0;}';
        document.head.appendChild(guiStyle);
        let gui = getGUI(false);
        if (!gui) {
            return;
        }
        const element = this._domHelper.element;
        element.appendChild(gui.domElement);
        this._guiLoaded();
    }
    _guiLoaded() {
        let gui = getGUI();
        if (!gui) {
            return;
        }
        const sceneParams = gui.addFolder('Scene Parameter');
        const params = {
            intensity: this._initData.envMapIntensity,
            rotation: this._initData.envMapRotation,
        };
        sceneParams
            .add(params, 'intensity', 0, 4, 0.01)
            .name('env map intensity')
            .onChange((value) => {
            this.changeEnvironmentMapIntensity(value);
            this._requestRender();
        });
        sceneParams
            .add(params, 'rotation', 0, Math.PI * 2, 0.01)
            .name('env map rotation')
            .onChange((value) => {
            this._scene.userData.environmentDefinition.rotation = value;
            this._requestRender();
        });
        if (this._lightSetting) {
            this._lightSetting.showGUI();
        }
        if (this._roomleRenderer) {
            this._roomleRenderer.showGUI(() => this._requestRender());
        }
        if (this._environment) {
            this._environment.showGUI(() => this._requestRender());
        }
        this._addGUIListener(gui);
    }
    _addGUIListener(gui) {
        let folders = gui.__folders;
        Object.keys(folders).forEach((key1) => {
            let obj = folders[key1];
            if (obj.__folders) {
                Object.keys(obj.__folders).forEach((key2) => {
                    let folder = obj.__folders[key2];
                    this._addGUIListener(folder);
                });
            }
            if (obj.__controllers) {
                obj.__controllers.forEach((controller) => {
                    controller.onFinishChange(() => {
                        this._guiParamChanged();
                    });
                });
            }
        });
    }
    _guiParamChanged() {
        this._renderEverything();
    }
    showStats() {
        import('./stats-helper-14bf5ee3.js').then((statsHelper) => (this._statsHelper = new statsHelper.default()));
    }
    _onKeyDown(_event) {
        //console.log('key down', event.key);
    }
    _onKeyUp(_event) {
        //console.log('key up', event.key);
    }
    pause() {
        this._getInputManager().removeEvents(this._renderer.domElement);
        window.removeEventListener("resize" /* WINDOW_EVENT.RESIZE */, this, false);
        window.removeEventListener("keydown" /* WINDOW_EVENT.KEY_DOWN */, this, false);
        window.removeEventListener("keyup" /* WINDOW_EVENT.KEY_UP */, this, false);
        document.removeEventListener("visibilitychange" /* WINDOW_EVENT.VISIBILITY_CHANGE */, this);
    }
    resume() {
        this._renderer.domElement.classList.add(this._canvasID);
        this._domHelper.element.appendChild(this._renderer.domElement);
        this._getInputManager().addEvents(this._renderer.domElement);
        window.addEventListener("resize" /* WINDOW_EVENT.RESIZE */, this, false);
        window.addEventListener("keydown" /* WINDOW_EVENT.KEY_DOWN */, this, false);
        window.addEventListener("keyup" /* WINDOW_EVENT.KEY_UP */, this, false);
        document.addEventListener("visibilitychange" /* WINDOW_EVENT.VISIBILITY_CHANGE */, this);
        this.updateCamera();
    }
    destroy() {
        this.pause();
        this.cleanUp();
    }
    handleEvent(evt) {
        switch (evt.type) {
            case "resize" /* WINDOW_EVENT.RESIZE */:
                this._onWindowResize();
                break;
            case "keydown" /* WINDOW_EVENT.KEY_DOWN */:
                if (evt.target &&
                    (evt.target instanceof HTMLInputElement ||
                        evt.target instanceof HTMLTextAreaElement)) {
                    break;
                }
                this._onKeyDown(evt);
                break;
            case "keyup" /* WINDOW_EVENT.KEY_UP */:
                if (evt.target &&
                    (evt.target instanceof HTMLInputElement ||
                        evt.target instanceof HTMLTextAreaElement)) {
                    break;
                }
                this._onKeyUp(evt);
                break;
            case "visibilitychange" /* WINDOW_EVENT.VISIBILITY_CHANGE */:
                this._tabVisible();
                // things like multiselect are triggered
                // by keydown events if we don't release the keys
                // keyup will never follow and therefore never be released
                this._releaseKeystrokeStates();
                break;
        }
    }
    async loadSceneSettings(sceneSetting) {
        let environmentPromise;
        if (sceneSetting.environment) {
            environmentPromise = new Promise((resolve) => {
                let dynamicEnvironmentSettingLoader = new DynamicEnvironmentSettingLoader();
                dynamicEnvironmentSettingLoader
                    .load(this._scene, this._renderer.domElement, this._environment, sceneSetting, this._maxAnisotropy)
                    .then((environment) => {
                    this._setEnvironment(environment);
                    resolve();
                });
            });
        }
        else {
            environmentPromise = Promise.resolve();
        }
        let lightPromise;
        if (sceneSetting.lights) {
            this._lightSetting = new DynamicLightSetting(this._scene, this._lightSetting);
            lightPromise = this._lightSetting.loadFromObject(sceneSetting);
        }
        else {
            lightPromise = Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            Promise.all([environmentPromise, lightPromise]).then(() => {
                this._renderEverything();
                resolve();
            }, reject);
        });
    }
    setBackgroundColor(hex) {
        this._setEnvironment(new BackgroundEnvironment(this._scene, this._environment, new Color(hex)));
    }
    setBackgroundImage(url) {
        this._setEnvironment(new BackgroundEnvironment(this._scene, this._environment, null, this._renderer.domElement, url));
    }
    _setEnvironment(environment) {
        this._environment = environment;
        this._renderEverything();
    }
    async loadDynamicLightSetting(source) {
        this._lightSetting = new DynamicLightSetting(this._scene, this._lightSetting);
        let changedLight = false;
        if (source.url) {
            await this._lightSetting.loadFromURL(source.url);
            changedLight = true;
        }
        else if (source.json) {
            await this._lightSetting.loadFromJSON(source.json);
            changedLight = true;
        }
        else if (source.object) {
            await this._lightSetting.loadFromObject(source.object);
            changedLight = true;
        }
        else if (source.ls) {
            const lightSetting = DynamicLightSettingLoader.createDynamicLightSettingSource(null, source.ls);
            await this._lightSetting.loadFromURL(lightSetting.url);
            changedLight = true;
        }
        if (changedLight) {
            this._requestRender();
        }
        else {
            throw new Error('No dynamic light setting source set');
        }
    }
    getScene() {
        return this._scene;
    }
    updateScene() {
        var _a;
        this._updateBounds(this.getBounds());
        (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.forceShadowUpdates(true);
        this._renderEverything();
    }
    _updateBounds(bounds, geometryChanged = false) {
        var _a;
        if (!bounds) {
            return;
        }
        this.updateEnvironment(bounds, geometryChanged);
        if (this._lightSetting && this._lightSetting.needsBounds()) {
            this._lightSetting.updateBounds(bounds);
        }
        (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.updateBounds(bounds);
        this._requestRender();
        this._pluginSystem.updateBounds(bounds);
    }
    setCameraOffset(offset) {
        const camera = this._cameraControl.getCamera();
        const offsetCamera = camera ||
            camera;
        if (offsetCamera === null || offsetCamera === void 0 ? void 0 : offsetCamera.offset) {
            offsetCamera.offset = offset;
            this._renderEverything();
        }
        else {
            console.warn('Cannot set offset, current camera does not support it');
        }
    }
    getCameraOffset() {
        const camera = this._cameraControl.getCamera();
        const offsetCamera = camera ||
            camera;
        if (offsetCamera === null || offsetCamera === void 0 ? void 0 : offsetCamera.offset) {
            return JSON.parse(JSON.stringify(offsetCamera.offset));
        }
        return { left: 0, top: 0, right: 1, bottom: 1 };
    }
    getOrthographicOffsetCamera() {
        if (!this._orthographicOffsetCamera) {
            const currentOffset = this.getCameraOffset();
            const clientDimensions = this._domHelper.getClientDimensions();
            const width = clientDimensions.x;
            const height = clientDimensions.y;
            const size = 5;
            let aspectRatio = width / height;
            let frustumWidth = aspectRatio * size;
            let frustumHeight = size;
            const componentFactory = RoomleComponentFactoryInitializer();
            this._orthographicOffsetCamera =
                componentFactory.createOrthographicCamera(frustumWidth / -2, frustumWidth / 2, frustumHeight / 2, frustumHeight / -2, 1, 1000, currentOffset);
            this._orthographicOffsetCamera.position.set(0, 10, 0);
            this._orthographicOffsetCamera.lookAt(new Vector3(0, 0, 0));
        }
        return this._orthographicOffsetCamera;
    }
    getPerspectiveOffsetCamera() {
        if (!this._perspectiveOffsetCamera) {
            const currentOffset = this.getCameraOffset();
            const clientDimensions = this._domHelper.getClientDimensions();
            const width = clientDimensions.x;
            const height = clientDimensions.y;
            const componentFactory = RoomleComponentFactoryInitializer();
            this._perspectiveOffsetCamera = componentFactory.createPerspectiveCamera(30, width / height, 0.1, 20, currentOffset);
        }
        return this._perspectiveOffsetCamera;
    }
    updateEnvironment(bounds, force = false) {
        var _a;
        if (bounds && this._environment && this._environment.needsBounds()) {
            const size = bounds.getSize(new Vector3());
            if (size.x + size.y + size.z !== 0 || force) {
                this._environment.updateBounds(bounds.getSize(new Vector3()), force);
            }
        }
        (_a = this._roomleRenderer) === null || _a === void 0 ? void 0 : _a.updateEnvironment(bounds, force);
    }
    _onCameraIdle() {
        return true;
    }
    _onCameraMove() {
        return true;
    }
    exportImageFromCamera(filename) {
        this._onAfterRender = () => {
            const image = this._renderer.domElement.toDataURL('image/jpeg', 1);
            const { left, right, top, bottom } = this.getCameraOffset();
            const percentX = right - left;
            const percentY = top - bottom;
            if (percentX === 1 && percentY === 1) {
                download(filename, image);
                this._onAfterRender = () => undefined;
                return;
            }
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const { naturalWidth, naturalHeight } = img;
                const canvas = document.createElement('canvas');
                canvas.width = naturalWidth * percentX;
                canvas.height = naturalHeight * percentY;
                const context = canvas.getContext('2d');
                const marginX = naturalWidth * left * -1;
                const marginY = naturalHeight * (1 - top) * -1;
                context.drawImage(img, marginX, marginY);
                context.save();
                download(filename, canvas.toDataURL('image/jpeg', 1));
                this._onAfterRender = () => undefined;
            };
        };
        this._requestRender();
    }
    changeEnvironmentMapIntensity(intensity) {
        this._scene.userData.environmentDefinition.intensity = intensity;
    }
    lockCamera() {
        this._cameraControl.lock();
    }
    unlockCamera() {
        this._cameraControl.unlock();
    }
    setEnvironmentMap(url, intensity, rotation, maxLightSources) {
        if (url !== undefined) {
            this._hdrEnvironmentLoader.loadUrl(this._renderer, url);
        }
        if (intensity !== undefined) {
            this._scene.userData.environmentDefinition.intensity = intensity;
        }
        if (rotation !== undefined) {
            this._scene.userData.environmentDefinition.rotation = rotation;
        }
        if (maxLightSources !== undefined) {
            this._scene.userData.environmentDefinition.maxNoOfLightSources =
                maxLightSources;
            this._roomleRenderer.forceShadowUpdates(false);
        }
        this._requestRender();
    }
}
__decorate([
    inject
], SceneManager.prototype, "_domHelper", void 0);
__decorate([
    inject
], SceneManager.prototype, "_scriptLoader", void 0);
__decorate([
    inject
], SceneManager.prototype, "_lifeCycleManager", void 0);
__decorate([
    inject
], SceneManager.prototype, "_staticItemLoader", void 0);
__decorate([
    inject
], SceneManager.prototype, "_hdrEnvironmentLoader", void 0);
__decorate([
    inject
], SceneManager.prototype, "_initData", void 0);
__decorate([
    inject
], SceneManager.prototype, "_idbManager", void 0);
__decorate([
    inject
], SceneManager.prototype, "_pluginSystem", void 0);
__decorate([
    inject
], SceneManager.prototype, "_imageRenderer", void 0);

export { BackgroundEnvironment as B, CameraControl3D as C, DISTANCE_FACTOR as D, FloorEnvironment as F, LightSetting as L, SceneManager as S, TWEEN_FILE_NAME as T, CameraControl as a, CameraControl2D as b, CameraControlFirstPerson as c };
//# sourceMappingURL=scene-manager-73d74c26.js.map
