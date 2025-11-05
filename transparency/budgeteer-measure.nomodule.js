System.register(['./main-thread-to-worker-d8be741d.nomodule.js', './query-params-helper-d83ee85d.nomodule.js'], (function () {
  'use strict';
  var MainThreadToWorker, getAssetPath, getAllParameters;
  return {
    setters: [function (module) {
      MainThreadToWorker = module.M;
      getAssetPath = module.g;
    }, function (module) {
      getAllParameters = module.g;
    }],
    execute: (function () {

      var BUDGETEER_FILE_NAME = "static/budgeteer.sw-a8641894903f5c49.js";

      class BudgeteerMeasure {
          _addIframe() {
              const id = 'website-to-measure';
              if (document.getElementById(id)) {
                  console.error('Iframe already added! Check how this can happen');
                  return;
              }
              const originParams = getAllParameters();
              if (!originParams.checkUrl) {
                  console.error('CAN NOT MEASURE WITHOUT A URL, add checkUrl queryParam. To encode call BudgeteerMeasure.encodeUrl(url: string)');
                  return;
              }
              let src = this.decodeUrl(originParams.checkUrl);
              const origin = window.location.origin;
              if (!src.startsWith(origin)) {
                  console.error('CAN ONLY MEASURE SAME ORIGIN PLEASE CHECK', {
                      origin,
                      src,
                  });
                  return;
              }
              const checkParams = getAllParameters(src);
              const paramsCount = Object.keys(checkParams).length;
              const seperator = paramsCount ? '&' : '?';
              if (!checkParams._measureTraffic) {
                  src += seperator + '_measureTraffic=true'; // is needed to deactivate other service workers, otherwise our measure SW would be deleted
              }
              const iframe = document.createElement('iframe');
              iframe.id = id;
              iframe.src = src;
              document.body.appendChild(iframe);
          }
          _isAlreadyActive() {
              return (navigator.serviceWorker.controller &&
                  navigator.serviceWorker.controller.scriptURL.indexOf('budgeteer.sw') !==
                      -1 &&
                  navigator.serviceWorker.controller.state === 'activated');
          }
          _handleActiveSw() {
              this._mainThreadToWorker.setEventPoster(navigator.serviceWorker.controller);
              this._addIframe();
              this._alreadyAdded = true;
          }
          constructor() {
              this._inLimbo = false; // this is needed because of browser sync and dev tool settings
              this._alreadyAdded = false;
              window.addEventListener('beforeunload', () => (this._inLimbo = true)); // do not need to clean up because after this function page is refresh and everything is set back to start again
              this._mainThreadToWorker = new MainThreadToWorker(this, navigator.serviceWorker);
              if (this._isAlreadyActive()) {
                  this._handleActiveSw();
              }
              else {
                  navigator.serviceWorker
                      .register(getAssetPath() + BUDGETEER_FILE_NAME, { scope: '../../' })
                      .then((_registration) => {
                      if (this._isAlreadyActive()) {
                          this._handleActiveSw();
                      }
                  }, (err) => console.error('Budgeteer registration failed: ', err));
              }
              navigator.serviceWorker.addEventListener('controllerchange', () => this._mainThreadToWorker.setEventPoster(navigator.serviceWorker.controller));
              window.BudgeteerMeasure = { encodeUrl: this.encodeUrl };
          }
          encodeUrl(url) {
              return encodeURIComponent(url);
          }
          decodeUrl(encodedUrl) {
              return decodeURIComponent(encodedUrl);
          }
          onCommand(command) {
              if (this._inLimbo) {
                  // this happens because of browser sync and dev tool settings
                  return;
              }
              switch (command) {
                  case 6 /* WORKER_MESSAGE.SW_CLAIMED_CONTROL */:
                      if (!this._alreadyAdded) {
                          // check is on purpose here because we want to see if there are cases where the dom would be added double!
                          this._addIframe();
                      }
              }
          }
      }
      // eslint-disable-next-line
      new BudgeteerMeasure();

    })
  };
}));
//# sourceMappingURL=budgeteer-measure.nomodule.js.map
