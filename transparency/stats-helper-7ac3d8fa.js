import { _ as __decorate, i as inject } from './roomle-dependency-injection-0a65a99a.js';
import './main-thread-to-worker-8a755a37.js';

class StatsHelper {
    constructor() {
        this._statPanels = [];
    }
    _init() {
        let fpsPanel = new Stats();
        fpsPanel.showPanel(0);
        fpsPanel.dom.style.cssText =
            'position:absolute;top:0px;left:0px;z-index:110;';
        document.body.appendChild(fpsPanel.dom);
        this._statPanels.push(fpsPanel);
        let memoryPanel = new Stats();
        memoryPanel.showPanel(2);
        memoryPanel.dom.style.cssText =
            'position:absolute;top:50px;left:0px;z-index:110;';
        document.body.appendChild(memoryPanel.dom);
        this._statPanels.push(memoryPanel);
        let drawPanel = new Stats();
        this._drawPanel = drawPanel.addPanel(new Stats.Panel('draw', '#0f0', '#000'));
        drawPanel.showPanel(3);
        drawPanel.dom.style.cssText =
            'position:absolute;top:100px;left:0px;z-index:110;';
        document.body.appendChild(drawPanel.dom);
        this._statPanels.push(drawPanel);
        let trianglesPanel = new Stats();
        this._trianglesPanel = trianglesPanel.addPanel(new Stats.Panel('poly', '#0f0', '#000'));
        trianglesPanel.showPanel(3);
        trianglesPanel.dom.style.cssText =
            'position:absolute;top:150px;left:0px;z-index:110;';
        document.body.appendChild(trianglesPanel.dom);
        this._statPanels.push(trianglesPanel);
        let geometryPanel = new Stats();
        this._geometryPanel = geometryPanel.addPanel(new Stats.Panel('geo', '#f00', '#000'));
        geometryPanel.showPanel(3);
        geometryPanel.dom.style.cssText =
            'position:absolute;top:200px;left:0px;z-index:110;';
        document.body.appendChild(geometryPanel.dom);
        this._statPanels.push(geometryPanel);
        let texturePanel = new Stats();
        this._texturePanel = texturePanel.addPanel(new Stats.Panel('tex', '#f00', '#000'));
        texturePanel.showPanel(3);
        texturePanel.dom.style.cssText =
            'position:absolute;top:250px;left:0px;z-index:110;';
        document.body.appendChild(texturePanel.dom);
        this._statPanels.push(texturePanel);
        let materialPanel = new Stats();
        this._materialPanel = materialPanel.addPanel(new Stats.Panel('mat', '#f00', '#000'));
        materialPanel.showPanel(3);
        materialPanel.dom.style.cssText =
            'position:absolute;top:300px;left:0px;z-index:110;';
        document.body.appendChild(materialPanel.dom);
        this._statPanels.push(materialPanel);
        let qualityPanel = new Stats();
        this._qualityPanel = qualityPanel.addPanel(new Stats.Panel('quality', '#fff', '#000'));
        qualityPanel.showPanel(3);
        qualityPanel.dom.style.cssText =
            'position:absolute;top:350px;left:0px;z-index:110;';
        document.body.appendChild(qualityPanel.dom);
        this._statPanels.push(qualityPanel);
    }
    updateRenderInfo(info) {
        if (this._drawPanel && info.render.calls > 0) {
            this._drawPanel.update(info.render.calls, 500);
        }
        if (this._trianglesPanel && info.render.triangles > 0) {
            this._trianglesPanel.update(info.render.triangles, 10000);
        }
        if (this._geometryPanel && info.memory.geometries > 0) {
            this._geometryPanel.update(info.memory.geometries, 10000);
        }
        if (this._texturePanel && info.memory.textures > 0) {
            this._texturePanel.update(info.memory.textures, 10000);
        }
        if (this._materialPanel && this._cacheHolder.materialCache.size > 0) {
            this._materialPanel.update(this._cacheHolder.materialCache.size, 1000);
        }
        if (this._statPanels.length > 0) {
            this._statPanels.forEach((panel) => panel.update());
        }
    }
    updateQualityInfo(qualitySetting) {
        if (this._qualityPanel && qualitySetting) {
            this._qualityPanel.update(qualitySetting.getQuality(), 5);
        }
    }
}
__decorate([
    inject
], StatsHelper.prototype, "_cacheHolder", void 0);

export { StatsHelper as default };
//# sourceMappingURL=stats-helper-7ac3d8fa.js.map
