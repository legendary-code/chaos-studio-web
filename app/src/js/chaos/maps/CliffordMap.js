let Map = require('../Map'),
    Components = require('../Components');

class CliffordMap extends Map {
    static get displayName() {
        return "Clifford";
    }

    static get description() {
        return "A Clifford map";
    }

    get coefficients() {
        return 4;
    }

    apply(v, c) {
        return [
            Math.sin(3.0 * c[0] * v[1]) + Math.cos(3.0 * c[1] * v[0]),
            Math.sin(3.0 * c[2] * v[0]) + Math.cos(3.0 * c[3] * v[1]),
            Math.sin(v[0])
        ];
    }
}

Components.register(Map, CliffordMap, false);
module.exports = CliffordMap;