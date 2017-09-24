let Map = require('../Map'),
    Components = require('../Components');

class ExponentMap extends Map {
    static get displayName() {
        return "Exponent";
    }

    static get description() {
        return "A map with varied exponents";
    }

    get coefficients() {
        return 20;
    }

    apply(v, c) {
        const absX = Math.abs(v[0]);
        const absY = Math.abs(v[1]);
        const absZ = Math.abs(v[2]);

        return [
            c[0] +
            c[1] * v[0] + c[2] * v[1] + c[3] * v[2] +
            c[4] * Math.pow(absX, c[5]) +
            c[6] * Math.pow(absY, c[7]) +
            c[8] * Math.pow(absZ, c[9]),

            c[10] +
            c[11] * v[0] + c[12] * v[1] + c[13] * v[2] +
            c[14] * Math.pow(absX, c[15]) +
            c[16] * Math.pow(absY, c[17]) +
            c[18] * Math.pow(absZ, c[19]),

            v[0] * v[0] + v[1] * v[1]
        ];
    }
}

Components.register(Map, ExponentMap, false);
module.exports = ExponentMap;