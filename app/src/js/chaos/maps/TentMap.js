let Map = require('../Map'),
    Components = require('../Components');

class TentMap extends Map {
    static get displayName() {
        return "Tent";
    }

    static get description() {
        return "A tent map";
    }

    get coefficients() {
        return 10;
    }

    apply(v, c) {
        return [
            c[0] +  (c[1] * v[0]) + (c[2] * v[1]) + (c[3] * Math.abs(v[0])) + (c[4] * Math.abs(v[1])),
            c[5] +  (c[6] * v[0]) + (c[7] * v[1]) + (c[8] * Math.abs(v[0])) + (c[9] * Math.abs(v[1])),
            (v[0] * v[0]) + (v[1] * v[1])
        ];
    }
}

Components.register(Map, TentMap, false);
module.exports = TentMap;