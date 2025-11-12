import { S as ScriptLoader, M as Main } from './script-loader-ab23f4ec.js';
import { as as InputManager, D as DependencyInjectionAssignment, L as Logger, R as RapiAccess, Q as getGUI, _ as __decorate, i as inject, e as CANVAS_ID, j as DynamicLightSettingLoader, k as PREDEFINED_LIGHTSETTING, n as dispose, b as RoomleDependencyInjection } from './roomle-dependency-injection-0a65a99a.js';
import { C as CameraControl3D, L as LightSetting, S as SceneManager, T as TWEEN_FILE_NAME } from './scene-manager-5071d3d7.js';
import { a as Vector3, ad as Box3, ag as Euler, Q as Quaternion, A as AmbientLight, C as Color, aE as CAMERA_TYPE, aO as getGlbUrl, bv as WebGLRenderer, i as SRGBColorSpace, bj as BasicShadowMap, N as PerspectiveCamera, bL as download } from './main-thread-to-worker-8a755a37.js';
import { D as DefaultLightSetting } from './default-light-setting-c762e9fe.js';
import './query-params-helper-f12b7599.js';

class GlbInputManager extends InputManager {
}

const INJECTABLES = [
    new DependencyInjectionAssignment('script-loader', ScriptLoader),
    new DependencyInjectionAssignment('glb-input-manager', GlbInputManager, 1 /* DI_TYPE.CONTEXT */),
    new DependencyInjectionAssignment('logger', Logger),
    new DependencyInjectionAssignment('rapi-access', RapiAccess),
];

class AdjustableCameraControl3D extends CameraControl3D {
    constructor() {
        super(...arguments);
        this.shouldIgnoreStandardBehavior = false;
    }
    adjust(bounds, position, yaw, pitch, _fov) {
        let minVector = new Vector3(-bounds.x / 2, 0, -bounds.z / 2);
        let maxVector = new Vector3(bounds.x / 2, bounds.y, bounds.z / 2);
        this._boundingBox = new Box3(minVector, maxVector);
        // before applying attis pitch value with have to rotate down, because we assume that attis rotation is upwards
        let euler = new Euler(-Math.PI / 2 + pitch, yaw, 0, 'ZYX');
        let quaternion = new Quaternion().setFromEuler(euler);
        this._camera.updateProjectionMatrix();
        this._camera.quaternion.copy(quaternion);
        this._camera.position.copy(position);
    }
    _update(overrideTarget) {
        if (!this.shouldIgnoreStandardBehavior) {
            super._update(overrideTarget);
        }
        else {
            this._saveYawAndPitch();
        }
    }
    animateCamera(delta) {
        if (!this.shouldIgnoreStandardBehavior) {
            return super.animateCamera(delta);
        }
        else {
            return true;
        }
    }
}

class GLBViewerLightSetting extends LightSetting {
    constructor(scene, oldLightSetting) {
        super(scene, oldLightSetting);
        this._params = {
            ambientLight: {
                color: '#ffffff',
            },
        };
        this._ambientLight = new AmbientLight(new Color(this._params.ambientLight.color), 0.5);
        this.addToScene();
    }
    addToScene() {
        this._scene.add(this._ambientLight);
    }
    removeFromScene() {
        this._scene.remove(this._ambientLight);
    }
    reload() {
        this.removeFromScene();
        this.addToScene();
    }
    showGUI() {
        let gui = getGUI();
        if (!gui) {
            return;
        }
        if (this._ambientLight) {
            let ambiLight = gui.addFolder('Ambient Light');
            ambiLight.add(this._ambientLight, 'visible');
            ambiLight
                .add(this._ambientLight, 'intensity')
                .min(0)
                .max(5)
                .step(0.1);
            ambiLight
                .addColor(this._params.ambientLight, 'color')
                .onChange((color) => {
                this._ambientLight.color = new Color(color);
            });
        }
    }
}

class GLBViewerSceneManager extends SceneManager {
    constructor(creator, offset) {
        super(creator, offset, CANVAS_ID.GLB, CAMERA_TYPE.CAMERA_3D);
        this._itemsCount = 0;
        this._standardSceneBackgroundColor = this._scene.background;
        if (this._initData.legacyLight) {
            if (this._renderer.capabilities.maxTextures > 8) {
                this.loadDynamicLightSetting(DynamicLightSettingLoader.createDynamicLightSettingSource(null, PREDEFINED_LIGHTSETTING.CAMERA));
            }
            else {
                console.warn('this device has a maximum of 8 texture units thus we are using a simpler light setting');
                this._lightSetting = new GLBViewerLightSetting(this._scene);
            }
        }
    }
    createCameraControl(_mode, _offset) {
        this._cameraControl = new AdjustableCameraControl3D(this._creator_, this._getInputManager(), new Vector3(-1, 1, 1));
    }
    _getInputManager() {
        return this._glbInputManager;
    }
    async loadStaticItem(id, callback) {
        const rapiItem = await this._rapiAccess.getItem(id);
        if (rapiItem.configuration) {
            return Promise.reject();
        }
        const glbUrl = getGlbUrl(rapiItem);
        if (!glbUrl) {
            return Promise.reject(new Error('GLB Url not detected'));
        }
        return this.loadGLB(glbUrl, true, undefined, callback);
    }
    loadGLB(url, automaticallyAdjustCamera = true, scaling = new Vector3(1, 1, 1), callback) {
        this.clearScene();
        return new Promise((resolve, reject) => {
            this._loadGLB(url, new Vector3(0, 0, 0), 0, undefined, scaling, undefined, undefined, callback).then((glb) => {
                this._currentGLB = glb;
                this._scene.add(this._currentGLB);
                let boundingBox = new Box3().setFromObject(this._currentGLB);
                if (automaticallyAdjustCamera) {
                    let center = boundingBox.getCenter(new Vector3());
                    if (this._cameraControl instanceof AdjustableCameraControl3D) {
                        this._cameraControl.updateToBounds(boundingBox, false, true, center);
                        this._cameraControl.reset(boundingBox, center, -15, 0);
                    }
                }
                this._updateBounds(boundingBox, true);
                resolve();
            }, reject);
        });
    }
    preparePerspectiveImage(renderer, width, height) {
        return new Promise((resolve) => {
            if (!width) {
                width = 1000;
            }
            if (!height) {
                height = 1000;
            }
            if (!renderer) {
                renderer = new WebGLRenderer({ antialias: true });
                renderer.setSize(width, height);
                renderer.outputColorSpace = SRGBColorSpace;
                renderer.autoClear = false;
                renderer.shadowMap.enabled = true;
                renderer.shadowMap.type = BasicShadowMap;
            }
            let camera = this._cameraControl.getCamera().clone();
            if (camera instanceof PerspectiveCamera) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
            }
            this._lightSetting.removeFromScene();
            let defaultLightSetting = new DefaultLightSetting(this._scene);
            renderer.render(this._scene, camera);
            let image = renderer.domElement.toDataURL();
            renderer.domElement.toBlob((blob) => {
                resolve({ image, width, height, blob });
            }, 'image/png');
            defaultLightSetting.removeFromScene();
            this._lightSetting.addToScene();
            // }
        });
    }
    adjustCamera(position, yaw, pitch, fov) {
        if (this._cameraControl instanceof AdjustableCameraControl3D) {
            let boundingBox = new Box3().setFromObject(this._scene);
            let bounds = boundingBox.getSize(new Vector3());
            this._cameraControl.adjust(bounds, position, yaw, pitch, fov);
            this._requestRender();
        }
    }
    onStart(count) {
        this._itemsCount = count;
        this._scene.background = null;
        if (this._cameraControl instanceof AdjustableCameraControl3D) {
            this._cameraControl.shouldIgnoreStandardBehavior = true;
        }
        console.log('start processing ' + count + ' items');
    }
    onElementFinished(itemsFinished) {
        console.log('processed ' +
            itemsFinished +
            ' of ' +
            this._itemsCount +
            ' items (' +
            Math.round((100 / this._itemsCount) * itemsFinished) +
            '%)');
    }
    onFinished(_zip) {
        this._scene.background = this._standardSceneBackgroundColor;
        if (this._cameraControl instanceof AdjustableCameraControl3D) {
            this._cameraControl.shouldIgnoreStandardBehavior = false;
        }
    }
    clearScene() {
        if (this._currentGLB) {
            this._scene.remove(this._currentGLB);
            dispose(this._currentGLB);
            this._currentGLB = null;
        }
        super.clearScene();
    }
    enableHD() {
        super.enableHD();
    }
    sceneChanged() {
        //override when needed
    }
    getBounds() {
        if (!this._currentGLB) {
            return null;
        }
        return new Box3().setFromObject(this._currentGLB);
    }
}
__decorate([
    inject
], GLBViewerSceneManager.prototype, "_glbInputManager", void 0);
__decorate([
    inject
], GLBViewerSceneManager.prototype, "_rapiAccess", void 0);

class GLBRenderWorker {
    constructor(sceneManager, width, height) {
        this._prefix = 'https://furniture.roomle.com/3d/glb/';
        this._listeners = new Set();
        this._finishedItems = 0;
        this._sceneManager = sceneManager;
        this._renderer = new WebGLRenderer({ antialias: true, alpha: true });
        this._width = width;
        this._height = height;
        this._renderer.setSize(width, height);
        this._renderer.setClearColor(0xffffff, 0);
        this._renderer.outputColorSpace = SRGBColorSpace;
    }
    addListener(listener) {
        this._listeners.add(listener);
    }
    removeListener(listener) {
        this._listeners.delete(listener);
    }
    start(entries) {
        this._entries = [];
        entries.forEach((entry) => {
            this._entries.push(this._transform(entry)); // {name: url.replace('.glb', '.png'), url: this._prefix + url}
        });
        this._finishedItems = 0;
        this._listeners.forEach((listener) => listener.onStart(this._entries.length));
        this._zip = new window.JSZip();
        this._doNextEntry();
        return new Promise((resolve) => {
            this._resolve = resolve;
        });
    }
    _transform(entry) {
        return {
            name: entry.path.replace('.glb', '.png'),
            url: this._prefix + entry.path,
            position: new Vector3(entry.camera.position.x, entry.camera.position.z, -entry.camera.position.y),
            fov: entry.camera.fieldOfView * 2,
            yaw: entry.camera.rotation.z,
            pitch: entry.camera.rotation.x,
        };
    }
    _doNextEntry() {
        if (this._entries.length === 0) {
            this._listeners.forEach((listener) => listener.onFinished(this._zip));
            this._resolve(this._zip);
        }
        else {
            this._processEntry(this._entries[0]);
        }
    }
    _processEntry(entry) {
        this._sceneManager.loadGLB(entry.url, false, undefined).then(() => {
            this._sceneManager.adjustCamera(entry.position, entry.yaw, entry.pitch, entry.fov);
            this._sceneManager
                .preparePerspectiveImage(this._renderer, this._width, this._height)
                .then((base64Image) => {
                this._entryFinished(entry, base64Image);
            });
        });
    }
    _entryFinished(entry, base64Image) {
        let index = this._entries.indexOf(entry);
        if (index > -1) {
            this._entries.splice(index, 1);
        }
        this._finishedItems++;
        this._listeners.forEach((listener) => listener.onElementFinished(this._finishedItems));
        this._zip.file(entry.name, base64Image.blob);
        this._doNextEntry();
    }
}

var JS_ZIP_FILE_NAME = "static/jszip.min-c96375d50e72b199.js";

class RoomleGLBViewer {
    constructor(creator) {
        this._currentIdOrUrl = null;
        this._creator_ = creator;
    }
    setCameraOffset(offset) {
        this._sceneManager.setCameraOffset(offset);
    }
    getCameraOffset() {
        return this._sceneManager.getCameraOffset();
    }
    init(element, initData) {
        this.setOverrides(initData);
        this._domHelper.setDomElement(element);
        if (this._sceneManager) {
            this._lifeCycleManager.resume();
            return Promise.resolve();
        }
        return new Promise(this._initPromiseCallback.bind(this));
    }
    _initPromiseCallback(resolve, _reject) {
        // three-refactor - ?
        Promise.all([
            this._scriptLoader.fetch(TWEEN_FILE_NAME, { id: 'tween-js' }),
        ]).then(() => {
            this._sceneManager = new GLBViewerSceneManager(this._creator_, {
                left: 0,
                top: 1,
                right: 1,
                bottom: 0,
            });
            // this.loadGLB('https://furniture.roomle.com/3d/glb/furniture/vitra/41206600/41206600.glb');
            this._sceneManager.enableHD();
            resolve();
        });
    }
    /**
     * Remove the current glb from the scene if it exists
     */
    clearScene() {
        this._sceneManager.clearScene();
    }
    /**
     * Loads the GLB from the given URL Param
     * @param url
     * @param scaling defaults to 1
     * @param callback loading percent between 0 and 1
     */
    loadGLB(url, scaling = 1, callback) {
        this._currentIdOrUrl = url;
        this._rapiAccess.trackView(url);
        return this._sceneManager.loadGLB(url, true, new Vector3(scaling, scaling, scaling), callback);
    }
    /**
     * Loads the glb asset from the static item
     * @param staticItemId
     * @param callback loading percent between 0 and 1
     */
    loadStaticItem(staticItemId, callback) {
        this._currentIdOrUrl = staticItemId;
        this._rapiAccess.trackView(staticItemId);
        return this._sceneManager.loadStaticItem(staticItemId, callback);
    }
    /**
     * Returns the current item id or url of the loaded object
     */
    getCurrentId() {
        return this._currentIdOrUrl;
    }
    /**
     * Loads a SceneSettings object, currently it can can contain a light setting definition
     * (see {@link @roomle/web-sdk/configurator-core/src/roomle-configurator#RoomleConfigurator.loadDynamicLightSetting}) and an environment definition (see {@link @roomle/web-sdk/common-core/src/environment/dynamic-environment-setting-loader#EnvironmentSetting}).
     * @param sceneSettings
     */
    loadSceneSetting(sceneSettings) {
        return this._sceneManager.loadSceneSettings(sceneSettings);
    }
    preparePerspectiveImage() {
        return this._sceneManager.preparePerspectiveImage();
    }
    processRenderList(jsonString, width = 320, height = 320) {
        let object = JSON.parse(jsonString);
        this._scriptLoader.fetch(JS_ZIP_FILE_NAME, { id: 'jszip-js' }).then(() => {
            let worker = new GLBRenderWorker(this._sceneManager, width, height);
            worker.addListener(this._sceneManager);
            worker.start(object.items).then((zip) => {
                zip.generateAsync({ type: 'blob' }).then((content) => {
                    download('content.zip', URL.createObjectURL(content));
                    worker.removeListener(this._sceneManager);
                });
            });
        });
    }
    setOverrides(initData) {
        if (!initData) {
            return;
        }
        this._initData.setOverrides(initData);
        this._globalInitData.setOverrides(initData);
    }
    updateSize() {
        this._sceneManager.updateCamera();
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
    resumeTest(element) {
        this._domHelper.setDomElement(element);
        this._lifeCycleManager.resume();
    }
    pauseTest() {
        this._lifeCycleManager.pause();
    }
    showGUI() {
        this._sceneManager.showGUI();
    }
    get callbacks() {
        return {};
    }
    getScene() {
        return this._sceneManager.getScene();
    }
    updateScene() {
        this._sceneManager.updateScene();
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
    setEnvironmentMap(params) {
        const { url, intensity, rotation, maxLightSources } = params;
        this._sceneManager.setEnvironmentMap(url, intensity, rotation, maxLightSources);
    }
}
__decorate([
    inject
], RoomleGLBViewer.prototype, "_rapiAccess", void 0);
__decorate([
    inject
], RoomleGLBViewer.prototype, "_domHelper", void 0);
__decorate([
    inject
], RoomleGLBViewer.prototype, "_scriptLoader", void 0);
__decorate([
    inject
], RoomleGLBViewer.prototype, "_lifeCycleManager", void 0);
__decorate([
    inject
], RoomleGLBViewer.prototype, "_initData", void 0);
__decorate([
    inject
], RoomleGLBViewer.prototype, "_globalInitData", void 0);
__decorate([
    inject
], RoomleGLBViewer.prototype, "_unitFormatter", void 0);
__decorate([
    inject
], RoomleGLBViewer.prototype, "_idbManager", void 0);

class GlbViewer extends Main {
    setupGlobals() {
        //globals are initialized in bootFinished()
    }
    setupDependencies() {
        RoomleDependencyInjection.setup(INJECTABLES);
        this.lookup('logger', this._context);
    }
    cleanUpGlobals() {
        throw new Error('Method not implemented.');
    }
    cleanUpDependencies() {
        throw new Error('Method not implemented.');
    }
    bootFinished() {
        this._viewer = new RoomleGLBViewer(this._context);
        if (!window.RoomleGLBViewer) {
            window.RoomleGLBViewer = this._viewer;
        }
    }
    getApi() {
        return this._viewer;
    }
    getContextName() {
        return "glb-viewer" /* BASE_CONTEXT.GLB_VIEWER */;
    }
}

export { GlbViewer };
//# sourceMappingURL=glb-viewer-f5b55b10.js.map
