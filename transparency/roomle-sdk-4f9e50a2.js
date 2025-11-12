import { b as RoomleDependencyInjection, D as DependencyInjectionAssignment, R as RapiAccess, az as GlobalCallback, aA as GlobalInitData, aB as InitData } from './roomle-dependency-injection-56c1d591.js';
import './main-thread-to-worker-8a755a37.js';

// THIS IS NEEDED TO MAKE SURE FOR EVERY MODULE WE ARE CREATING A FILE IS TRANSPILED
// WHICH CAN BE CONSUMED VIA SDK
// eslint-disable variable-name
class RoomleSdk {
    static getConfigurator(initData, context) {
        context = this._setupDI("configurator" /* BASE_CONTEXT.CONFIGURATOR */, initData, context);
        return new Promise((resolve, reject) => import('./configurator-def89ac2.js').then(({ Configurator: ConfiguratorClass }) => resolve(new ConfiguratorClass(context)), reject));
    }
    static getPlanner(initData, context) {
        context = this._setupDI("planner" /* BASE_CONTEXT.PLANNER */, initData, context);
        return new Promise((resolve, reject) => import('./planner-3a00b2d8.js').then(({ Planner: PlannerClass }) => resolve(new PlannerClass(context)), reject));
    }
    static async getGlbViewer(initData, context) {
        context = this._setupDI("glb-viewer" /* BASE_CONTEXT.GLB_VIEWER */, initData, context);
        return new Promise((resolve, reject) => import('./glb-viewer-2434c9df.js').then(({ GlbViewer: GlbViewerClass }) => resolve(new GlbViewerClass(context)), reject));
    }
    static getMaterialViewer(initData, context) {
        context = this._setupDI("configurator" /* BASE_CONTEXT.CONFIGURATOR */, initData, context);
        return new Promise((resolve, reject) => import('./material-viewer-a2a40db3.js').then(({ MaterialViewer: MaterialViewerClass }) => resolve(new MaterialViewerClass(context)), reject));
    }
    static getCoreTools(initData, context) {
        context = this._setupDI("tools-core" /* BASE_CONTEXT.TOOLS_CORE */, initData, context);
        return new Promise((resolve, reject) => import('./tools-core-995cf039.js').then(({ ToolsCore: ToolsCoreClass }) => {
            const toolsCore = new ToolsCoreClass(context);
            toolsCore.boot();
            resolve(toolsCore);
        }, reject));
    }
    /**
     * Get a rapi access instance
     * If you want to set used locale or tenant you have to call setGlobalInitData first
     */
    static getRapiAccess() {
        RoomleDependencyInjection.addToContainer([
            new DependencyInjectionAssignment('rapi-access', RapiAccess, 0 /* DI_TYPE.GLOBAL */),
            new DependencyInjectionAssignment('global-callback', GlobalCallback, 0 /* DI_TYPE.GLOBAL */),
        ]);
        return Promise.resolve(RoomleDependencyInjection.lookup('rapi-access'));
    }
    /**
     * Get the global callback instance
     * this is helpful if you want to listen to callbacks which are triggered
     * globally, e.g.: onNetworkRequest
     */
    static get callbacks() {
        RoomleDependencyInjection.addToContainer([
            new DependencyInjectionAssignment('global-callback', GlobalCallback, 0 /* DI_TYPE.GLOBAL */),
        ]);
        return Promise.resolve(RoomleDependencyInjection.lookup('global-callback'));
    }
    /**
     * Set global init data params like locale or tenant
     * @param initData
     */
    static setGlobalInitData(globalInitData) {
        if (globalInitData) {
            RoomleDependencyInjection.addToContainer([
                new DependencyInjectionAssignment('global-init-data', GlobalInitData, 0 /* DI_TYPE.GLOBAL */),
            ]);
            const globalInitDataDI = RoomleDependencyInjection.lookup('global-init-data');
            globalInitDataDI.setOverrides(globalInitData);
        }
    }
    /**
     * Pass in the desired context name and you'll get back a unique context name which does not exist yet.
     * @param contextName
     */
    static getContext(contextName) {
        return RoomleDependencyInjection.getContext(contextName);
    }
    /**
     * Sets up dependency injection and adds init data. if init data is not set it will return undefined.
     * This means the context will be set in the instantiated classes.
     * @param contextName
     * @param initData
     * @param context
     * @private
     */
    static _setupDI(contextName, initData, context) {
        if (initData) {
            RoomleDependencyInjection.addToContainer([
                new DependencyInjectionAssignment('init-data', InitData, 1 /* DI_TYPE.CONTEXT */),
            ]);
            if (!context) {
                context = RoomleDependencyInjection.getContext(contextName);
            }
            const initDataDI = RoomleDependencyInjection.lookup('init-data', context);
            initDataDI.setOverrides(initData);
        }
        return context;
    }
}
// eslint:enable:variable-name

export { RoomleSdk as default };
//# sourceMappingURL=roomle-sdk-4f9e50a2.js.map
