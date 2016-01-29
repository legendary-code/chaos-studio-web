import Component from './Component';
import Components from './Components';

/* Implemented to define a transform from a normalized vertex to another normalized vertex or set of vertices */
export default class Projection extends Component {
    static get displayName() { return "Default"; }

    static get description() {
        return "Doesn't apply any projection to vertices";
    }

    apply(context, vertex) { return vertex; }
    reset() { }
}

Components.register(Projection, Projection, true);
