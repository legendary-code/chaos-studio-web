let RenderFilter = require('./RenderFilter'),
    Components = require('../../Components'),
    Three = require('three');

class PencilSketchFilter extends RenderFilter {
    static get displayName() { return "Pencil Sketch"; }

    static get description() {
        return "A render filter that looks like pencil shading";
    }

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

Components.register(RenderFilter, PencilSketchFilter, false);
module.exports = PencilSketchFilter;