let Component = require('./Component');

class Rng extends Component {
    get seed() { return this._seed; }
    reset(seed) { this._seed = seed; }
    next() { }
}

module.exports = Rng;