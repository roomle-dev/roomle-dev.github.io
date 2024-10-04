System.register(['./planner-80bbab06.nomodule.js', './script-loader-eb805e1f.nomodule.js', './query-params-helper-d83ee85d.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js', './roomle-dependency-injection-581d40cc.nomodule.js', './scene-manager-7a1180ea.nomodule.js', './roomle-configurator-44274878.nomodule.js', './default-light-setting-05993e6d.nomodule.js'], (function () {
  'use strict';
  var Planner;
  return {
    setters: [function (module) {
      Planner = module.Planner;
    }, function () {}, function () {}, function () {}, function () {}, function () {}, function () {}, function () {}],
    execute: (function () {

      const planner = new Planner();
      planner.boot();
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
//# sourceMappingURL=planner-main.nomodule.js.map
