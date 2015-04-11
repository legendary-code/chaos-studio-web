let Rng = require('../Rng');

const m = Math.pow(2, 48);
const a = 25214903917;
const c = 11;

class LinearCongruentialGenerator extends Rng {
    reset(seed) {
        super.reset(seed);
        this._x = seed;
    }

    next() {
        this._x = (a * this._x + c) % m;
        return (this._x / m);
    }
}

module.exports = LinearCongruentialGenerator;