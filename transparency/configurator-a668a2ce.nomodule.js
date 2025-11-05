System.register(['./script-loader-eb805e1f.nomodule.js', './roomle-dependency-injection-581d40cc.nomodule.js', './scene-manager-7a1180ea.nomodule.js', './component-raycast-helper-5d554d60.nomodule.js', './roomle-configurator-44274878.nomodule.js', './query-params-helper-d83ee85d.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js', './default-light-setting-05993e6d.nomodule.js'], (function (exports) {
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
//# sourceMappingURL=configurator-a668a2ce.nomodule.js.map
