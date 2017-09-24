let Map = require('../Map'),
    OdeMap = require('../OdeMap'),
    Components = require('../Components');

class RosslerMap extends OdeMap {
    static get displayName() {
        return "Rössler";
    }

    static get description() {
        return "A Rössler map";
    }

    get coefficients() {
        return 3;
    }

    get epsilon() {
        return 0.01;
    }

    applyOde(v, c) {
        let a = c[0] * 0.2 * 2.0,
            b = c[1] * 0.2 * 2.0,
            c = c[2] * 5.7 * 2.0;

        return [
            -v[1] - v[2],
            v[0] + a * v[1],
            b + v[2] * (v[0] - c)
        ];
    }
}

Components.register(Map, RosslerMap, false);
module.exports = RosslerMap;