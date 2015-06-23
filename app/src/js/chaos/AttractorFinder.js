var Context = require('./Context'),
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
        let map = isSnapshot ? this._snapshot.map() : this._configuration.map;
        let rng = isSnapshot ? this._snapshot.rng() : this._configuration.rng;
        let projection = this._configuration.projection;
        let colorizer = this._configuration.colorizer;
        let dimensions = this._configuration.map.dimensions;
        let numCoefficients = this._configuration.map.coefficients;
        let criteria = this._configuration.criteria;

        while (true) {
            yield null;

            let coefficients = [];
            let initialValue = [];
            let value = [];
            let values = [];

            rng.reset(isSnapshot ? this._snapshot.seed() : Time.now());

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
                if (isSnapshot) {
                    return;
                }
                continue;
            }

            /* reset our 'initial value' to the settled one */
            initialValue = Array.slice(value);

            /* compute bounds */
            this._onStatus("Computing bounds...");

            for (let i = 0; i < this._configuration.totalIterations; i++) {
                if (i % 10000 == 0) {
                    yield null;
                }

                value = map.apply(value, coefficients);
                if (!Point.isValid(value)) {
                    abort = true;
                    break;
                }
                bounds.update(value);
            }

            /* reset value to initial value */
            value = Array.slice(initialValue);

            /* set up our context with our computed bounds and other state */
            let context = new Context(this._configuration, map, rng, criteria, initialValue, coefficients, bounds);

            /* reset search criteria state, if any */
            for (let criterion of criteria) {
                criterion.reset(context, initialValue);
            }

            /* reset projection and colorizer */
            projection.reset();
            colorizer.reset();

            /* search + generate points */
            this._onStatus(isSnapshot ? "Generating remaining points" : "Applying search criteria...");

            let iterations = isSnapshot ?
                             this._configuration.totalIterations :
                             Math.max(this._configuration.searchIterations, this._configuration.totalIterations);

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
                    for (let criterion of criteria) {
                        let result = criterion.test(context, value, normalized);
                        if (!result) {
                            abort = true;
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

                let projected = projection.apply(context, normalized);

                if (projected.length > 0 && projected[0].constructor !== Array) {
                    projected = [ projected ];
                }

                for (let vertex of projected) {
                    let colorized = colorizer.apply(context, vertex);
                    values.push(colorized);
                }
            }

            let snapshot = AttractorSnapshot.create(this._configuration);

            this._onComplete({
                snapshot: snapshot,
                values: values
            });
            break;
        }
    }
}

module.exports = AttractorFinder;