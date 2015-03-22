var Context = require('./Context'),
    Bounds = require('./Bounds'),
    Point = require('./Point'),
    Time = require('./Time'),
    Threading = require('../threading/Threading');

class AttractorFinder {
    constructor(configuration, onStatus, onComplete) {
        this._configuration = configuration;
        this._onStatus = onStatus;
        this._onComplete = onComplete;
    }

    find() {
        Threading.runAsync(this._find.bind(this));
    }

    *_find() {
        let map = this._configuration.map;
        let rng = this._configuration.rng;
        let dimensions = this._configuration.map.dimensions;
        let numCoefficients = this._configuration.map.coefficients;
        let criteria = this._configuration.criteria;

        while (true) {
            yield null;

            let coefficients = [];
            let initialValue = [];
            let value = [];
            let values = [];

            rng.reset(Time.now());

            this._onStatus("Picking new coefficients...");

            for (let i = 0; i < numCoefficients; i++) {
                coefficients.push(rng.next() * 2 - 1);
            }

            for (let i = 0; i < dimensions; i++) {
                initialValue.push(rng.next() * 2 - 1);
            }

            value = Array.slice(initialValue);

            let context = new Context(this._configuration, map, rng, criteria, initialValue, coefficients);
            let bounds = new Bounds();
            let abort = false;

            /* settle */
            this._onStatus("Settling potential attractor...");

            for (let i = 0; i < this._configuration.settlingIterations; i++) {
                if (i % 10000 == 0) {
                    yield null;
                }

                value = map.apply(value, coefficients);
                if (!Point.isValid(value)) {
                    abort = true;
                    break;
                }
            }

            if (abort) {
                continue;
            }

            /* search */
            this._onStatus("Applying search criteria...");

            for (let criterion of criteria) {
                criterion.reset(context, value);
            }

            for (let i = 0; i < this._configuration.searchIterations; i++) {
                if (i % 10000 == 0) {
                    yield null;
                }

                value = map.apply(value, coefficients);
                bounds.update(value);
                values.push(value);

                if (!Point.isValid(value)) {
                    abort = true;
                    break;
                }

                for (let criterion of criteria) {
                    let result = criterion.test(context, value);
                    if (!result) {
                        abort = true;
                        break;
                    }
                }

                if (abort) {
                    break;
                }
            }

            if (abort) {
                continue;
            }

            this._onStatus("Generating remaining points");

            let remainingIterations = this._configuration.totalIterations - this._configuration.searchIterations;
            for (let i = 0; i < remainingIterations; i++) {
                if (i % 10000 == 0) {
                    yield null;
                }

                value = map.apply(value, coefficients);
                bounds.update(value);
                values.push(value);
            }

            this._onStatus("Normalizing points");

            for (let i = 0; i < values.length; i++) {
                if (i % 10000 == 0) {
                    yield null;
                }
                values[i] = bounds.normalize(values[i]);
            }

            this._onComplete(values);
            break;
        }
    }
}

module.exports = AttractorFinder;