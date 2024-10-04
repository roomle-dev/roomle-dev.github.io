import { S as ScriptLoader, M as Main } from './script-loader-e0e21e6f.js';
import { D as DependencyInjectionAssignment, b as RoomleDependencyInjection } from './roomle-dependency-injection-ca61ba0e.js';
import './query-params-helper-cc317631.js';
import './main-thread-to-worker-64f5b9ad.js';

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
}

export { ToolsCore };
//# sourceMappingURL=tools-core-f53969fe.js.map
