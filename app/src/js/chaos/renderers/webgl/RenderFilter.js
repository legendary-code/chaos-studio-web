let Component = require('../../Component'),
    Components = require('../../Components'),
    Three = require('three');

/**
 * Implements a rendering filter for WebGLRenderer for special effects like pencil sketch
 */
class RenderFilter extends Component {
    static get displayName() {
        return "Default";
    }

    static get description() {
        return "Basic render filter";
    }

    createGeometry(points) {
        let geometry = new Three.Geometry();

        geometry.vertices = points.map(function(point) {
            return new Three.Vector3(point[0], point[1], point[2]);
        });

        return geometry;
    }

    createMaterial() {
        return new Three.PointCloudMaterial({
            color: 0x000000,
            size: 0.005,
            opacity: 0.1,
            blendEquation: Three.AddEquation,
            transparent: true
        });
    }
}

Components.register(RenderFilter, RenderFilter, false);
module.exports = RenderFilter;