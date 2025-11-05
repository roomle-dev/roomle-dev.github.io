System.register(['./script-loader-820ef2c6.nomodule.js', './roomle-dependency-injection-d9808174.nomodule.js', './scene-manager-cdced25e.nomodule.js', './component-raycast-helper-e1a80737.nomodule.js', './roomle-configurator-45be0a61.nomodule.js', './query-params-helper-5f20148b.nomodule.js', './main-thread-to-worker-5209e492.nomodule.js', './default-light-setting-9241d437.nomodule.js'], (function (exports) {
  'use strict';
  var ScriptLoader, Main, DependencyInjectionAssignment, Logger, RapiAccess, DataSyncer, ConfiguratorViewModel, RoomleDependencyInjection, AppContext, CameraControl3D, CameraControl, ComponentRaycastHelper, ConfiguratorSceneManager, RoomleConfigurator;
  return {
    setters: [function (module) {
      ScriptLoader = module.S;
      Main = module.M;
    }, function (module) {
      DependencyInjectionAssignment = module.D;
      Logger = module.L;
      RapiAccess = module.R;
      DataSyncer = module.a;
      ConfiguratorViewModel = module.C;
      RoomleDependencyInjection = module.b;
      AppContext = module.A;
    }, function (module) {
      CameraControl3D = module.C;
      CameraControl = module.a;
    }, function (module) {
      ComponentRaycastHelper = module["default"];
    }, function (module) {
      ConfiguratorSceneManager = module.C;
      RoomleConfigurator = module.R;
    }, function () {}, function () {}, function () {}],
    execute: (function () {

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
      } exports('Configurator', Configurator);

    })
  };
}));
//# sourceMappingURL=configurator-6b125654.nomodule.js.map
