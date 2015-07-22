let Rng = require('../Rng'),
    Components = require('../Components');

const m = Math.pow(2, 48);
const a = 25214903917;
const c = 11;

class LinearCongruentialGenerator extends Rng {
    static get displayName() {
        return "Linear Congruential Generator";
    }

    static get description() {
        return "Modulo arithmetic generated numbers";
    }

    reset(seed) {
        super.reset(seed);
        this._x = seed;
    }

    next() {
        this._x = (a * this._x + c) % m;
        return (this._x / m);
    }
}

Components.register(Rng, LinearCongruentialGenerator, true);
module.exports = LinearCongruentialGenerator;