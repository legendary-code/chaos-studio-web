let Base64Serializer = require('../utils/Base64Serializer'),
    Base64Deserializer = require('../utils/Base64Deserializer'),
    Components = require('./Components');

/* Represents the minimum amount of information needed to re-generate an attractor */
class AttractorSnapshot {
    constructor(TMap, TRng, seed, startingIteration) {
        this._map = TMap;
        this._rng = TRng;
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
            configuration.map.type,
            configuration.rng.type,
            configuration.rng.seed,
            configuration.settlingIterations + configuration.searchIterations
        );
    }

    encode() {
        let serializer = new Base64Serializer();
        serializer.writeString(this._map.name);
        serializer.writeString(this._rng.name);
        serializer.writeNumber(this._seed);
        serializer.writeNumber(this._startingIteration);
        return serializer.toString();
    }

    static decode(value) {
        let deserializer = new Base64Deserializer(value);
        let mapTypeName = deserializer.readString();
        let rngTypeName = deserializer.readString();

        return new AttractorSnapshot(
            Components.maps.filter(map => map.name == mapTypeName)[0],
            Components.rngs.filter(rng => rng.name == rngTypeName)[0],
            deserializer.readNumber(),
            deserializer.readNumber()
        );
    }
}

module.exports = AttractorSnapshot;