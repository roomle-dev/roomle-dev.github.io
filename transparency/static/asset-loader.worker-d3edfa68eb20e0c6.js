/**
 * Copyright 2018 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// If the loader is already loaded, just stop.
if (!self.define) {
  let registry = {};

  // Used for `eval` and `importScripts` where we can't get script URL by other means.
  // In both cases, it's safe to use a global var because those functions are synchronous.
  let nextDefineUri;

  const singleRequire = (uri, parentUri) => {
    uri = new URL(uri + ".js", parentUri).href;
    return registry[uri] || (
      
        new Promise(resolve => {
          if ("document" in self) {
            const script = document.createElement("script");
            script.src = uri;
            script.onload = resolve;
            document.head.appendChild(script);
          } else {
            nextDefineUri = uri;
            importScripts(uri);
            resolve();
          }
        })
      
      .then(() => {
        let promise = registry[uri];
        if (!promise) {
          throw new Error(`Module ${uri} didn’t register its module`);
        }
        return promise;
      })
    );
  };

  self.define = (depsNames, factory) => {
    const uri = nextDefineUri || ("document" in self ? document.currentScript.src : "") || location.href;
    if (registry[uri]) {
      // Module is already loading or loaded.
      return;
    }
    let exports = {};
    const require = depUri => singleRequire(depUri, uri);
    const specialDeps = {
      module: { uri },
      exports,
      require
    };
    registry[uri] = Promise.all(depsNames.map(
      depName => specialDeps[depName] || require(depName)
    )).then(deps => {
      factory(...deps);
      return exports;
    });
  };
}
define(['./worker-to-main-thread-3ad1cee7'], (function (workerToMainThread) { 'use strict';

  const wasRequestSuccess = (ok, status) => {
      if (ok !== undefined && ok !== null) {
          return typeof ok === 'string' ? ok === 'true' : ok === true;
      }
      if (typeof status === 'string') {
          status = parseInt(status, 10);
      }
      return status >= 200 && status < 300; // for details see: https://en.wikipedia.org/wiki/List_of_HTTP_status_codes#2xx_Success
  };

  const MAX_NETWORK_CALLS = 40;
  class NetworkLayer {
      constructor() {
          // @todo create one queue and sync it between,
          // main thread and worker thread
          this._queue = [];
          this._pendingRequests = 0;
      }
      _nextSlot() {
          this._pendingRequests -= 1;
          if (!this._queue.length) {
              return;
          }
          const { request, resolve, reject } = this._queue.shift();
          this._fetch(request).then(resolve, reject);
      }
      _fetch(request, options = {}, validation = {}) {
          this._pendingRequests += 1;
          return new Promise((resolve, reject) => {
              // NO ARROW FUNCTION ON PURPOSE OTHERWISE I HAVE NO ACCESS TO AGRUMENTS
              // TO HAVE CORRECT THIS, USE BIND
              self.fetch(request, options).then(async function (response) {
                  this._nextSlot();
                  const isSuccess = validation.checkResponse
                      ? (await validation.checkResponse(response)) !== false
                      : true;
                  if (wasRequestSuccess(response.ok, response.status) && isSuccess) {
                      resolve(...arguments);
                  }
                  else {
                      const url = (response === null || response === void 0 ? void 0 : response.url) || 'URL unknown';
                      reject(new Error(response.statusText ||
                          'Http error "' +
                              (response && response.status
                                  ? response.status
                                  : 'unknown') +
                              '", for "' +
                              url +
                              '"'));
                  }
              }.bind(this), (error) => {
                  this._nextSlot();
                  reject(error);
              });
          });
      }
      fetch(request, options = {}, checks = {}) {
          const isCongested = this._pendingRequests >= MAX_NETWORK_CALLS;
          if (isCongested) {
              return new Promise((resolve, reject) => this._queue.push({ request, resolve, reject }));
          }
          else {
              return this._fetch(request, options, checks);
          }
      }
  }

  class AssetLoader {
      constructor(networkLayer) {
          this._networkLayer = networkLayer;
      }
      loadAsset(url) {
          return this._networkLayer
              .fetch(url)
              .then((response) => response.blob())
              .then((dataBlob) => new Promise((resolve) => resolve(URL.createObjectURL(dataBlob))))
              .catch((error) => new Promise((_, reject) => reject(error)));
      }
  }
  class AssetLoaderMain {
      constructor() {
          this._communicationInterface = new workerToMainThread.WorkerToMainThread(this);
      }
      onCommand(command, conversationId, data) {
          switch (command) {
              case 1 /* WORKER_MESSAGE.INIT */:
                  this._loader = new AssetLoader(new NetworkLayer());
                  this._communicationInterface.sendToMainThread(4 /* WORKER_MESSAGE.INIT_DONE */, conversationId, []);
                  break;
              case 5 /* WORKER_MESSAGE.LOAD_ASSET */:
                  if (!this._loader) {
                      return;
                  }
                  this._loader.loadAsset(data).then((assetUrl) => {
                      // since we use a promise to resolve the sendToMainThread stuff we can unwrap assetUrl from array
                      this._communicationInterface.sendToMainThread(3 /* WORKER_MESSAGE.ASSET_LOADED */, conversationId, assetUrl);
                  }, (error) => this._communicationInterface.sendToMainThread(2 /* WORKER_MESSAGE.ERROR */, conversationId, { message: error.message }));
          }
      }
  }

  // eslint-disable-next-line
  new AssetLoaderMain();

}));
//# sourceMappingURL=asset-loader.worker.js.map
