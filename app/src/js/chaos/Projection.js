let Component = require('./Component');

/* Implemented to define a transform from a normalized vertex to another normalized vertex or set of vertices */
class Projection extends Component {
    static get displayName() { return "Default"; }
    apply(context, vertex) { return vertex; }
    reset() { }
}

module.exports = Projection;