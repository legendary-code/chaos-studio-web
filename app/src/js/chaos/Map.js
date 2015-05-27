let Component = require('./Component');

/* Implemented to define a transform/system from one point to another */
class Map extends Component {
    get dimensions() { return 3; }
    get coefficients() { }
    apply(value, coefficients) { }
}
module.exports = Map;