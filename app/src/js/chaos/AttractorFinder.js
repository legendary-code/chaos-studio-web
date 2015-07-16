var _ = require('underscore'),
    Context = require('./Context'),
    Bounds = require('./Bounds'),
    Point = require('./Point'),
    Time = require('./Time'),
    Threading = require('../threading/Threading'),
    AttractorSnapshot = require('./AttractorSnapshot');

class AttractorFinder {
    constructor(configuration, onStatus, onComplete, snapshot) {
        this._configuration = configuration;
        this._onStatus = onStatus;
        this._onComplete = onComplete;
        this._snapshot = snapshot;
    }

    find() {
        Threading.runAsync(this._find.bind(this));
    }

    *_find() {
        let isSnapshot = !!this._snapshot;
        let map = isSnapshot ? this._snapshot.map : this._configuration.map;
        let rng = isSnapshot ? this._snapshot.rng : this._configuration.rng;
        let projection = this._configuration.projection;
        let colorizer = this._configuration.colorizer;
        let dimensions = map.dimensions;
        let numCoefficients = map.coefficients;
        let criteria = this._configuration.criteria;
        let criteriaWithBounds = _.filter(criteria, c => c.requiresBounds);
        criteria = _.filter(criteria, c => !c.requiresBounds);

        while (true) {
            yield null;

            let coefficients = [];
            let initialValue = [];
            let value = [];
            let values = [];

            rng.reset(isSnapshot ? rng.seed : Time.now());
            this._onStatus("Seed: " + rng.seed);

            if (!isSnapshot) {
                this._onStatus("Picking new coefficients...");
            }

            for (let i = 0; i < numCoefficients; i++) {
                coefficients.push(rng.next() * 2 - 1);
            }

            for (let i = 0; i < dimensions; i++) {
                initialValue.push(rng.next() * 2 - 1);
            }

            value = Array.slice(initialValue);

            let bounds = new Bounds();
            let abort = false;

            /* settle */
            this._onStatus(isSnapshot ? "Skipping initial points" : "Settling potential attractor...");
            let settlingIterations = isSnapshot ? this._snapshot.startingIteration : this._configuration.settlingIterations;

            for (let i = 0; i < settlingIterations; i++) {
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
                if (isSnapshot) {
                    return;
                }
                continue;
            }

            /* reset our 'initial value' to the settled one */
            initialValue = Array.slice(value);

            /* set up our context with our computed bounds and other state */
            let context = new Context(map, rng, criteria, initialValue, coefficients, bounds);

            /* reset search criteria state, if any */
            if (!isSnapshot) {
                for (let criterion of criteria) {
                    criterion.reset(context, initialValue);
                }
            }

            /* compute bounds */
            this._onStatus(isSnapshot || criteria.length == 0 ? "Computing bounds..." : "Computing bounds and applying search criteria...");

            let iterations = isSnapshot ?
                             this._configuration.totalIterations :
                             Math.max(this._configuration.searchIterations, this._configuration.totalIterations);

            for (let i = 0; i < iterations; i++) {
                if (i == this._configuration.searchIterations) {
                    this._onStatus("Computing bounds...");
                }

                if (i % 10000 == 0) {
                    yield null;
                }

                value = map.apply(value, coefficients);
                if (!Point.isValid(value)) {
                    abort = true;
                    break;
                }
                bounds.update(value);

                if (!isSnapshot && i < this._configuration.searchIterations) {
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
            }

            if (abort) {
                if (isSnapshot) {
                    return;
                }
                continue;
            }

            /* reset value to initial value */
            value = Array.slice(initialValue);

            /* reset search criteria state, if any */
            if (!isSnapshot) {
                for (let criterion of criteriaWithBounds) {
                    criterion.reset(context, initialValue);
                }
            }

            /* reset projection and colorizer */
            projection.reset();
            colorizer.reset();

            /* search + generate points */
            this._onStatus(isSnapshot || criteriaWithBounds.length == 0 ? "Generating remaining points" : "Applying search criteria...");

            for (let i = 0; i < iterations; i++) {
                if (i == this._configuration.searchIterations) {
                    this._onStatus("Generating remaining points");
                }

                if (i % 10000 == 0) {
                    yield null;
                }

                value = map.apply(value, coefficients);
                if (!Point.isValid(value)) {
                    abort = true;
                    break;
                }

                let normalized = bounds.normalize(value);

                if (!isSnapshot && i < this._configuration.searchIterations) {
                    for (let criterion of criteriaWithBounds) {
                        let result = criterion.test(context, value, normalized);
                        if (!result) {
                            abort = true;
                            break;
                        }
                    }
                }

                if (abort) {
                    break;
                }

                let projected = projection.apply(context, normalized);

                if (projected.length > 0 && projected[0].constructor !== Array) {
                    projected = [ projected ];
                }

                for (let vertex of projected) {
                    let colorized = colorizer.apply(context, vertex);
                    values.push(colorized);
                }
            }

            if (abort) {
                if (isSnapshot) {
                    return;
                }
                continue;
            }

            let snapshot = AttractorSnapshot.create(this._configuration);

            this._onComplete({
                snapshot: isSnapshot ? this._snapshot : snapshot,
                values: values
            });
            break;
        }
    }
}

module.exports = AttractorFinder;