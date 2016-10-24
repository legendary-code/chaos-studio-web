let Component = require('./Component'),
    Components = require('./Components'),
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
                Props.number("settlingIterations", "Settling Iterations", 100, 10000, { integral: true, step: 100 }),
                Props.number("searchIterations", "Search Iterations", 100, 10000, { integral: true, step: 100 }),
                Props.number("density", "Number of points to draw", 0.1, 5, { decimalPlaces: 1 })
            )
        ];
    }

    constructor(map, criteria, rng, renderer, projection, colorizer) {
        this._settlingIterations = 1000;
        this._searchIterations = 1000;
        this._density = 1.0;
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

    get density() { return this._density; }
    set density(val) { this._density = val; }

    get map() { return this._map; }
    set map(val) { this._map = val; }

    get rng() { return this._rng; }
    set rng(val) { this._rng = val; }

    get criteria() { return this._criteria; }
    set criteria(val) { this._criteria = val; }

    get renderer() { return this._renderer; }
    set renderer(val) { this._renderer = val; }

    get projection() { return this._projection; }
    set projection(val) { this._projection = val; }

    get colorizer() { return this._colorizer; }
    set colorizer(val) { this._colorizer = val; }
}

Components.register(Configuration, Configuration, true);
module.exports = Configuration;