let Map = require('../Map'),
    MathExt = require('../MathExt'),
    Props = require('../Props'),
    Components = require('../Components');

const D = 3;

class PolynomialMap extends Map {
    static get displayName() {
        return "Polynomial";
    }

    static get description() {
        return "A polynomial map of variable degree";
    }

    static get params() {
        return [
            Props.number("degree", "Degree", 2, 10, { integral: true })
        ];
    }

    constructor() {
        super();
        this._degree = 4;
    }

    get degree() {
        return this._degree;
    }

    set degree(val) {
        this._degree = val;
    }

    get coefficients() {
        return MathExt.fact(D - 1, D + this._degree) / MathExt.fact(this._degree);
    }

    reset() {
        // a map of powers, e.g. D = 2, degree = 2 -> [[0,0],[1,0],[0,1],[1,1],[2,0],[0,2]]
        this._powers = [];
        const loopVars = [];
        let sum = 0;

        while (true) {
            let v;
            let maxV;

            if (loopVars.length > 0) {
                do {
                    v = loopVars.splice(-1)[0];
                    sum -= v;
                    maxV = this._degree - sum;
                } while(v === maxV && loopVars.length > 0);

                if (loopVars.length === 0 && v === maxV) {
                    break;
                }

                loopVars.push(++v);
                sum += v;
            }

            while (loopVars.length < D) {
                loopVars.push(0);
            }

            this._powers.push(loopVars.slice());
        }
    }

    apply(v, c) {
        const vs = [];
        let i = 0;

        for (let d = 0; d < D; ++d) {
            let sum = 0;

            for (let powers of this._powers) {
                let p = c[i];

                for (let n = 0; n < D; ++n) {
                    p *= MathExt.ipow(v[n],powers[n]);
                }

                sum += p;
                ++i;
            }

            vs[d] = sum;
        }

        return vs;
    }
}

Components.register(Map, PolynomialMap, false);
module.exports = PolynomialMap;