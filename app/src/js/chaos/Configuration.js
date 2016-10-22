let Component = require('./Component'),
    Props = require('./Props'),
    Map = require('./Map'),
    SearchCriterion = require('./SearchCriterion'),
    Rng = require('./Rng'),
    Renderer = require('./Renderer'),
    Projection = require('./Projection'),
    Colorizer = require('./Colorizer');

/* Configuration required for finding attractors */

class Configuration extends Component {
    static get displayName() {
        return "Settings";
    }

    static get params() {
        return [
            Props.component("map", "Map", Map),
            Props.componentSet("criteria", "Search Criteria", SearchCriterion),
            Props.component("rng", "Random Number Generator", Rng),
            Props.component("renderer", "Renderer", Renderer),
            Props.component("projection", "Projection", Projection),
            Props.component("colorizer", "Colorizer", Colorizer),
            Props.group(
                "Search Options",
                Props.number("settlingIterations", "Settling Iterations", 0, 10000, { integral: true, step: 100 }),
                Props.number("searchIterations", "Search Iterations", 0, 100000, { integral: true, step: 1000 }),
                Props.number("totalIterations", "Total Iterations", 0, 1000000, { integral: true, step: 10000 })
            )
        ];
    }

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
    set settlingIterations(val) { this._settlingIterations = val; }

    get searchIterations() { return this._searchIterations; }
    set searchIterations(val) { this._searchIterations = val; }

    get totalIterations() { return this._totalIterations; }
    set totalIterations(val) { this._totalIterations = val; }

    get map() { return this._map; }
    set map(val) { this._map = val; }

    get rng() { return this._rng; }
    get criteria() { return this._criteria; }
    get renderer() { return this._renderer; }
    get projection() { return this._projection; }
    get colorizer() { return this._colorizer; }
}

module.exports = Configuration;