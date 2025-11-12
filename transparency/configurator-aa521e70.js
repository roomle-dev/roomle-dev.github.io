import { S as ScriptLoader, M as Main } from './script-loader-ab23f4ec.js';
import { D as DependencyInjectionAssignment, L as Logger, R as RapiAccess, a as DataSyncer, C as ConfiguratorViewModel, b as RoomleDependencyInjection, A as AppContext } from './roomle-dependency-injection-0a65a99a.js';
import { C as CameraControl3D, a as CameraControl } from './scene-manager-13a40131.js';
import ComponentRaycastHelper from './component-raycast-helper-1d0e0e19.js';
import { C as ConfiguratorSceneManager, R as RoomleConfigurator } from './roomle-configurator-bba8fcb1.js';
import './query-params-helper-f12b7599.js';
import './main-thread-to-worker-8a755a37.js';
import './default-light-setting-4c25cd12.js';

const INJECTABLES = [
    new DependencyInjectionAssignment('logger', Logger),
    new DependencyInjectionAssignment('rapi-access', RapiAccess),
    new DependencyInjectionAssignment('script-loader', ScriptLoader),
    new DependencyInjectionAssignment('camera-control-3d', CameraControl3D),
    new DependencyInjectionAssignment('camera-control', CameraControl),
    new DependencyInjectionAssignment('data-syncer', DataSyncer),
    new DependencyInjectionAssignment('configurator-scene-manager', ConfiguratorSceneManager, 1 /* DI_TYPE.CONTEXT */),
    new DependencyInjectionAssignment('configurator-view-model', ConfiguratorViewModel, 1 /* DI_TYPE.CONTEXT */),
    new DependencyInjectionAssignment('component-raycast-helper', ComponentRaycastHelper, 0 /* DI_TYPE.GLOBAL */),
];

class Configurator extends Main {
    setupDependencies() {
        RoomleDependencyInjection.setup(INJECTABLES);
        // This needs to be done so that subscribe to events is done
        const plannerKernelAccess = this.lookup('planner-kernel-access', this._context);
        plannerKernelAccess.init(1 /* KERNEL_TYPE.CONFIGURATOR */);
        this.lookup('rapi-access', this._context);
        this.lookup('script-loader', this._context);
        this.lookup('logger', this._context);
    }
    cleanUpGlobals() {
        delete window.RoomleConfigurator;
    }
    cleanUpDependencies() {
        const scriptLoader = this.lookup('script-loader');
        const rapiAccess = this.lookup('rapi-access');
        this.lookup('dom-helper');
        const sceneManager = this.lookup('configurator-scene-manager');
        if (scriptLoader) {
            scriptLoader.cleanUp();
        }
        if (rapiAccess) {
            rapiAccess.cleanUp();
        }
        if (sceneManager) {
            sceneManager.cleanUp();
        }
    }
    setupGlobals(appState) {
        const { kernelInstance, kernelContainer, planObjectId } = appState || {};
        AppContext.init({ kernelInstance, kernelContainer, planObjectId });
    }
    getApi() {
        return this._configurator;
    }
    bootFinished() {
        this._configurator = new RoomleConfigurator(this._context);
        this._configurator.getMain = () => {
            return this;
        };
        if (!window.RoomleConfigurator) {
            window.RoomleConfigurator = this._configurator;
        }
    }
    getContextName() {
        return "configurator" /* BASE_CONTEXT.CONFIGURATOR */;
    }
}

export { Configurator };
//# sourceMappingURL=configurator-aa521e70.js.map
