var Map = require('../Map'),
    Types = require('../Types');

class QuadraticMap extends Map {

    static get params() {
        return {
            test: Types.number("Test param", 0, 10, 0)
        };
    }

    static get displayName() {
        return "Quadratic";
    }

    static get coefficients() {
        return 30;
    }

    apply(v, c) {
        return [
            v[0] * v[0] * c[0] + v[1] * v[1] * c[1] + v[2] * v[2] * c[2] +
            v[0] * v[1] * c[3] + v[0] * v[2] * c[4] + v[1] * v[2] * c[5] +
            v[0] * c[6] + v[1] * c[7] + v[2] * c[8] + c[9],

            v[0] * v[0] * c[10] + v[1] * v[1] * c[11] + v[2] * v[2] * c[12] +
            v[0] * v[1] * c[13] + v[0] * v[2] * c[14] + v[1] * v[2] * c[15] +
            v[0] * c[16] + v[1] * c[17] + v[2] * c[18] + c[19],

            v[0] * v[0] * c[20] + v[1] * v[1] * c[21] + v[2] * v[2] * c[22] +
            v[0] * v[1] * c[23] + v[0] * v[2] * c[24] + v[1] * v[2] * c[25] +
            v[0] * c[26] + v[1] * c[27] + v[2] * c[28] + c[29]
        ];
    }
}

module.exports = QuadraticMap;