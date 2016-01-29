import Component from './Component';
import Components from './Components';

/* Implemented to define colorizer, which affects color and alpha of vertices.
 * This does not affect things like alpha-blending, shading, etc.
 * since those are renderer specific features.  A renderer may choose
 * to ignore the color generated altogether */
export default class Colorizer extends Component {
    static get displayName() { return "Default"; }

    static get description() {
        return "Doesn't apply any coloration to vertices";
    }

    apply(context, vertex) { return vertex; }
    reset() { }
}

Components.register(Colorizer, Colorizer, true);