class Rng {
    var _seed;

    get seed() { return this._seed; }
    reset(seed) { this._seed = seed; }
    next() { }
}

module.exports = Rng;