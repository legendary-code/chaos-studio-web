let Map = require('../Map'),
    Components = require('../Components');

class CubicMap extends Map {
    static get displayName() {
        return "Cubic";
    }

    static get description() {
        return "A polynomial map with a degree of 3";
    }

    get coefficients() {
        return 60;
    }

    apply(v, c) {
        let x = v[0], y = v[1], z= v[2];

        return [
            c[0] * x * x * x + c[1] * y * y * y + c[2] * z * z * z +
            c[3] * x * x * y + c[4] * x * x * z + c[5] * y * y * x +
            c[6] * y * y * z + c[7] * z * z * x + c[8] * z * z * y +
            c[9] * x * y * z + c[10] * x * x + c[11] * y * y +
            c[12] * z * z + c[13] * x * y + c[14] * x * z +
            c[15] * y * z + c[16] * x + c[17] * y + c[18] * z + c[19],

            c[20] * x * x * x + c[21] * y * y * y + c[22] * z * z * z +
            c[23] * x * x * y + c[24] * x * x * z + c[25] * y * y * x +
            c[26] * y * y * z + c[27] * z * z * x + c[28] * z * z * y +
            c[29] * x * y * z + c[30] * x * x + c[31] * y * y +
            c[32] * z * z + c[33] * x * y + c[34] * x * z +
            c[35] * y * z + c[36] * x + c[37] * y + c[38] * z + c[39],

            c[40] * x * x * x + c[41] * y * y * y + c[42] * z * z * z +
            c[43] * x * x * y + c[44] * x * x * z + c[45] * y * y * x +
            c[46] * y * y * z + c[47] * z * z * x + c[48] * z * z * y +
            c[49] * x * y * z + c[50] * x * x + c[51] * y * y +
            c[52] * z * z + c[53] * x * y + c[54] * x * z +
            c[55] * y * z + c[56] * x + c[57] * y + c[58] * z + c[59]
        ];
    }
}

Components.register(Map, CubicMap, true);
module.exports = CubicMap;