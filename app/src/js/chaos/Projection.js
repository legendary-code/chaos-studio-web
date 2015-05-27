let Component = require('./Component');

/* Implemented to define a transform from colored vertices to colored vertices */
class Projection extends Component {
    apply(bounds, vertex) { return vertex; }
    reset() { }
}

module.exports = Projection;