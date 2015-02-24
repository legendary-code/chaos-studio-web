var SearchCriterion = require('../SearchCriterion'),
    Point = require('../Point');

class LyapunovExponent extends SearchCriterion {
    get max() {
        return _max;
    }

    set max(value) {
        _max = value;
    }

    get min() {
        return _min;
    }

    set min(value) {
        _min = value;
    }

    get precision() {
        return _precision;
    }

    set precision(value) {
        _precision = value;
    }

    get minIterations() {
        return _minIterations;
    }

    set minIterations(value) {
        _minIterations = value;
    }

    constructor() {
        this._max = 10.0;
        this._min = 0.015;
        this._precision = 1e11;
        this._minIterations = 100;
    }

    reset(context, initialValue) {
        this._innerSum = 0;
        this._delta = 1 / this._precision;
        this._samples = 0;

        let dimensions = context.configuration.map.dimensions;
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

        this._lyapunov = LyapunovExponent.LOG2 * (this._innerSum / this._samples);

        if (this._samples >= this._minIterations && (this._lyapunov < this._min || this._lyapunov > this._max)) {
            console.log("Lyapunov: " + this._lyapunov);
            return false;
        }

        return true;
    }
}

// Constants
LyapunovExponent.LOG2 = 0.69314718055994530941723212145819;

module.exports = LyapunovExponent;

