System.register(['./main-thread-to-worker-d8be741d.nomodule.js'], (function (exports) {
  'use strict';
  var sanitizedCameraMode;
  return {
    setters: [function (module) {
      sanitizedCameraMode = module.bC;
    }],
    execute: (function () {

      const isReallyNaN = function (x) {
          return Number.isNaN(x) || isNaN(x);
      };
      const _isNumber = function (n) {
          if (isReallyNaN(n)) {
              return false;
          }
          return Number.isFinite(parseFloat(n));
      };
      const getAllParameters = exports('g', function (url) {
          if (!url) {
              url = window.location.href;
          }
          const params = url.split('?');
          if (params.length !== 2) {
              return {};
          }
          const options = params[1].split('&');
          let obj = {};
          options.forEach((param) => {
              const keyValue = param.split('=');
              let key = keyValue[0];
              let value = keyValue[1];
              if (value === 'true') {
                  value = true;
              }
              if (value === 'false') {
                  value = false;
              }
              if (_isNumber(value)) {
                  value = parseFloat(value);
              }
              if (key === 'mode') {
                  value = sanitizedCameraMode(value);
              }
              obj[keyValue[0]] = value;
          });
          return obj;
      });

    })
  };
}));
//# sourceMappingURL=query-params-helper-d83ee85d.nomodule.js.map
