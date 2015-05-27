/* Configuration required for finding attractors */
class Configuration {
    constructor(map, criteria, rng, renderer, projection, colorizer) {
        this._settlingIterations = 1000;
        this._searchIterations = 1000;
        this._totalIterations = 1000000;
        this._map = map;
        this._rng = rng;
        this._criteria = criteria;
        this._renderer = renderer;
        this._projection = projection;
        this._colorizer = colorizer;
    }

    get settlingIterations() { return this._settlingIterations; }
    get searchIterations() { return this._searchIterations; }

    get totalIterations() { return this._totalIterations; }
    set totalIterations(value) { this._totalIterations = value; }

    get map() { return this._map; }
    get rng() { return this._rng; }
    get criteria() { return this._criteria; }
    get renderer() { return this._renderer; }
    get projection() { return this._projection; }
    get colorizer() { return this._colorizer; }
}

module.exports = Configuration;