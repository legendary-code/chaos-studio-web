import Component from './Component';
import Props from './Props';
import Map from './Map';
import SearchCriterion from './SearchCriterion';
import Rng from './Rng';
import Renderer from './Renderer';
import Projection from './Projection';
import Colorizer from './Colorizer';

/* Configuration required for finding attractors */

export default class Configuration extends Component {
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
                Props.number("settlingIterations", "Settling Iterations", 0, 10000),
                Props.number("searchIterations", "Search Iterations", 0, 100000),
                Props.number("totalIterations", "Total Iterations", 0, 1000000)
            )
        ];
    }

    constructor(map, criteria, rng, renderer, projection, colorizer) {
        super();
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
    get searchIterations() { return this._searchIterations; }

    get totalIterations() { return this._totalIterations; }
    set totalIterations(val) { this._totalIterations = val; }

    get map() { return this._map; }
    get rng() { return this._rng; }
    get criteria() { return this._criteria; }
    get renderer() { return this._renderer; }
    get projection() { return this._projection; }
    get colorizer() { return this._colorizer; }
}
