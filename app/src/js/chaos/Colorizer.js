let Component = require('./Component');

/* Implemented to define a transform from uncolored vertices to colored vertices */
class Colorizer extends Component {
    apply(bounds, vertex) { return vertex; }
    reset() { }
}

module.exports = Colorizer;