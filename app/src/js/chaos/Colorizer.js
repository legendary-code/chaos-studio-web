let Component = require('./Component');

/* Implemented to define colorizer, which affects color and alpha of vertices.
 * This does not affect things like alpha-blending, shading, etc.
 * since those are renderer specific features.  A renderer may choose
 * to ignore the color generated altogether */
class Colorizer extends Component {
    static get displayName() { return "Default"; }

    static get description() {
        return "Doesn't apply any coloration to vertices";
    }

    apply(context, vertex) { return vertex; }
    reset() { }
}

module.exports = Colorizer;