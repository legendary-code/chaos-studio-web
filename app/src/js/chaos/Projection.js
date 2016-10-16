let Component = require('./Component'),
    Components = require('./Components');

/* Implemented to define a transform from a normalized vertex to another normalized vertex or set of vertices */
class Projection extends Component {
    static get displayName() { return "Default"; }

    static get description() {
        return "Doesn't apply any projection to points";
    }

    apply(context, vertex) { return vertex; }
    reset() { }
}

Components.register(Projection, Projection, true);

module.exports = Projection;