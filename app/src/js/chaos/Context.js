/* Configuration and current search params */

class Context {
    var _configuration, _criteria, _initialValue, _coefficients, _map, _rng;

    constructor(configuration, map, rng, criteria, initialValue, coefficients) {
        this._configuration = configuration;
        this._map = map;
        this._rng = rng;
        this._criteria = criteria;
        this._initialValue = initialValue;
        this._coefficients = coefficients;
    }

    get configuration() { return this._configuration; }
    get map() { return this._map; }
    get rng() { return this._rng; }
    get criteria() { return this._criteria; }
    get initialValue() { return this._initialValue; }
    get coefficients() { return this._coefficients; }
}

module.exports = Context;