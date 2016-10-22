let SearchCriterion = require('../SearchCriterion');
/*
class FractalDimension extends SearchCriterion {

    static get displayName() {
        return "Lyapunov Exponent";
    }

    static get params() {
        return {
            min: Props.number("min", 0.0, 3.0, 2),
            max: Props.number("max", 0.0, 3.0, 2),
            minIterations: Props.number("minimum iterations", 1, 1000, 0)
        };
    }

    constructor() {
        this._max = 1.5;
        this._min = 3.0;
        this._minIterations = 10000;
    }

    reset(context, nextValue) {
        this._logNe = [];
        this._boxCounts = [];
        this._dValues = [];
        this._points = [];
        this._numSamples = 0;

        for (let i = 0;i <= FractalDimension.MAX_BITS; i++) {
            this._logNe.push(0.0);
            this._boxCounts.push(0);
            this._dValues.push(1 << (FractalDimension.MAX_BITS - i);
            this._points.push({});
        }
    }

}

// Constants
FractalDimension.MAX_BITS = 30;
FractalDimension.LOG2INV = 1.4426950408889634073599246810019;

module.exports = FractalDimension;
*/