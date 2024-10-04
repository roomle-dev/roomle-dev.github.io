import { S as ScriptLoader, M as Main } from './script-loader-d6791558.js';
import { _ as __decorate, i as inject, e as CANVAS_ID, j as DynamicLightSettingLoader, k as PREDEFINED_LIGHTSETTING, M as MaterialCreator, au as setMaterial, av as getMaterialShading, Q as getGUI, aw as addExistingTexture, O as addTexture, ax as UiCallback, D as DependencyInjectionAssignment, L as Logger, as as InputManager, ay as ConfiguratorMeshGenerator, R as RapiAccess, b as RoomleDependencyInjection } from './roomle-dependency-injection-56c1d591.js';
import { S as SceneManager, B as BackgroundEnvironment, C as CameraControl3D, F as FloorEnvironment, T as TWEEN_FILE_NAME } from './scene-manager-2a6437e2.js';
import { aE as CAMERA_TYPE, aN as BoxGeometry, z as Mesh, C as Color, ad as Box3, a as Vector3, w as DoubleSide, a7 as FrontSide, a_ as SphereGeometry, b8 as PlaneGeometry, a9 as Texture } from './main-thread-to-worker-8a755a37.js';
import './query-params-helper-f12b7599.js';

const SIZE = { x: 1, y: 1, z: 1 };
class MaterialViewerSceneManager extends SceneManager {
    constructor(creator, offset) {
        super(creator, offset, CANVAS_ID.RMV, CAMERA_TYPE.CAMERA_3D);
        this._sceneParams = {
            type: "cube" /* GEOMETRY.CUBE */,
        };
        this._materialParams = {
            color: '#ffffff',
            metallic: 0.5,
            alpha: 0,
            alphaCutoff: 0,
            doubleSided: false,
        };
        if (this._renderer.capabilities.maxTextures > 8) {
            this.loadDynamicLightSetting(DynamicLightSettingLoader.createDynamicLightSettingSource(null, PREDEFINED_LIGHTSETTING.CAMERA));
        }
        this._initScene();
    }
    _initScene() {
        const geometry = new BoxGeometry(SIZE.x, SIZE.y, SIZE.z, 100, 100, 100);
        const meshPhysicalMaterial = MaterialCreator.createMeshPhysicalMaterial({
            color: this._initData.colors.PRIMARY,
        });
        this._setMaterial(meshPhysicalMaterial);
        this._mesh = new Mesh(geometry, this._material);
        this._mesh.castShadow = true;
        this._mesh.position.setY(SIZE.y / 2);
        this._scene.add(this._mesh);
        const { initialFloorMaterial } = this._initData;
        if (initialFloorMaterial) {
            this.changeFloorMaterialById(initialFloorMaterial);
        }
        else {
            this._environment = new BackgroundEnvironment(this._scene, null, new Color(0xffffff));
        }
        if (this._cameraControl instanceof CameraControl3D) {
            const boundingBox = new Box3();
            boundingBox.setFromObject(this._mesh);
            this._cameraControl.updateAndReset(boundingBox.getSize(new Vector3()), boundingBox.getCenter(new Vector3()));
        }
        this.showGUI();
    }
    loadMaterialId(materialId) {
        return new Promise((resolve) => {
            this._configuratorMeshGenerator
                .loadMaterial(materialId, SIZE.x * 1000, SIZE.y * 1000)
                .then((material) => {
                this._setMaterial(material);
                this._mesh.material = this._material;
                this._updateGUI();
                this._requestRender();
                resolve();
            });
        });
    }
    loadMaterial(material) {
        return new Promise((resolve) => {
            // eslint-disable-next-line
            if (!material.__rapi_path__) {
                // eslint-disable-next-line
                material.__rapi_path__ = 'materials';
            }
            this._mesh.material = this._material;
            this._configuratorMeshGenerator
                .loadTextures(material, this._material, SIZE.x * 100, SIZE.y * 100)
                .then(() => {
                this._updateGUI();
                this._requestRender();
            });
            resolve();
        });
    }
    loadMaterialShading(materialShading) {
        return new Promise((resolve) => {
            let material = { shading: materialShading };
            this._setMaterial(setMaterial(this._material, material));
            this._mesh.material = this._material;
            this._updateGUI();
            this._requestRender();
            resolve();
        });
    }
    _setMaterial(material) {
        this._material = material;
        this._materialParams.alpha = material.opacity;
        this._materialParams.alphaCutoff = material.alphaTest;
        this._materialParams.color = '#' + material.color.getHexString();
        this._materialParams.doubleSided = material.side === DoubleSide;
        this._materialParams.metallic =
            material.metalness === 1 ? 1 : material.reflectivity;
    }
    getMaterialShading(version = 1) {
        return getMaterialShading(this._material, version);
    }
    createCameraControl(_mode, _offset) {
        this._cameraControl = new CameraControl3D(this._creator_, this._getInputManager(), new Vector3(-1, 1, 1));
    }
    _getInputManager() {
        return this._inputManager;
    }
    sceneChanged() {
        //override when needed
    }
    getBounds() {
        if (!this._mesh) {
            return null;
        }
        return new Box3().setFromObject(this._mesh);
    }
    _guiLoaded() {
        this._updateGUI();
    }
    _updateGUI() {
        let gui = getGUI();
        if (!gui) {
            return;
        }
        if (!this._guiGeometryFolder) {
            this._guiGeometryFolder = gui.addFolder('Geometry');
            this._guiGeometryFolder
                .add(this._sceneParams, 'type', {
                Cube: "cube" /* GEOMETRY.CUBE */,
                Sphere: "sphere" /* GEOMETRY.SPHERE */,
                PlaneVertical: "plane_vertical" /* GEOMETRY.PLANE_VERTICAL */,
                PlaneHorizontal: "plane_horizontal" /* GEOMETRY.PLANE_HORIZONTAL */,
            })
                .onChange((type) => {
                console.log(type);
                this._setGeometry();
            });
        }
        if (this._material) {
            if (this._guiMaterialFolder) {
                gui.removeFolder(this._guiMaterialFolder);
            }
            this._guiMaterialFolder = gui.addFolder('Material');
            this._guiMaterialFolder
                .addColor(this._materialParams, 'color')
                .onChange((color) => {
                this._material.color = new Color(color);
                this._shadingChanged();
            });
            this._guiMaterialFolder
                .add(this._materialParams, 'metallic')
                .min(0)
                .max(1)
                .step(0.01)
                .onChange((metallic) => {
                this._material.metalness = metallic === 1 ? 1 : 0.5;
                this._material.reflectivity = metallic || 0.5;
                this._shadingChanged();
            });
            this._guiMaterialFolder
                .add(this._material, 'roughness')
                .min(0)
                .max(1)
                .step(0.01)
                .onChange((_roughness) => {
                this._shadingChanged();
            });
            this._guiMaterialFolder
                .add(this._material, 'transmission')
                .min(0)
                .max(1)
                .step(0.01)
                .onChange((transmission) => {
                this._material.transmission = transmission;
                if (transmission > 0) {
                    this._material.opacity = 1;
                    this._material.alphaTest = 0.5;
                    this._material.depthWrite = false;
                    this._material.transparent = true;
                    this._material.metalness = 0;
                }
                this._mesh.castShadow = !this._material.transparent;
                this._shadingChanged();
            });
            this._guiMaterialFolder
                .add(this._materialParams, 'alpha')
                .min(0)
                .max(1)
                .step(0.01)
                .onChange((alpha) => {
                this._material.transparent = alpha < 1;
                this._material.opacity = alpha;
                this._material.depthWrite = alpha >= 1;
                this._mesh.castShadow = !this._material.transparent;
                this._shadingChanged();
            });
            this._guiMaterialFolder
                .add(this._materialParams, 'alphaCutoff')
                .min(0)
                .max(1)
                .step(0.01)
                .onChange((alphaCutoff) => {
                if (alphaCutoff) {
                    this._material.alphaTest = alphaCutoff;
                }
                else {
                    this._material.alphaTest = 0;
                }
                this._shadingChanged();
            });
            this._guiMaterialFolder
                .add(this._materialParams, 'doubleSided')
                .onChange((doubleSided) => {
                if (doubleSided) {
                    this._material.side = DoubleSide;
                }
                else {
                    this._material.side = FrontSide;
                }
                this._shadingChanged();
            });
        }
        this._addGUIListener(gui);
    }
    _shadingChanged() {
        this._roomleMaterialViewerUiCallback.onMaterialShadingChanged(getMaterialShading(this._material));
    }
    setGeometry(type) {
        this._sceneParams.type = type;
        this._setGeometry();
    }
    _setGeometry() {
        let geometry;
        if (this._sceneParams.type === "cube" /* GEOMETRY.CUBE */) {
            geometry = new BoxGeometry(SIZE.x, SIZE.y, SIZE.z, 100, 100, 100);
        }
        if (this._sceneParams.type === "sphere" /* GEOMETRY.SPHERE */) {
            geometry = new SphereGeometry(0.5, 100, 100);
        }
        if (this._sceneParams.type === "plane_horizontal" /* GEOMETRY.PLANE_HORIZONTAL */) {
            geometry = new PlaneGeometry(SIZE.x, SIZE.z);
            geometry.rotateX(-Math.PI / 2);
        }
        if (this._sceneParams.type === "plane_vertical" /* GEOMETRY.PLANE_VERTICAL */) {
            geometry = new PlaneGeometry(SIZE.x, SIZE.z);
        }
        this._mesh.geometry = geometry;
        this._renderEverything();
    }
    async changeFloorMaterialById(materialId) {
        const material = await this._rapiAccess.getMaterial(materialId);
        if (!this._environment ||
            !(this._environment instanceof FloorEnvironment)) {
            this._environment = new FloorEnvironment(this._scene, this._environment, true);
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
    async addTexture(rapiTexture, base64Image) {
        const width = SIZE.x * 100;
        const height = SIZE.y * 100;
        const repeatWidth = width / (rapiTexture.mmWidth === 0 ? 1 : rapiTexture.mmWidth);
        const repeatHeight = height / (rapiTexture.mmHeight === 0 ? 1 : rapiTexture.mmHeight);
        if (base64Image) {
            const image = new Image();
            image.src = base64Image;
            const texture = new Texture();
            texture.image = image;
            image.onload = function () {
                texture.needsUpdate = true;
            };
            addExistingTexture(texture, rapiTexture, this._material, this._maxAnisotropy, repeatWidth, repeatHeight, this._renderer.capabilities.maxTextures);
        }
        else {
            await addTexture(rapiTexture.image, rapiTexture, this._material, this._maxAnisotropy, repeatWidth, repeatHeight, this._renderer.capabilities.maxTextures);
        }
        this._requestRender();
    }
    removeTexture(rapiTexture) {
        if (rapiTexture.mapping === "ORM" /* RAPI_TEXTURE_TYPE.ORM */) {
            this._material.aoMap = null;
            this._material.roughnessMap = null;
            this._material.metalnessMap = null;
        }
        if (rapiTexture.mapping === "RGB" /* RAPI_TEXTURE_TYPE.RGB */ ||
            rapiTexture.mapping === "RGBA" /* RAPI_TEXTURE_TYPE.RGBA */) {
            this._material.map = null;
        }
        if (rapiTexture.mapping === "XYZ" /* RAPI_TEXTURE_TYPE.XYZ */) {
            this._material.normalMap = null;
        }
        this._material.needsUpdate = true;
        this._requestRender();
    }
    clearCache() {
        this._configuratorMeshGenerator.clear();
    }
}
__decorate([
    inject
], MaterialViewerSceneManager.prototype, "_inputManager", void 0);
__decorate([
    inject
], MaterialViewerSceneManager.prototype, "_configuratorMeshGenerator", void 0);
__decorate([
    inject
], MaterialViewerSceneManager.prototype, "_roomleMaterialViewerUiCallback", void 0);
__decorate([
    inject
], MaterialViewerSceneManager.prototype, "_rapiAccess", void 0);

class RoomleMaterialViewer {
    constructor(creator) {
        this._creator_ = creator;
    }
    setCameraOffset(offset) {
        this._sceneManager.setCameraOffset(offset);
    }
    getCameraOffset() {
        return this._sceneManager.getCameraOffset();
    }
    init(element) {
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
            this._sceneManager = new MaterialViewerSceneManager(this._creator_, {
                left: 0,
                top: 1,
                right: 1,
                bottom: 0,
            });
            this._sceneManager.enableHD();
            resolve();
        });
    }
    get callbacks() {
        return this._roomleMaterialViewerUiCallback;
    }
    set callbacks(callback) {
        this._roomleMaterialViewerUiCallback = callback;
    }
    loadMaterialShading(materialShading) {
        return this._sceneManager.loadMaterialShading(materialShading);
    }
    loadMaterial(material, options = {}) {
        if (options.flushCache) {
            this._clearCaches();
        }
        return this._sceneManager.loadMaterial(material);
    }
    loadMaterialId(materialId, options = {}) {
        if (options.flushCache) {
            this._clearCaches();
        }
        return this._sceneManager.loadMaterialId(materialId);
    }
    getMaterialShading(version = 1) {
        return this._sceneManager.getMaterialShading(version);
    }
    /**
     * Loads a SceneSettings object, currently it can can contain a light setting definition
     * (see {@link @roomle/web-sdk/configurator-core/src/roomle-configurator#RoomleConfigurator.loadDynamicLightSetting}) and an environment definition (see {@link @roomle/web-sdk/common-core/src/environment/dynamic-environment-setting-loader#EnvironmentSetting}).
     * @param sceneSettings
     */
    loadSceneSetting(sceneSettings) {
        return this._sceneManager.loadSceneSettings(sceneSettings);
    }
    setOverrides(initData) {
        if (!initData) {
            return;
        }
        this._initData.setOverrides(initData);
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
        return this._sceneManager.changeFloorMaterialById(materialId);
    }
    /**
     * Set the geometry of the demo material mesh
     *
     * Possible parameter:
     * 'cube',
     * 'sphere',
     * 'plane_vertical',
     * 'plane_horizontal'
     *
     * @param type
     */
    setGeometry(type) {
        this._sceneManager.setGeometry(type);
    }
    /**
     * Set a texture on the demo material, if no base64Image is set, the image field of rapiTexture is used
     * @param rapiTexture
     * @param base64Image for example "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPj/HwADBwIAMCbHYQAAAABJRU5ErkJggg=="
     */
    async addTexture(rapiTexture, base64Image) {
        return this._sceneManager.addTexture(rapiTexture, base64Image);
    }
    /**
     * Remove texture from the demo material
     * @param rapiTexture
     */
    removeTexture(rapiTexture) {
        return this._sceneManager.removeTexture(rapiTexture);
    }
    _clearCaches() {
        this._rapiAccess.cleanUp();
        this._sceneManager.clearCache();
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
], RoomleMaterialViewer.prototype, "_domHelper", void 0);
__decorate([
    inject
], RoomleMaterialViewer.prototype, "_scriptLoader", void 0);
__decorate([
    inject
], RoomleMaterialViewer.prototype, "_lifeCycleManager", void 0);
__decorate([
    inject
], RoomleMaterialViewer.prototype, "_roomleMaterialViewerUiCallback", void 0);
__decorate([
    inject
], RoomleMaterialViewer.prototype, "_initData", void 0);
__decorate([
    inject
], RoomleMaterialViewer.prototype, "_rapiAccess", void 0);
__decorate([
    inject
], RoomleMaterialViewer.prototype, "_unitFormatter", void 0);
__decorate([
    inject
], RoomleMaterialViewer.prototype, "_idbManager", void 0);

/* eslint-disable @typescript-eslint/no-unused-vars */
class RoomleMaterialViewerUiCallback extends UiCallback {
    constructor(creator) {
        super(creator);
        /**
         * Gets called when a material parameter has been changed using the graphical user interface
         * @param materialShading
         */
        this.onMaterialShadingChanged = (materialShading) => undefined;
    }
}

const INJECTABLES = [
    new DependencyInjectionAssignment('script-loader', ScriptLoader),
    new DependencyInjectionAssignment('logger', Logger),
    new DependencyInjectionAssignment('input-manager', InputManager, 1 /* DI_TYPE.CONTEXT */),
    new DependencyInjectionAssignment('configurator-mesh-generator', ConfiguratorMeshGenerator),
    new DependencyInjectionAssignment('rapi-access', RapiAccess),
    new DependencyInjectionAssignment('roomle-material-viewer-ui-callback', RoomleMaterialViewerUiCallback, 1 /* DI_TYPE.CONTEXT */),
];

class MaterialViewer extends Main {
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
        this._viewer = new RoomleMaterialViewer(this._context);
        if (!window.RoomleMaterialViewer) {
            window.RoomleMaterialViewer = this._viewer;
        }
    }
    getApi() {
        return this._viewer;
    }
    getContextName() {
        return "material-viewer" /* BASE_CONTEXT.MATERIAL_VIEWER */;
    }
}

export { MaterialViewer };
//# sourceMappingURL=material-viewer-a2a40db3.js.map
