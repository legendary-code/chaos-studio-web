let Map = require('../Map'),
    Components = require('../Components');

class AndOrMap extends Map {
    static get displayName() {
        return "AND & OR";
    }

    static get description() {
        return "A map with AND and OR";
    }

    get coefficients() {
        return 14;
    }

    apply(v, c) {
        return [
            c[0] +
            c[1] * v[0] + c[2] * v[1] +
            (c[3] * v[0] & c[4] * v[1]) +
            (c[5] * v[0] | c[6] * v[1]),

            c[7] +
            c[8] * v[0] + c[9] * v[1] +
            (c[10] * v[0] & c[11] * v[1]) +
            (c[12] * v[0] | c[13] * v[1]),

            v[0] * v[0] + v[1] * v[1]
        ];
    }
}

Components.register(Map, AndOrMap, false);
module.exports = AndOrMap;