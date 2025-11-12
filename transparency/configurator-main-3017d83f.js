import { Configurator } from './configurator-def89ac2.js';
import './script-loader-d6791558.js';
import './query-params-helper-f12b7599.js';
import './main-thread-to-worker-8a755a37.js';
import './roomle-dependency-injection-56c1d591.js';
import './scene-manager-2a6437e2.js';
import './component-raycast-helper-805c88f7.js';
import './roomle-configurator-7483d507.js';
import './default-light-setting-3bf50a43.js';

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
//# sourceMappingURL=configurator-main-3017d83f.js.map
