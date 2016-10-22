let SearchCriterion = require('../SearchCriterion'),
    Point = require('../Point'),
    Props = require('../Props'),
    Components = require('../Components');

const LOG2 = 0.69314718055994530941723212145819;

class LyapunovExponent extends SearchCriterion {
    static get displayName() {
        return "Lyapunov Exponent";
    }

    static get description() {
        return "An exponent that describes stability";
    }

    static get params() {
        return [
            Props.numberRange("Threshold", "min", "max", -1.0, 1.0, { decimalPlaces: 2 }),
            Props.number("minIterations", "minimum iterations", 1, 1000, { integral: true, step: 10 })
        ];
    }

    constructor() {
        this._max = 0.00;
        this._min = 0.02;
        this._precision = 1e11;
        this._minIterations = 100;
    }

    get max() {
        return this._max;
    }

    set max(val) {
        this._max = val;
    }

    get min() {
        return this._min;
    }

    set min(val) {
        this._min = val;
    }

    get precision() {
        return this._precision;
    }

    set precision(val) {
        this._precision = val;
    }

    get minIterations() {
        return this._minIterations;
    }

    set minIterations(val) {
        this._minIterations = val;
    }

    get test() {
        return this._test;
    }

    set test(val) {
        this._test = val;
    }

    reset(context, initialValue) {
        this._innerSum = 0;
        this._delta = 1 / this._precision;
        this._samples = 0;

        let dimensions = context.map.dimensions;
        let dv = Math.sqrt(this._delta * this._delta / dimensions);
        this._nearValue = [];
        for (var i = 0; i < 3; i++) {
            this._nearValue.push(initialValue[i] + dv);
        }
    }

    test(context, nextValue) {
        /* transform our near point and compare against next value */
        this._nearValue = context.map.apply(this._nearValue, context.coefficients);
        if (!Point.isValid(this._nearValue))
            return false;

        let dx = this._nearValue[0] - nextValue[0];
        let dy = this._nearValue[1] - nextValue[1];
        let dz = this._nearValue[2] - nextValue[2];
        let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        /* TODO: how to handle a distance of 0 */
        if (distance > 0.0) {
            this._innerSum += Math.log(distance / this._delta);
            /* readjust near point */
            for (var i = 0; i < 3; i++) {
                this._nearValue[i] = (nextValue[i] + this._delta * (nextValue[i] - this._nearValue[i]) / distance);
            }
            this._samples++;
        }

        this._lyapunov = LOG2 * (this._innerSum / this._samples);

        return this._samples < this._minIterations || this._lyapunov >= this._min;
    }
}

Components.register(SearchCriterion, LyapunovExponent, true);
module.exports = LyapunovExponent;

