let Component = require('./Component');

class Map extends Component {
    get dimensions() { return 3; }
    get coefficients() { }
    apply(value, coefficients) { }
}
module.exports = Map;