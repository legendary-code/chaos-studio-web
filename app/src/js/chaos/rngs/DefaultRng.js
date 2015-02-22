var Rng = require('../Rng');

class DefaultRng extends Rng {
    next() {
        return Math.random();
    }
}

module.exports = DefaultRng;