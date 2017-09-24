let Map = require('./Map');

/* Implements a map for an ODE solved using the Euler method */
class OdeMap extends Map {
    get epsilon() { return 0.01; }

    apply(val, coefficients) {
        const v = this.applyOde(val, coefficients);
        const e = this.epsilon;

        return [
            val[0] + e * v[0],
            val[1] + e * v[1],
            val[2] + e * v[2]
        ];
    }

    applyOde(val, coefficients) { }
}

module.exports = OdeMap;