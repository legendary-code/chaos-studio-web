let SearchCriterion = require('../SearchCriterion'),
    Point = require('../Point'),
    Props = require('../Props'),
    OdeMap = require('../OdeMap'),
    Components = require('../Components');

const LOG2 = 0.69314718055994530941723212145819;
const PRECISION = 1e11;
const MIN_ITERATIONS = 100;

class LyapunovExponent extends SearchCriterion {
    static get displayName() {
        return "Lyapunov Exponent";
    }

    static get description() {
        return "An exponent that describes stability";
    }

    static get params() {
        return [
            Props.numberRange("Threshold", "min", "max", 0.0, 1.0, { decimalPlaces: 2 })
        ];
    }

    get requiresSettling() { return false; }

    constructor() {
        super();
        this._max = 0.15;
        this._min = 0.02;
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

    reset(context, initialValue) {
        this._innerSum = 0;
        this._delta = 1 / PRECISION;
        this._samples = 0;

        let dimensions = context.map.dimensions;
        let dv = Math.sqrt(this._delta * this._delta / dimensions);
        this._nearValue = [];
        for (let i = 0; i < 3; i++) {
            this._nearValue.push(initialValue[i] + dv);
        }
    }

    test(context, nextValue) {
        /* transform our near point and compare against next value */
        this._nearValue = context.map.apply(this._nearValue, context.coefficients);
        if (!Point.isValid(this._nearValue))
            return false;

        let distance = Point.distance(this._nearValue, nextValue);

        /* TODO: how to handle a distance of 0 */
        if (distance > 0.0) {
            this._innerSum += Math.log(distance / this._delta);
            /* readjust near point */
            for (let i = 0; i < 3; i++) {
                this._nearValue[i] = (nextValue[i] + this._delta * (nextValue[i] - this._nearValue[i]) / distance);
            }
            this._samples++;
        }

        this._lyapunov = LOG2 * (this._innerSum / this._samples);

        if (context.map instanceof OdeMap) {
            this._lyapunov /= context.map.epsilon;
        }

        return this._samples < MIN_ITERATIONS || this._lyapunov >= this._min;
    }

    renderStats() {
        return 'L = ' + this._lyapunov.toFixed(3);
    }
}

Components.register(SearchCriterion, LyapunovExponent, true);
module.exports = LyapunovExponent;

