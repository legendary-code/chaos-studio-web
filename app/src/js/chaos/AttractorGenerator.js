let Bounds = require('./Bounds'),
    Threading = require('../threading/Threading');

class AttractorGenerator {
    constructor(snapshot, configuration, onStatus, onComplete) {
        this._snapshot = snapshot;
        this._configuration = configuration;
        this._onStatus = onStatus;
        this._onComplete = onComplete;
    }

    generate() {
        Threading.runAsync(this._generate.bind(this));
    }

    *_generate() {
        let map = new this._snapshot.map();
        let rng = new this._snapshot.rng();
        rng.reset(this._snapshot.seed);

        let coefficients = [];
        let initialValue = [];
        let bounds = new Bounds();

        for (let i = 0; i < map.coefficients; i++) {
            coefficients.push(rng.next() * 2 - 1);
        }

        for (let i = 0; i < map.dimensions; i++) {
            initialValue.push(rng.next() * 2 - 1);
        }

        this._onStatus("Skipping initial points");

        let value = Array.slice(initialValue);

        for (let i = 0; i < this._snapshot.startingIteration; i++) {
            if (i % 10000 == 0) {
                yield null;
            }

            value = map.apply(value, coefficients);
        }

        this._onStatus("Generating points");

        let values = [];
        let remainingIterations = this._configuration.totalIterations - this._snapshot.startingIteration;

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

        this._onComplete({
            snapshot: this._snapshot,
            values: values
        });
    }
}

module.exports = AttractorGenerator;