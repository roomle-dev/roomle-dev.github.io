import { a6 as convertToTHREE } from './roomle-dependency-injection-ca61ba0e.js';
import { a$ as RingGeometry, h as MeshBasicMaterial, w as DoubleSide, z as Mesh } from './main-thread-to-worker-64f5b9ad.js';

class ContinuousDrawingHelper {
    constructor() {
        this._currentInnerRadius = 0;
    }
    init(drawingGroup, continuousDrawingManager, kernelZoomFactor) {
        this._drawingGroup = drawingGroup;
        this._continuousDrawingManager = continuousDrawingManager;
        this._kernelZoomFactor = kernelZoomFactor;
        this.update();
    }
    update() {
        this._initCircle();
        this._updateCircle();
    }
    _initCircle() {
        if (this._circleMesh) {
            return;
        }
        const innerRadius = 70 / this._kernelZoomFactor / 1000;
        const outerRadius = innerRadius + innerRadius / 50;
        const innerRingGeometry = new RingGeometry(innerRadius, outerRadius, 32);
        const innerRingMaterial = new MeshBasicMaterial({
            color: 0x999999,
            side: DoubleSide,
        });
        this._circleMesh = new Mesh(innerRingGeometry, innerRingMaterial);
        this._circleMesh.name = 'Circle';
        this._circleMesh.rotation.set(Math.PI / 2, 0, 0);
        this._circleMesh.visible =
            this._continuousDrawingManager.shouldShowCircle();
        this._drawingGroup.add(this._circleMesh);
    }
    _updateCircle() {
        if (!this._circleMesh) {
            return;
        }
        const innerRadius = 70 / this._kernelZoomFactor / 1000;
        if (innerRadius !== this._currentInnerRadius) {
            const outerRadius = innerRadius + innerRadius / 50;
            this._circleMesh.geometry = new RingGeometry(innerRadius, outerRadius, 32);
        }
        const position = convertToTHREE(this._continuousDrawingManager.getStartPoint());
        position.y = 5;
        this._circleMesh.position.copy(position);
        this._circleMesh.visible =
            this._continuousDrawingManager.shouldShowCircle();
        this._currentInnerRadius = innerRadius;
    }
    setKernelZoomFactor(kernelZoomFactor) {
        this._kernelZoomFactor = kernelZoomFactor;
    }
    endDrawing() {
        this._drawingGroup.remove(this._circleMesh);
        this._circleMesh = null;
    }
}

export { ContinuousDrawingHelper as default };
//# sourceMappingURL=continuous-drawing-helper-a96da64c.js.map
