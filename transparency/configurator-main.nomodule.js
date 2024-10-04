System.register(['./configurator-a668a2ce.nomodule.js', './script-loader-eb805e1f.nomodule.js', './query-params-helper-d83ee85d.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js', './roomle-dependency-injection-581d40cc.nomodule.js', './scene-manager-7a1180ea.nomodule.js', './component-raycast-helper-5d554d60.nomodule.js', './roomle-configurator-44274878.nomodule.js', './default-light-setting-05993e6d.nomodule.js'], (function () {
  'use strict';
  var Configurator;
  return {
    setters: [function (module) {
      Configurator = module.Configurator;
    }, function () {}, function () {}, function () {}, function () {}, function () {}, function () {}, function () {}, function () {}],
    execute: (function () {

      const configurator = new Configurator();
      configurator.boot();
      if (!window.requestIdleCallback) {
          window.requestIdleCallback = (cb) => {
              return setTimeout(() => {
                  let start = Date.now();
                  cb({
                      didTimeout: false,
                      timeRemaining() {
                          return Math.max(0, 50 - (Date.now() - start));
                      },
                  });
              }, 1);
          };
      }
      if (!window.cancelIdleCallback) {
          window.cancelIdleCallback =
              window.cancelIdleCallback ||
                  function (id) {
                      clearTimeout(id);
                  };
      }

    })
  };
}));
//# sourceMappingURL=configurator-main.nomodule.js.map
