let Component = require('./Component'),
    Components = require('./Components');

/* Represents the minimum amount of information needed to re-generate an attractor */
class AttractorSnapshot extends Component {
    constructor(map, rng) {
        super();
        this._map = map;
        this._rng = rng;
    }

    get map() {
        return this._map;
    }

    set map(val) {
        this._map = val;
    }

    get rng() {
        return this._rng;
    }

    set rng(val) {
        this._rng = val;
    }

    static create(configuration) {
        return new AttractorSnapshot(
            configuration.map,
            configuration.rng
        );
    }
}

Components.register(AttractorSnapshot, AttractorSnapshot, true);
module.exports = AttractorSnapshot;