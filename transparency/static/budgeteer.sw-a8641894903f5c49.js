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
define(['exports', './worker-to-main-thread-3ad1cee7'], (function (exports, workerToMainThread) { 'use strict';

  const RAPI_URL_PATTERN = /^https:\/\/api(\.test|\.dev)?\.roomle\.com\/v2\//i;

  /// <reference path="./service-worker.d.ts" />
  const overview = new Map();
  const getCategory = (url, contentType) => {
      if (!contentType) {
          return "various" /* BUDGETEER_CATEGORY.VARIOUS */;
      }
      contentType = contentType.toLowerCase();
      if (contentType.startsWith('application/javascript') ||
          contentType.startsWith('text/javascript')) {
          return "js" /* BUDGETEER_CATEGORY.JS */;
      }
      if (contentType.startsWith('application/wasm')) {
          return "wasm" /* BUDGETEER_CATEGORY.WASM */;
      }
      if (contentType.startsWith('model/gltf-binary') ||
          contentType.startsWith('model/gltf')) {
          return "assets3d" /* BUDGETEER_CATEGORY.ASSETS_3D */;
      }
      if (contentType.startsWith('application/json')) {
          if (RAPI_URL_PATTERN.test(url)) {
              return "content" /* BUDGETEER_CATEGORY.CONTENT */;
          }
          return "json" /* BUDGETEER_CATEGORY.JSON */;
      }
      if (contentType.startsWith('image/')) {
          return "images" /* BUDGETEER_CATEGORY.IMAGES */;
      }
      if (contentType.startsWith('text/plain')) {
          if (extractTypeFromFileExtension(url) === "crt" /* BUDGETEER_TYPES.CRT */) {
              return "assets3d" /* BUDGETEER_CATEGORY.ASSETS_3D */;
          }
          return "various" /* BUDGETEER_CATEGORY.VARIOUS */;
      }
      return "various" /* BUDGETEER_CATEGORY.VARIOUS */;
  };
  const getType = (url, category) => {
      switch (category) {
          case "js" /* BUDGETEER_CATEGORY.JS */:
              return "js" /* BUDGETEER_TYPES.JS */;
          case "css" /* BUDGETEER_CATEGORY.CSS */:
              return "css" /* BUDGETEER_TYPES.CSS */;
          case "wasm" /* BUDGETEER_CATEGORY.WASM */:
              return "wasm" /* BUDGETEER_TYPES.WASM */;
          case "assets3d" /* BUDGETEER_CATEGORY.ASSETS_3D */:
          case "images" /* BUDGETEER_CATEGORY.IMAGES */:
              return extractTypeFromFileExtension(url);
      }
      return "unknown" /* BUDGETEER_TYPES.UNKNOWN */;
  };
  const extractTypeFromFileExtension = (url) => {
      if (typeof url !== 'string') {
          return "unknown" /* BUDGETEER_TYPES.UNKNOWN */;
      }
      const parts = url.split('.');
      if (parts.length === 1) {
          return "unknown" /* BUDGETEER_TYPES.UNKNOWN */;
      }
      const extension = parts.pop();
      const extensionParts = extension.split('?');
      const fileExtension = extensionParts[0].toLowerCase();
      switch (fileExtension) {
          case 'crt':
              return "crt" /* BUDGETEER_TYPES.CRT */;
          case 'jpeg':
          case 'jpg':
              return "jpg" /* BUDGETEER_TYPES.JPG */;
          case 'png':
              return "png" /* BUDGETEER_TYPES.PNG */;
          case 'gif':
              return "gif" /* BUDGETEER_TYPES.GIF */;
          case 'glb':
              return "glb" /* BUDGETEER_TYPES.GLB */;
      }
      return "unknown" /* BUDGETEER_TYPES.UNKNOWN */;
  };
  const getTypeFromRapiModel = (modelname) => {
      switch (modelname) {
          case 'component':
              return "components" /* BUDGETEER_TYPES.COMPONENTS */;
          case 'texture':
              return "textures" /* BUDGETEER_TYPES.TEXTURES */;
          case 'material':
              return "materials" /* BUDGETEER_TYPES.MATERIALS */;
          case 'configuration':
              return "configurations" /* BUDGETEER_TYPES.CONFIGURATIONS */;
          case 'item':
              return "items" /* BUDGETEER_TYPES.ITEMS */;
          case 'tag':
              return "tags" /* BUDGETEER_TYPES.TAGS */;
          case 'plan':
              return "plans" /* BUDGETEER_TYPES.PLANS */;
          default:
              return "unknown" /* BUDGETEER_TYPES.UNKNOWN */;
      }
  };
  const handleContent = (response) => {
      const responseToUse = response.clone();
      // eslint-disable-next-line @typescript-eslint/ban-types
      return responseToUse.json().then((json) => {
          let elemCount = 1;
          let model = '';
          for (let key in json) {
              if (key !== 'meta') {
                  const lastIndex = key.length - 1;
                  const lastLetter = key[lastIndex];
                  model = key;
                  if (Array.isArray(json[key])) {
                      if (lastLetter !== 's') {
                          console.warn('Plural not recognized, check "' + response.url + '"');
                      }
                      else {
                          model = model.substr(0, lastIndex);
                      }
                      elemCount = json.meta.count;
                  }
                  else {
                      if (lastLetter === 's') {
                          console.warn('Plural could be recognized wrongly, check "' + response.url + '"');
                      }
                  }
              }
          }
          const type = getTypeFromRapiModel(model);
          return { type, elemCount, contentLength: JSON.stringify(json).length };
      });
  };
  const getContentSizeOf = (category) => {
      let sum = 0;
      const categoryMap = overview.get(category);
      if (!categoryMap) {
          return sum;
      }
      categoryMap.forEach((entry) => (sum += entry.size));
      return sum;
  };
  const resetOverview = () => {
      overview.clear();
  };
  const getSizeOf = (category) => {
      const categoryMap = overview.get(category);
      return !categoryMap ? 0 : categoryMap.size;
  };
  /* istanbul ignore next */
  const printCategoryTable = (category) => {
      const table = [];
      const categoryMap = overview.get(category);
      if (!categoryMap) {
          console.log('No entries for ' + category + ' so there is no data to print');
          return;
      }
      categoryMap.forEach((entry, key) => table.push({ url: key, ...entry }));
      console.table(table);
  };
  /* istanbul ignore next */
  const printStats = (details) => {
      // ignored by tests because it's only dev stuff on the console
      console.log('--- STATS ---');
      console.log('Request count', getRequestCount());
      console.log('Content stats:');
      console.log('\t', 'Requests:', getSizeOf("content" /* BUDGETEER_CATEGORY.CONTENT */), 'Size:', getContentSizeOf("content" /* BUDGETEER_CATEGORY.CONTENT */));
      console.log('JS stats:');
      console.log('\t', 'Requests:', getSizeOf("js" /* BUDGETEER_CATEGORY.JS */), 'Size:', getContentSizeOf("js" /* BUDGETEER_CATEGORY.JS */));
      if (details) {
          overview.forEach((entries, category) => {
              console.log(category);
              entries.forEach((entry, url) => {
                  console.log('\t', url);
                  console.log('\t\t', entry);
              });
          });
      }
  };
  const getOverview = () => overview;
  const getRequestCount = () => {
      let sum = 0;
      overview.forEach((entries) => entries.forEach((entry) => {
          sum += entry.count;
      }));
      return sum;
  };
  // event: any is needed because type check fails otherwise for more details see:
  // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/28342#issuecomment-415689364
  // we should fix this at some point in future
  const handleFetchEvent = (event) => {
      if (event.request.cache === 'only-if-cached' &&
          event.request.mode !== 'same-origin') {
          console.warn('Skip because of: so#/49719964');
          return;
      }
      const t0 = performance ? performance.now() : /* istanbul ignore next */ 0;
      event.respondWith(fetch(event.request).then((response) => {
          const url = response.url;
          if (!url.includes('browser-sync/browser-sync-client.js') &&
              !url.includes('browser-sync/socket.io')) {
              const contentType = response.headers.get('content-type');
              const category = getCategory(url, contentType);
              const requests = overview.has(category)
                  ? overview.get(category)
                  : new Map();
              let entry = requests.get(url);
              /* istanbul ignore else */
              const t1 = performance
                  ? performance.now()
                  : /* istanbul ignore next */ -1;
              const timing = t1 - t0;
              const promises = [];
              if (category === "content" /* BUDGETEER_CATEGORY.CONTENT */) {
                  promises.push(handleContent(response));
              }
              return Promise.all(promises).then(([contentData]) => {
                  const contentLength = response.headers.get('content-length');
                  let length = contentLength ? parseInt(contentLength, 10) : 0;
                  if (contentData && contentData.contentLength) {
                      length = contentData.contentLength;
                  }
                  if (entry) {
                      entry.count++;
                      // calculate average incrementally: https://math.stackexchange.com/a/106720
                      entry.timing =
                          entry.timing + (timing - entry.timing) / entry.count;
                  }
                  else {
                      entry = {
                          count: 1,
                          size: length,
                          type: contentData && contentData.type
                              ? contentData.type
                              : getType(url, category),
                          timing,
                      };
                  }
                  requests.set(url, entry);
                  overview.set(category, requests);
                  return Promise.resolve(response);
              }, (error) => {
                  console.error(error);
                  return Promise.resolve(response);
              });
          }
          else {
              return Promise.resolve(response);
          }
      }));
  };
  class Budgeteer {
      constructor() {
          this.workerToMainThread = new workerToMainThread.WorkerToMainThread(this);
          resetOverview();
      }
      onCommand() {
          // tslint quite
      }
  }
  const budgeteer = new Budgeteer();
  // Add eventlistener have to live on root scope and not inside of class etc... for details see: https://github.com/kiwix/kiwix-js/pull/190/files
  self.addEventListener('install', () => {
      // do not make an error function because then install event is delay because of return value
      self.skipWaiting().then(() => undefined, (error) => console.error(error));
  });
  self.addEventListener('activate', () => {
      // do not make an error function because then activate event is delay because of return value
      self.clients.claim().then(() => budgeteer.workerToMainThread.sendToMainThread(6 /* WORKER_MESSAGE.SW_CLAIMED_CONTROL */, workerToMainThread.NO_CONVERSATION_ID, []), (error) => console.error(error));
  });
  self.addEventListener('fetch', handleFetchEvent);
  self.printStats = printStats;
  self.printCategoryTable = printCategoryTable;
  self.getOverview = getOverview;

  exports.extractTypeFromFileExtension = extractTypeFromFileExtension;
  exports.getCategory = getCategory;
  exports.getContentSizeOf = getContentSizeOf;
  exports.getOverview = getOverview;
  exports.getRequestCount = getRequestCount;
  exports.getSizeOf = getSizeOf;
  exports.getType = getType;
  exports.getTypeFromRapiModel = getTypeFromRapiModel;
  exports.handleContent = handleContent;
  exports.handleFetchEvent = handleFetchEvent;
  exports.printCategoryTable = printCategoryTable;
  exports.printStats = printStats;
  exports.resetOverview = resetOverview;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=budgeteer.sw.js.map
