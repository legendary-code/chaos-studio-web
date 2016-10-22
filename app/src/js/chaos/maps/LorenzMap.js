let Map = require('../Map'),
    Components = require('../Components');

class LorenzMap extends Map {
    static get displayName() {
        return "Lorenz";
    }

    static get description() {
        return "A Lorenz map";
    }

    get coefficients() {
        return 4;
    }

    apply(v, c) {
        let dt = c[0] * 0.01;
        let sigma = c[1] * 10.0;
        let rho = c[2] * 28.0;
        let beta = c[3] * 2.66666666667;

        return [
            v[0] + (dt * sigma * (v[1] - v[0])),
            v[1] + (dt * ((v[0] * (rho - v[2])) - v[1])),
            v[2] + (dt * ((v[0] * v[1]) - (beta * v[2])))
        ];
    }
}

Components.register(Map, LorenzMap, false);
module.exports = LorenzMap;