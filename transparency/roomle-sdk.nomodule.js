System.register(['./roomle-dependency-injection-581d40cc.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js'], (function (exports, module) {
  'use strict';
  var RoomleDependencyInjection, DependencyInjectionAssignment, RapiAccess, GlobalCallback, GlobalInitData, InitData;
  return {
    setters: [function (module) {
      RoomleDependencyInjection = module.b;
      DependencyInjectionAssignment = module.D;
      RapiAccess = module.R;
      GlobalCallback = module.az;
      GlobalInitData = module.aA;
      InitData = module.aB;
    }, function () {}],
    execute: (function () {

      // THIS IS NEEDED TO MAKE SURE FOR EVERY MODULE WE ARE CREATING A FILE IS TRANSPILED
      // WHICH CAN BE CONSUMED VIA SDK
      // eslint-disable variable-name
      class RoomleSdk {
          static getConfigurator(initData, context) {
              context = this._setupDI("configurator" /* BASE_CONTEXT.CONFIGURATOR */, initData, context);
              return new Promise((resolve, reject) => module.import('./configurator-a668a2ce.nomodule.js').then(({ Configurator: ConfiguratorClass }) => resolve(new ConfiguratorClass(context)), reject));
          }
          static getPlanner(initData, context) {
              context = this._setupDI("planner" /* BASE_CONTEXT.PLANNER */, initData, context);
              return new Promise((resolve, reject) => module.import('./planner-80bbab06.nomodule.js').then(({ Planner: PlannerClass }) => resolve(new PlannerClass(context)), reject));
          }
          static async getGlbViewer(initData, context) {
              context = this._setupDI("glb-viewer" /* BASE_CONTEXT.GLB_VIEWER */, initData, context);
              return new Promise((resolve, reject) => module.import('./glb-viewer-67004607.nomodule.js').then(({ GlbViewer: GlbViewerClass }) => resolve(new GlbViewerClass(context)), reject));
          }
          static getMaterialViewer(initData, context) {
              context = this._setupDI("configurator" /* BASE_CONTEXT.CONFIGURATOR */, initData, context);
              return new Promise((resolve, reject) => module.import('./material-viewer-f60406ea.nomodule.js').then(({ MaterialViewer: MaterialViewerClass }) => resolve(new MaterialViewerClass(context)), reject));
          }
          static getCoreTools(initData, context) {
              context = this._setupDI("tools-core" /* BASE_CONTEXT.TOOLS_CORE */, initData, context);
              return new Promise((resolve, reject) => module.import('./tools-core-07192299.nomodule.js').then(({ ToolsCore: ToolsCoreClass }) => {
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
      } exports('default', RoomleSdk);
      // eslint:enable:variable-name

    })
  };
}));
//# sourceMappingURL=roomle-sdk.nomodule.js.map
