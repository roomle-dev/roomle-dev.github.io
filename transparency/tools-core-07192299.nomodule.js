System.register(['./script-loader-eb805e1f.nomodule.js', './roomle-dependency-injection-581d40cc.nomodule.js', './query-params-helper-d83ee85d.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js'], (function (exports) {
  'use strict';
  var ScriptLoader, Main, DependencyInjectionAssignment, RoomleDependencyInjection;
  return {
    setters: [function (module) {
      ScriptLoader = module.S;
      Main = module.M;
    }, function (module) {
      DependencyInjectionAssignment = module.D;
      RoomleDependencyInjection = module.b;
    }, function () {}, function () {}],
    execute: (function () {

      const INJECTABLES = [
          new DependencyInjectionAssignment('script-loader', ScriptLoader),
      ];

      class ToolsCore extends Main {
          setupGlobals() {
              //globals are initialized in bootFinished()
          }
          setupDependencies() {
              RoomleDependencyInjection.setup(INJECTABLES);
              this.lookup('logger', this._context);
          }
          cleanUpGlobals() {
              this._tools = undefined;
              if (window.RoomleToolsCore) {
                  delete window.RoomleToolsCore;
              }
          }
          cleanUpDependencies() {
              const scriptLoader = this.lookup('script-loader');
              if (scriptLoader) {
                  scriptLoader.cleanUp();
              }
          }
          bootFinished() {
              this._tools = this.lookup('roomle-tools-core', this._context);
              if (!window.RoomleToolsCore) {
                  window.RoomleToolsCore = this._tools;
              }
          }
          getApi() {
              return this._tools;
          }
          getContextName() {
              return "tools-core" /* BASE_CONTEXT.TOOLS_CORE */;
          }
      } exports('ToolsCore', ToolsCore);

    })
  };
}));
//# sourceMappingURL=tools-core-07192299.nomodule.js.map
