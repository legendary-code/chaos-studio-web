let Colorizer = require('../Colorizer'),
    Point = require('../Point'),
    Props = require('../Props'),
    Component = require('../Component'),
    Components = require('../Components'),
    { hslToRgb } = require('../../utils/color');

/* Implemented to define colorizer, which affects color and alpha of vertices.
 * This does not affect things like alpha-blending, shading, etc.
 * since those are renderer specific features.  A renderer may choose
 * to ignore the color generated altogether */
class RadialHueColorizer extends Component {
    static get displayName() { return "Radial Hue"; }

    static get description() {
        return "Varying hue out from the center";
    }

    static get params() {
        return [
            Props.number('saturation', 'Saturation', 0.0, 1.0, { decimalPlaces: 2 }),
            Props.number('lightness', 'Lightness', 0.0, 1.0, { decimalPlaces: 2 }),
            Props.number('alpha', 'Alpha', 0.0, 1.0, { decimalPlaces: 2 })
        ];
    }

    constructor() {
        super();
        this._saturation = 1.0;
        this._lightness = 0.03;
        this._alpha = 0.1;
    }

    get saturation() {
        return this._saturation;
    }

    set saturation(val) {
        this._saturation = val;
    }

    get lightness() {
        return this._lightness;
    }

    set lightness(val) {
        this._lightness = val;
    }

    get alpha() {
        return this._alpha;
    }

    set alpha(val) {
        this._alpha = val;
    }

    apply(context, vertex) {
        const hue = Point.distanceNormalized(vertex) * 360.0;
        const rgb = hslToRgb(hue, this._saturation, this._lightness);
        for (let color of rgb) {
            vertex.push(color);
        }
        vertex.push(this._alpha);
        return vertex;
    }

    reset() { }
}

Components.register(Colorizer, RadialHueColorizer, false);
module.exports = RadialHueColorizer;