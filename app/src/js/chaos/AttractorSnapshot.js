let Base64Serializer = require('../utils/Base64Serializer'),
    Base64Deserializer = require('../utils/Base64Deserializer'),
    Components = require('./Components'),
    JSEncoder = require('jsencode');

/* Represents the minimum amount of information needed to re-generate an attractor */
class AttractorSnapshot {
    constructor(map, rng, seed, startingIteration) {
        this._map = map;
        this._rng = rng;
        this._seed = seed;
        this._startingIteration = startingIteration;
    }

    get map() {
        return this._map;
    }

    get rng() {
        return this._rng;
    }

    get seed() {
        return this._seed;
    }

    get startingIteration() {
        return this._startingIteration;
    }

    static create(configuration) {
        return new AttractorSnapshot(
            configuration.map,
            configuration.rng,
            configuration.rng.seed,
            configuration.settlingIterations + configuration.searchIterations
        );
    }

    encode() {
        console.log(this._map);
        console.log(this._rng);
        return btoa(AttractorSnapshot.ENCODER.encode(this));
    }

    static decode(value) {
        return AttractorSnapshot.ENCODER.decode(atob(value));
    }
}

let encoder = new JSEncoder();
let types = [];
types.push(AttractorSnapshot);
types.push(...Components.colorizers);
types.push(...Components.criteria);
types.push(...Components.maps);
types.push(...Components.projections);
types.push(...Components.renderers);
types.push(...Components.rngs);
encoder.registerTypes(...types);
AttractorSnapshot.ENCODER = encoder;

module.exports = AttractorSnapshot;