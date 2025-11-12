import { S as ScriptLoader, M as Main } from './script-loader-d6791558.js';
import { D as DependencyInjectionAssignment, b as RoomleDependencyInjection } from './roomle-dependency-injection-56c1d591.js';
import './query-params-helper-f12b7599.js';
import './main-thread-to-worker-8a755a37.js';

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
//# sourceMappingURL=tools-core-995cf039.js.map
