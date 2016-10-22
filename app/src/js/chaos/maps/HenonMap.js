let Map = require('../Map'),
    Components = require('../Components');

class HenonMap extends Map {
    static get displayName() {
        return "Hénon";
    }

    static get description() {
        return "A Hénon map";
    }

    get coefficients() {
        return 3;
    }

    apply(v, c) {
        return [
            v[1],
            v[2],
            (c[0] + c[1] * v[0]) + (c[2] * v[1]) - (v[2] * v[2])
        ];
    }
}

Components.register(Map, HenonMap, false);
module.exports = HenonMap;