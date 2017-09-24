let _ = require('underscore'),
    Map = require('../Map'),
    Components = require('../Components');

class RandomMap extends Map {
    static get displayName() {
        return "Random";
    }

    static get description() {
        return "A randomly selected map";
    }

    get coefficients() {
        return this._map.coefficients;
    }

    get map() {
        return this._map;
    }

    set map(val) {
        this._map = val;
    }

    apply(v, c) {
        return this._map.apply(v, c);
    }

    initialize(isSnapshot) {
        if (isSnapshot) {
            this._map.initialize(isSnapshot);
            return;
        }

        let types = _.filter(Components.findTypes(Map), (type) => type !== RandomMap);
        let TMap = types[_.random(0, types.length - 1)];
        this._map = new TMap();
        this._map.initialize(isSnapshot);
    }

    reset() {
        this._map.reset();
    }
}

Components.register(Map, RandomMap, true);
module.exports = RandomMap;