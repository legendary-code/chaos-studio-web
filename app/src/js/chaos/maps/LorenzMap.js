let Map = require('../Map'),
    OdeMap = require('../OdeMap'),
    Components = require('../Components');

class LorenzMap extends OdeMap {
    static get displayName() {
        return "Lorenz";
    }

    static get description() {
        return "A Lorenz map";
    }

    get coefficients() {
        return 3;
    }

    get epsilon() {
        return 0.01;
    }

    applyOde(v, c) {
        let sigma = c[0] * 10.0;
        let rho = c[1] * 28.0;
        let beta = c[2] * 2.66666666667;

        return [
            sigma * (v[1] - v[0]),
            (v[0] * (rho - v[2])) - v[1],
            (v[0] * v[1]) - (beta * v[2])
        ];
    }
}

Components.register(Map, LorenzMap, false);
module.exports = LorenzMap;