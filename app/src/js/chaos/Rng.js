let Component = require('./Component');

/* Implemented to define random number generator used to generate a repeatable set of pseudo-random numbers */
class Rng extends Component {
    get seed() { return this._seed; }
    reset(seed) { this._seed = seed; }
    next() { }
}

module.exports = Rng;