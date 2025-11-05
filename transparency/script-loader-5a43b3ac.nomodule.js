System.register(['./query-params-helper-d83ee85d.nomodule.js', './roomle-dependency-injection-6b8e8576.nomodule.js', './main-thread-to-worker-d8be741d.nomodule.js'], (function (exports) {
  'use strict';
  var getAllParameters, RoomleDependencyInjection, Benchmark, INJECTABLES, __decorate, inject, getAssetPath;
  return {
    setters: [function (module) {
      getAllParameters = module.g;
    }, function (module) {
      RoomleDependencyInjection = module.b;
      Benchmark = module.B;
      INJECTABLES = module.I;
      __decorate = module._;
      inject = module.i;
    }, function (module) {
      getAssetPath = module.g;
    }],
    execute: (function () {

      class Main {
          constructor(creator) {
              if (creator) {
                  this._context = creator;
              }
              else {
                  this._context = RoomleDependencyInjection.getContext(this.getContextName());
              }
              Benchmark.start('loadingTime');
          }
          _setupCommonGlobals() {
              if (!window.__RML__DEBUG__) {
                  window.__RML__DEBUG__ = {};
              }
              if (!window.__RML__ENV__) {
                  window.__RML__ENV__ = {};
                  if (!window.__RML__ENV__.assetPath) {
                      window.__RML__ENV__.assetPath = '';
                  }
              }
          }
          _setupCommonDependencies() {
              RoomleDependencyInjection.setup(INJECTABLES);
              // read url params
              const allParams = getAllParameters();
              const globalInitData = this.lookup('global-init-data');
              globalInitData.setOverrides(allParams);
              const initData = this.lookup('init-data', this._context);
              initData.setOverrides(allParams);
          }
          _cleanUpCommonGlobals() {
              if (window.__RML__DEBUG__) {
                  if (window.__RML__DEBUG__.Kernel &&
                      window.__RML__DEBUG__.Kernel.clearAll) {
                      window.__RML__DEBUG__.Kernel.clearAll();
                  }
                  delete window.__RML__DEBUG__;
              }
              delete window.__RML__ENV__;
              for (const key in window.THREE) {
                  if (window.hasOwnProperty(key)) {
                      try {
                          delete window.THREE[key];
                      }
                      catch (e) {
                          console.error(e);
                      }
                  }
              }
              window.THREE = undefined;
          }
          _cleanUpCommonDependencies() {
              // KEEP TSLINT QUITE
          }
          boot(settings /* @todo create a real type interface */) {
              this._setupCommonGlobals();
              this._setupCommonDependencies();
              this.setupGlobals(settings);
              this.setupDependencies();
              this.bootFinished();
          }
          lookup(specifier, context) {
              return window.__RML__DI__.lookup(specifier, context);
          }
          teardown() {
              this.cleanUpDependencies();
              this._cleanUpCommonDependencies();
              this.cleanUpGlobals();
              this._cleanUpCommonGlobals();
              if (window.__RML__DI__) {
                  delete window.__RML__DI__;
              }
          }
          pause() {
              const lifeCycleManager = this.lookup('life-cycle-manager', this._context);
              lifeCycleManager.pause();
              if (window.TWEEN) {
                  TWEEN.removeAll();
              }
          }
          resume(element) {
              if (element) {
                  const domHelper = this.lookup('dom-helper', this._context);
                  domHelper.setDomElement(element);
              }
              const lifeCycleManager = this.lookup('life-cycle-manager', this._context);
              lifeCycleManager.resume();
          }
          destroy() {
              this.pause();
              const lifeCycleManager = this.lookup('life-cycle-manager', this._context);
              lifeCycleManager.destroy();
              RoomleDependencyInjection.cleanUp(this._context);
          }
          /**
           * returns the instance of the rapi access so that
           * the user of the SDK can fetch data from the Roomle backend
           * @params none
           * @return RapiAccess
           */
          getRapiAccess() {
              return this.lookup('rapi-access', this._context);
          }
      } exports('M', Main);

      let _scriptCache = {};
      let _idCache = {};
      function attachScript(url, options, resolve, reject) {
          if (url.indexOf('http') === -1) {
              url = getAssetPath() + url;
          }
          if (_scriptCache[url]) {
              return resolve();
          }
          if (options.id && _idCache[options.id]) {
              return reject(new Error('There is already a script with ID "' + options.id + '"'));
          }
          Benchmark.start('load_' + options.id.replace(/-/g, '_'));
          const element = document.createElement('script');
          element.async = false;
          element.src = url;
          element.id = options.id;
          element.onload = () => {
              _scriptCache[url] = true;
              _idCache[options.id] = true;
              Object.defineProperty(resolve, 'name', { value: 'resolve-' + options.id });
              resolve();
          };
          element.onerror = (error) => {
              reject(error);
          };
          document.body.appendChild(element);
      }
      class ScriptLoader {
          constructor(creator) {
              this._creator_ = creator;
          }
          fetch(url, options) {
              return this._singlePromiseFactory.create(5 /* PROMISE_CATEGORY.FETCH_SCRIPT */, url, (resolve, reject) => {
                  attachScript(url, options, resolve, reject);
              });
          }
          loadScripts(scripts) {
              const promises = [];
              scripts.forEach((script) => {
                  let scriptLoadPromise = this.fetch(script.name, { id: script.id });
                  promises.push(scriptLoadPromise);
              });
              return Promise.all(promises);
          }
          cleanUp() {
              for (let key in _idCache) {
                  /* istanbul ignore else */
                  if (_idCache.hasOwnProperty(key)) {
                      const script = document.getElementById(key);
                      if (script) {
                          script.parentElement.removeChild(script);
                      }
                  }
              }
              _scriptCache = {};
              _idCache = {};
          }
      } exports('S', ScriptLoader);
      __decorate([
          inject
      ], ScriptLoader.prototype, "_singlePromiseFactory", void 0);

    })
  };
}));
//# sourceMappingURL=script-loader-5a43b3ac.nomodule.js.map
