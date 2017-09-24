/* Web Worker Attractor Finder */

// Make sure we load all component types
require('./chaos/Components');

const Context = require('./chaos/Context'),
      Bounds = require('./chaos/Bounds'),
      Point = require('./chaos/Point'),
      Time = require('./chaos/Time'),
      Configuration = require('./chaos/Configuration'),
      AttractorSnapshot = require('./chaos/AttractorSnapshot');

const SETTLE_ITERATIONS = 1000;
const SEARCH_ITERATIONS = 1000;

let lastStatus;

self.addEventListener('message', (e) => {
    const data = e.data;
    switch (data.action) {
        case 'start':
            doWork(
                Configuration.decode(data.configuration),
                data.viewport,
                data.snapshot && AttractorSnapshot.decode(data.snapshot)
            );
            break;
    }
});

function sendStatus(newStatus) {
    if (lastStatus === newStatus) {
        return;
    }
    lastStatus = newStatus;
    self.postMessage({event: 'status', status: newStatus});
}

function doWork(configuration, viewport, snapshot) {
    sendStatus('');
    let map = (snapshot || configuration).map;
    let rng = (snapshot || configuration).rng;
    map.initialize(!!snapshot);

    let projection = configuration.projection;
    let colorizer = configuration.colorizer;
    let dimensions = map.dimensions;
    let numCoefficients = map.coefficients;
    let criteria = configuration.criteria;
    let totalIterations = viewport.width * viewport.height * configuration.density / viewport.devicePixelRatio;

    let work = () => {
        let coefficients = [];
        let initialValue = [];
        let value;
        let values = [];

        rng.reset(snapshot ? rng.seed : Time.now());
        map.reset();

        for (let i = 0; i < numCoefficients; i++) {
            coefficients.push(rng.next() * 2 - 1);
        }

        for (let i = 0; i < dimensions; i++) {
            initialValue.push(rng.next() * 2 - 1);
        }

        value = initialValue.slice();

        let bounds = new Bounds(dimensions);

        /* set up our context with our computed bounds and other state */
        let context = new Context(map, rng, criteria, initialValue, coefficients, bounds);

        /* reset search criteria state */
        for (let criterion of criteria) {
            criterion.reset(context, initialValue);
        }

        /* settle */
        sendStatus(snapshot ? 'Settling attractor' : 'Settling potential attractor');

        for (let i = 0; i < SETTLE_ITERATIONS; i++) {
            value = map.apply(value, coefficients);
            if (!Point.isValid(value)) {
                return false;
            }

            for (let criterion of criteria) {
                if (criterion.requiresSettling) {
                    continue;
                }

                let result = criterion.test(context, value);
                if (!snapshot && !result) {
                    criterion.test(context, value);
                    return false;
                }
            }
        }

        /* reset our 'initial value' to the settled one */
        initialValue = value.slice();

        /* Compute bounds */
        sendStatus('Computing Bounds');
        for (let i = 0; i < totalIterations; i++) {
            value = map.apply(value, coefficients);
            if (!Point.isValid(value)) {
                return false;
            }

            bounds.update(value);
        }

        if (!bounds.isValid()) {
            return false;
        }

        /* reset our value to the settled one */
        value = initialValue.slice();

        /* set up our context with our computed bounds and other state */
        context = new Context(map, rng, criteria, initialValue, coefficients, bounds);

        /* reset search criteria state */
        for (let criterion of criteria) {
            criterion.reset(context, initialValue);
        }

        /* reset projection and colorizer */
        projection.reset();
        colorizer.reset();

        /* search + generate */
        sendStatus(snapshot || criteria.length === 0 ? "Generating remaining points" : "Applying search criteria");

        for (let i = 0; i < totalIterations; i++) {
            value = map.apply(value, coefficients);
            if (!Point.isValid(value)) {
                return false;
            }

            let normalized = bounds.normalize(value);
            let projected = projection.apply(context, normalized);

            if (projected.length > 0 && projected[0].constructor !== Array) {
                projected = [ projected ];
            }

            for (let vertex of projected) {
                let colorized = colorizer.apply(context, vertex);
                values.push(colorized);
            }

            if (i < SEARCH_ITERATIONS) {
                for (let criterion of criteria) {
                    if (!criterion.requiresSettling) {
                        continue;
                    }

                    let result = criterion.test(context, value);
                    if (!snapshot && !result) {
                        return false;
                    }
                }
            }

            if (!snapshot && i === SEARCH_ITERATIONS) {
                sendStatus('Generating remaining points');
            }
        }

        snapshot = new AttractorSnapshot(map, rng);

        const stats = [];
        stats.push('C = ' + numCoefficients);
        for (let criterion of criteria) {
            const stat = criterion.renderStats();
            if (stat) {
                stats.push(stat);
            }
        }

        console.log(snapshot.rng.seed);
        console.log(snapshot.encode());

        self.postMessage({
            event: 'complete',
            snapshot: snapshot.encode(),
            values: values,
            stats: stats
        });

        return true;
    };

    while (!work()) {
        // if snapshot, work should've succeed
        if (snapshot) {
            break;
        }
    }
}