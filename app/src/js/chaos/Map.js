let Component = require('./Component');

/* Implemented to define a transform/system from one point to another */
class Map extends Component {
    get dimensions() { return 3; }
    get coefficients() { }
    apply(val, coefficients) { }

    // initialize the map before beginning search, if needed
    initialize(isSnapshot) { }
}

module.exports = Map;