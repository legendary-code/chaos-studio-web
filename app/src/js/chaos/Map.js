let Component = require('./Component');

class Map extends Component {
    static get dimensions() { return 3; }
    static get coefficients() { }
    apply(value, coefficients) { }
}
module.exports = Map;