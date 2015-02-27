/* Configuration required for finding attractors */
var QuadraticMap = require('./maps/QuadraticMap'),
    LyapunovExponent = require('./criteria/LyapunovExponent'),
    DefaultRng = require('./rngs/DefaultRng');


class Configuration {
    constructor() {
        this._settlingIterations = 1000;
        this._searchIterations = 1000;
        this._totalIterations = 1000000;
        this._map = new QuadraticMap();
        this._rng = new DefaultRng();
        this._criteria = [ new LyapunovExponent() ];
    }

    get settlingIterations() { return this._settlingIterations; }
    get searchIterations() { return this._searchIterations; }
    get totalIterations() { return this._totalIterations; }
    get map() { return this._map; }
    get rng() { return this._rng; }
    get criteria() { return this._criteria; }
}

module.exports = Configuration;