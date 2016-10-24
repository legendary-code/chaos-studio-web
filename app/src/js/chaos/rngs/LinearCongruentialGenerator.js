let Rng = require('../Rng'),
    Components = require('../Components');

const M = Math.pow(2, 48);
const A = 25214903917;
const C = 11;

class LinearCongruentialGenerator extends Rng {
    static get displayName() {
        return "Linear Congruential Generator";
    }

    static get description() {
        return "Modulo arithmetic generated numbers";
    }

    get seed() {
        return this._seed;
    }

    set seed(val) {
        this.reset(val);
    }

    reset(seed) {
        this._seed = seed;
        this._x = seed;
    }

    next() {
        this._x = (A * this._x + C) % M;
        return (this._x / M);
    }
}

Components.register(Rng, LinearCongruentialGenerator, true);
module.exports = LinearCongruentialGenerator;