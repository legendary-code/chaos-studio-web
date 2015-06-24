/* Configuration and current search params */
class Context {
    constructor(map, rng, criteria, initialValue, coefficients, bounds) {
        this._map = map;
        this._rng = rng;
        this._criteria = criteria;
        this._initialValue = initialValue;
        this._coefficients = coefficients;
        this._bounds = bounds;
    }

    get map() { return this._map; }
    get rng() { return this._rng; }
    get criteria() { return this._criteria; }
    get initialValue() { return this._initialValue; }
    get coefficients() { return this._coefficients; }
    get bounds() { return this._bounds; }
}

module.exports = Context;