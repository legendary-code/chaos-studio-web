let SearchCriterion = require('../SearchCriterion'),
    Point = require('../Point'),
    Props = require('../Props'),
    OdeMap = require('../OdeMap'),
    LinearCongruentialGenerator = require('../rngs/LinearCongruentialGenerator'),
    Components = require('../Components');

const TWOD = 8;
const N2 = 0.001 * TWOD;
const N1 = 0.00001 * TWOD;
const NUM_SAMPLES = 500;
const LOG_E = 0.4342944819;
const MIN_ITERATIONS = 500;

class FractalDimension extends SearchCriterion {
    static get displayName() {
        return "Fractal Dimension";
    }

    static get description() {
        return "A value that describes dimensionality";
    }

    static get params() {
        return [
            Props.numberRange("Threshold", "min", "max", 0.0, 3.0, { decimalPlaces: 2 })
        ];
    }

    constructor() {
        super();
        this._max = 2.0;
        this._min = 1.0;
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
        this._d2max = context.bounds.diagonalSquared();
        this._n1 = 0;
        this._n2 = 0;
        this._values = [];
        this._rng = new LinearCongruentialGenerator();
        this._f = 0;
        this._rng.reset(0);
        this._samples = 0;
    }

    test(context, nextValue) {
        ++this._samples;
        this._values.push(nextValue);

        if (this._samples < NUM_SAMPLES) {
            return true;
        }

        // start truncating to keep number of samples the same size
        this._values = this._values.slice(1);

        const index = Math.floor(this._rng.next() * this._values.length);
        const sample = this._values[index];
        let distance = Point.distanceSquared(sample, nextValue) / this._d2max;

        if (distance < N2) {
            ++this._n2;
        }

        if (distance < N1) {
            ++this._n1;
        }

        if (this._samples < MIN_ITERATIONS) {
            return true;
        }

        if (this._n1 > 0) {
            this._f = LOG_E * Math.log(this._n2 / (this._n1 - 0.5));
        }


        if (this._samples < MIN_ITERATIONS + NUM_SAMPLES) {
            return true;
        }

        return this._f >= this._min && this._f <= this._max;
    }

    renderStats() {
        return 'F = ' + this._f.toFixed(3);
    }
}

Components.register(SearchCriterion, FractalDimension, false);
module.exports = FractalDimension;

