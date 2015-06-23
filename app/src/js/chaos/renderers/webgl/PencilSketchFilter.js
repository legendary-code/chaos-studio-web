let RenderFilter = require('./RenderFilter'),
    Three = require('three');

class PencilSketchFilter extends RenderFilter {
    static get displayName() { return "Pencil Sketch"; }

    createMaterial() {
        return new Three.PointCloudMaterial({
            color: 0x444444,
            size: 0.005,
            opacity: 0.1,
            blendEquation: Three.SubtractEquation,
            transparent: true
        });
    }
}

module.exports = PencilSketchFilter;