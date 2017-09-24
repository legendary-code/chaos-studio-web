(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/** @preventMunge */ /* Web Worker Attractor Finder */

// Make sure we load all component types
"use strict";

require("./chaos/Components");

var Context = require("./chaos/Context"),
    Bounds = require("./chaos/Bounds"),
    Point = require("./chaos/Point"),
    Time = require("./chaos/Time"),
    Configuration = require("./chaos/Configuration"),
    AttractorSnapshot = require("./chaos/AttractorSnapshot");

var SETTLE_ITERATIONS = 1000;
var SEARCH_ITERATIONS = 1000;

var lastStatus = undefined;

self.addEventListener("message", function (e) {
    var data = e.data;
    switch (data.action) {
        case "start":
            doWork(Configuration.decode(data.configuration), data.viewport, data.snapshot && AttractorSnapshot.decode(data.snapshot));
            break;
    }
});

function sendStatus(newStatus) {
    if (lastStatus === newStatus) {
        return;
    }
    lastStatus = newStatus;
    self.postMessage({ event: "status", status: newStatus });
}

function doWork(configuration, viewport, snapshot) {
    sendStatus("");
    var map = (snapshot || configuration).map;
    var rng = (snapshot || configuration).rng;
    map.initialize(!!snapshot);

    var projection = configuration.projection;
    var colorizer = configuration.colorizer;
    var dimensions = map.dimensions;
    var numCoefficients = map.coefficients;
    var criteria = configuration.criteria;
    var totalIterations = viewport.width * viewport.height * configuration.density / viewport.devicePixelRatio;

    var work = function work() {
        var coefficients = [];
        var initialValue = [];
        var value = undefined;
        var values = [];

        rng.reset(snapshot ? rng.seed : Time.now());
        map.reset();

        for (var i = 0; i < numCoefficients; i++) {
            coefficients.push(rng.next() * 2 - 1);
        }

        for (var i = 0; i < dimensions; i++) {
            initialValue.push(rng.next() * 2 - 1);
        }

        value = initialValue.slice();

        var bounds = new Bounds(dimensions);

        /* set up our context with our computed bounds and other state */
        var context = new Context(map, rng, criteria, initialValue, coefficients, bounds);

        /* reset search criteria state */
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = criteria[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var criterion = _step.value;

                criterion.reset(context, initialValue);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        /* settle */
        sendStatus(snapshot ? "Settling attractor" : "Settling potential attractor");

        for (var i = 0; i < SETTLE_ITERATIONS; i++) {
            value = map.apply(value, coefficients);
            if (!Point.isValid(value)) {
                return false;
            }

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = criteria[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var criterion = _step2.value;

                    if (criterion.requiresSettling) {
                        continue;
                    }

                    var result = criterion.test(context, value);
                    if (!snapshot && !result) {
                        criterion.test(context, value);
                        return false;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2["return"]) {
                        _iterator2["return"]();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        /* reset our 'initial value' to the settled one */
        initialValue = value.slice();

        /* Compute bounds */
        sendStatus("Computing Bounds");
        for (var i = 0; i < totalIterations; i++) {
            value = map.apply(value, coefficients);
            if (!Point.isValid(value)) {
                return false;
            }

            bounds.update(value);
        }

        if (!bounds.isValid()) {
            return false;
        }

        /* reset our value to the settled one */
        value = initialValue.slice();

        /* set up our context with our computed bounds and other state */
        context = new Context(map, rng, criteria, initialValue, coefficients, bounds);

        /* reset search criteria state */
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
            for (var _iterator3 = criteria[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var criterion = _step3.value;

                criterion.reset(context, initialValue);
            }
        } catch (err) {
            _didIteratorError3 = true;
            _iteratorError3 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion3 && _iterator3["return"]) {
                    _iterator3["return"]();
                }
            } finally {
                if (_didIteratorError3) {
                    throw _iteratorError3;
                }
            }
        }

        /* reset projection and colorizer */
        projection.reset();
        colorizer.reset();

        /* search + generate */
        sendStatus(snapshot || criteria.length === 0 ? "Generating remaining points" : "Applying search criteria");

        for (var i = 0; i < totalIterations; i++) {
            value = map.apply(value, coefficients);
            if (!Point.isValid(value)) {
                return false;
            }

            var normalized = bounds.normalize(value);
            var projected = projection.apply(context, normalized);

            if (projected.length > 0 && projected[0].constructor !== Array) {
                projected = [projected];
            }

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = projected[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var vertex = _step4.value;

                    var colorized = colorizer.apply(context, vertex);
                    values.push(colorized);
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4["return"]) {
                        _iterator4["return"]();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            if (i < SEARCH_ITERATIONS) {
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = criteria[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var criterion = _step5.value;

                        if (!criterion.requiresSettling) {
                            continue;
                        }

                        var result = criterion.test(context, value);
                        if (!snapshot && !result) {
                            return false;
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5["return"]) {
                            _iterator5["return"]();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }

            if (!snapshot && i === SEARCH_ITERATIONS) {
                sendStatus("Generating remaining points");
            }
        }

        snapshot = new AttractorSnapshot(map, rng);

        var stats = [];
        stats.push("C = " + numCoefficients);
        var _iteratorNormalCompletion6 = true;
        var _didIteratorError6 = false;
        var _iteratorError6 = undefined;

        try {
            for (var _iterator6 = criteria[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                var criterion = _step6.value;

                var stat = criterion.renderStats();
                if (stat) {
                    stats.push(stat);
                }
            }
        } catch (err) {
            _didIteratorError6 = true;
            _iteratorError6 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion6 && _iterator6["return"]) {
                    _iterator6["return"]();
                }
            } finally {
                if (_didIteratorError6) {
                    throw _iteratorError6;
                }
            }
        }

        self.postMessage({
            event: "complete",
            snapshot: snapshot.encode(),
            values: values,
            stats: stats
        });

        return true;
    };

    while (!work()) {
        // if snapshot, work should've succeed
        if (snapshot) {
            break;
        }
    }
}

},{"./chaos/AttractorSnapshot":2,"./chaos/Bounds":3,"./chaos/Components":6,"./chaos/Configuration":7,"./chaos/Context":8,"./chaos/Point":12,"./chaos/Time":18}],2:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component"),
    Components = require("./Components");

/* Represents the minimum amount of information needed to re-generate an attractor */
for (var Component____Key in Component) {
    if (Component.hasOwnProperty(Component____Key)) {
        AttractorSnapshot[Component____Key] = Component[Component____Key];
    }
}var ____SuperProtoOfComponent = Component === null ? null : Component.prototype;AttractorSnapshot.prototype = Object.create(____SuperProtoOfComponent);AttractorSnapshot.prototype.constructor = AttractorSnapshot;AttractorSnapshot.__superConstructor__ = Component;
function AttractorSnapshot(map, rng) {
    "use strict";
    Component.call(this);
    this._map = map;
    this._rng = rng;
}

Object.defineProperty(AttractorSnapshot.prototype, "map", { configurable: true, get: function get() {
        "use strict";
        return this._map;
    } });

Object.defineProperty(AttractorSnapshot.prototype, "map", { configurable: true, set: function set(val) {
        "use strict";
        this._map = val;
    } });

Object.defineProperty(AttractorSnapshot.prototype, "rng", { configurable: true, get: function get() {
        "use strict";
        return this._rng;
    } });

Object.defineProperty(AttractorSnapshot.prototype, "rng", { configurable: true, set: function set(val) {
        "use strict";
        this._rng = val;
    } });

Components.register(AttractorSnapshot, AttractorSnapshot, true);
module.exports = AttractorSnapshot;

},{"./Component":5,"./Components":6}],3:[function(require,module,exports){
/** @preventMunge */"use strict";

var Point = require("./Point");

function Bounds(dimensions) {
    "use strict";
    this._dimensions = dimensions;
    this._min = [];
    this._max = [];

    for (var i = 0; i < this._dimensions; ++i) {
        this._min.push(Infinity);
        this._max.push(-Infinity);
    }
}

Object.defineProperty(Bounds.prototype, "update", { writable: true, configurable: true, value: function value(point) {
        "use strict";
        for (var i = 0; i < this._dimensions; ++i) {
            if (point[i] < this._min[i]) this._min[i] = point[i];
            if (point[i] > this._max[i]) this._max[i] = point[i];
        }
    } });

Object.defineProperty(Bounds.prototype, "normalize", { writable: true, configurable: true, value: function value(point) {
        "use strict";
        var normalized = [];
        for (var i = 0; i < this._dimensions; ++i) {
            normalized.push(2 * (point[i] - this._min[i]) / (this._max[i] - this._min[i]) - 1);
        }

        return normalized;
    } });

Object.defineProperty(Bounds.prototype, "isValid", { writable: true, configurable: true, value: function value() {
        "use strict";
        var extents = this.extents();

        if (!Point.isValid(this._min) || !Point.isValid(this._max)) {
            return false;
        }

        for (var i = 0; i < this._dimensions; i++) {
            if (extents[i] <= Bounds.MIN_EXTENT) {
                return false;
            }
        }

        return true;
    } });

Object.defineProperty(Bounds.prototype, "extents", { writable: true, configurable: true, value: function value() {
        "use strict";
        var e = [];

        for (var i = 0; i < this._dimensions; ++i) {
            var d = this._max[i] - this._min[i];
            e.push(Math.sqrt(d * d));
        }

        return e;
    } });

Object.defineProperty(Bounds.prototype, "diagonalSquared", { writable: true, configurable: true, value: function value() {
        "use strict";
        var diagonal = 0;

        for (var i = 0; i < this._dimensions; ++i) {
            var d = this._max[i] - this._min[i];
            diagonal += d * d;
        }

        return diagonal;
    } });

Bounds.MIN_EXTENT = 1e-8;

module.exports = Bounds;

},{"./Point":12}],4:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component"),
    Components = require("./Components");

/* Implemented to define colorizer, which affects color and alpha of vertices.
 * This does not affect things like alpha-blending, shading, etc.
 * since those are renderer specific features.  A renderer may choose
 * to ignore the color generated altogether */
for (var Component____Key in Component) {
    if (Component.hasOwnProperty(Component____Key)) {
        Colorizer[Component____Key] = Component[Component____Key];
    }
}var ____SuperProtoOfComponent = Component === null ? null : Component.prototype;Colorizer.prototype = Object.create(____SuperProtoOfComponent);Colorizer.prototype.constructor = Colorizer;Colorizer.__superConstructor__ = Component;function Colorizer() {
    "use strict";if (Component !== null) {
        Component.apply(this, arguments);
    }
}
Object.defineProperty(Colorizer, "displayName", { configurable: true, get: function get() {
        "use strict";return "Default";
    } });

Object.defineProperty(Colorizer, "description", { configurable: true, get: function get() {
        "use strict";
        return "Doesn't apply any coloration to points";
    } });

Object.defineProperty(Colorizer.prototype, "apply", { writable: true, configurable: true, value: function value(context, vertex) {
        "use strict";return vertex;
    } });
Object.defineProperty(Colorizer.prototype, "reset", { writable: true, configurable: true, value: function value() {
        "use strict";
    } });

Components.register(Colorizer, Colorizer, true);
module.exports = Colorizer;

},{"./Component":5,"./Components":6}],5:[function(require,module,exports){
/** @preventMunge */"use strict";

function Component() {
    "use strict";
}
Object.defineProperty(Component, "checkSupported", { writable: true, configurable: true, value: function value() {
        "use strict";
        return true;
    } });

Object.defineProperty(Component, "params", { configurable: true, get: function get() {
        "use strict";return [];
    } });

Object.defineProperty(Component, "displayName", { configurable: true, get: function get() {
        "use strict";
    } });

Object.defineProperty(Component, "description", { configurable: true, get: function get() {
        "use strict";
    } });

Object.defineProperty(Component.prototype, "type", { configurable: true, get: function get() {
        "use strict";return this.constructor;
    } });

module.exports = Component;

},{}],6:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component"),
    JSEncoder = require("jsencode");

var TYPES = {};

/**
 * Implements a means of registering implementations of various base component types for use in configuration
 */
function Components() {
    "use strict";
}
Object.defineProperty(Components, "register", { writable: true, configurable: true, value: function value(baseType, type, isDefault) {
        "use strict";
        if (type.checkSupported && !type.checkSupported()) {
            return;
        }

        var types = TYPES[baseType];

        if (!types) {
            types = TYPES[baseType] = [];
        }

        if (isDefault) {
            types.unshift(type);
        } else {
            types.push(type);
        }

        this._setupEncodingMethods(type);
    } });

Object.defineProperty(Components, "findTypes", { writable: true, configurable: true, value: function value(baseType) {
        "use strict";
        var types = TYPES[baseType];
        return types || [];
    } });

Object.defineProperty(Components, "allTypes", { writable: true, configurable: true, value: function value() {
        "use strict";
        var $__0;
        var allTypes = [];

        for (var baseType in TYPES) {
            if (!TYPES.hasOwnProperty(baseType)) {
                continue;
            }

            var types = TYPES[baseType];
            ($__0 = allTypes).push.apply($__0, types);
        }

        return allTypes;
    } });

// We set up encoding methods here to avoid dependency issues
Object.defineProperty(Components, "_setupEncodingMethods", { writable: true, configurable: true, value: function value(type) {
        "use strict";
        var self = this;

        Object.defineProperty(type, "decode", {
            value: function value(val) {
                return self._encoder().decode(atob(val));
            }
        });

        Object.defineProperty(type.prototype, "encode", {
            value: function value() {
                return btoa(self._encoder().encode(this));
            }
        });
    } });

Object.defineProperty(Components, "_encoder", { writable: true, configurable: true, value: function value() {
        "use strict";
        return new JSEncoder({
            includePrivateFields: false,
            ignoreUnregisteredTypes: true,
            types: Components.allTypes()
        });
    } });

Components.register(Component, Component, true);
module.exports = Components;

/* Include registered plug-ins automatically */
require('./maps/AndOrMap.js');require('./maps/CliffordMap.js');require('./maps/CubicMap.js');require('./maps/CubicOdeMap.js');require('./maps/ExponentMap.js');require('./maps/HenonMap.js');require('./maps/LorenzMap.js');require('./maps/PeterDeJongMap.js');require('./maps/PolynomialMap.js');require('./maps/PolynomialOdeMap.js');require('./maps/QuadraticMap.js');require('./maps/QuadraticOdeMap.js');require('./maps/RandomMap.js');require('./maps/RosslerMap.js');require('./maps/TentMap.js');
require('./criteria/FractalDimension.js');require('./criteria/LyapunovExponent.js');
require('./renderers/WebGLRenderer.js');
require('./rngs/DefaultRng.js');require('./rngs/LinearCongruentialGenerator.js');require('./rngs/MersenneTwister.js');

},{"./Component":5,"./criteria/FractalDimension.js":19,"./criteria/LyapunovExponent.js":20,"./maps/AndOrMap.js":21,"./maps/CliffordMap.js":22,"./maps/CubicMap.js":23,"./maps/CubicOdeMap.js":24,"./maps/ExponentMap.js":25,"./maps/HenonMap.js":26,"./maps/LorenzMap.js":27,"./maps/PeterDeJongMap.js":28,"./maps/PolynomialMap.js":29,"./maps/PolynomialOdeMap.js":30,"./maps/QuadraticMap.js":31,"./maps/QuadraticOdeMap.js":32,"./maps/RandomMap.js":33,"./maps/RosslerMap.js":34,"./maps/TentMap.js":35,"./renderers/WebGLRenderer.js":36,"./rngs/DefaultRng.js":37,"./rngs/LinearCongruentialGenerator.js":38,"./rngs/MersenneTwister.js":39,"jsencode":41}],7:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component"),
    Components = require("./Components"),
    Props = require("./Props"),
    Map = require("./Map"),
    SearchCriterion = require("./SearchCriterion"),
    Rng = require("./Rng"),
    Renderer = require("./Renderer"),
    Projection = require("./Projection"),
    Colorizer = require("./Colorizer");

/* Configuration required for finding attractors */
for (var Component____Key in Component) {
    if (Component.hasOwnProperty(Component____Key)) {
        Configuration[Component____Key] = Component[Component____Key];
    }
}var ____SuperProtoOfComponent = Component === null ? null : Component.prototype;Configuration.prototype = Object.create(____SuperProtoOfComponent);Configuration.prototype.constructor = Configuration;Configuration.__superConstructor__ = Component;
Object.defineProperty(Configuration, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Settings";
    } });

Object.defineProperty(Configuration, "params", { configurable: true, get: function get() {
        "use strict";
        return [Props.component("map", "Map", Map), Props.componentSet("criteria", "Search Criteria", SearchCriterion), Props.component("rng", "Random Number Generator", Rng), Props.component("renderer", "Renderer", Renderer), Props.component("projection", "Projection", Projection), Props.component("colorizer", "Colorizer", Colorizer), Props.group("Search Options", Props.number("density", "Number of points or lines to draw", 0.1, 5, { decimalPlaces: 1 }))];
    } });

function Configuration(map, criteria, rng, renderer, projection, colorizer) {
    "use strict";
    Component.call(this);
    this._density = 1;
    this._map = map;
    this._rng = rng;
    this._criteria = criteria;
    this._renderer = renderer;
    this._projection = projection;
    this._colorizer = colorizer;
}

Object.defineProperty(Configuration.prototype, "density", { configurable: true, get: function get() {
        "use strict";return this._density;
    } });
Object.defineProperty(Configuration.prototype, "density", { configurable: true, set: function set(val) {
        "use strict";this._density = val;
    } });

Object.defineProperty(Configuration.prototype, "map", { configurable: true, get: function get() {
        "use strict";return this._map;
    } });
Object.defineProperty(Configuration.prototype, "map", { configurable: true, set: function set(val) {
        "use strict";this._map = val;
    } });

Object.defineProperty(Configuration.prototype, "rng", { configurable: true, get: function get() {
        "use strict";return this._rng;
    } });
Object.defineProperty(Configuration.prototype, "rng", { configurable: true, set: function set(val) {
        "use strict";this._rng = val;
    } });

Object.defineProperty(Configuration.prototype, "criteria", { configurable: true, get: function get() {
        "use strict";return this._criteria;
    } });
Object.defineProperty(Configuration.prototype, "criteria", { configurable: true, set: function set(val) {
        "use strict";this._criteria = val;
    } });

Object.defineProperty(Configuration.prototype, "renderer", { configurable: true, get: function get() {
        "use strict";return this._renderer;
    } });
Object.defineProperty(Configuration.prototype, "renderer", { configurable: true, set: function set(val) {
        "use strict";this._renderer = val;
    } });

Object.defineProperty(Configuration.prototype, "projection", { configurable: true, get: function get() {
        "use strict";return this._projection;
    } });
Object.defineProperty(Configuration.prototype, "projection", { configurable: true, set: function set(val) {
        "use strict";this._projection = val;
    } });

Object.defineProperty(Configuration.prototype, "colorizer", { configurable: true, get: function get() {
        "use strict";return this._colorizer;
    } });
Object.defineProperty(Configuration.prototype, "colorizer", { configurable: true, set: function set(val) {
        "use strict";this._colorizer = val;
    } });

Components.register(Configuration, Configuration, true);
module.exports = Configuration;

},{"./Colorizer":4,"./Component":5,"./Components":6,"./Map":9,"./Projection":13,"./Props":14,"./Renderer":15,"./Rng":16,"./SearchCriterion":17}],8:[function(require,module,exports){
/** @preventMunge */ /* Configuration and current search params */

"use strict";

function Context(map, rng, criteria, initialValue, coefficients, bounds) {
    "use strict";
    this._map = map;
    this._rng = rng;
    this._criteria = criteria;
    this._initialValue = initialValue;
    this._coefficients = coefficients;
    this._bounds = bounds;
}

Object.defineProperty(Context.prototype, "map", { configurable: true, get: function get() {
        "use strict";return this._map;
    } });
Object.defineProperty(Context.prototype, "rng", { configurable: true, get: function get() {
        "use strict";return this._rng;
    } });
Object.defineProperty(Context.prototype, "criteria", { configurable: true, get: function get() {
        "use strict";return this._criteria;
    } });
Object.defineProperty(Context.prototype, "initialValue", { configurable: true, get: function get() {
        "use strict";return this._initialValue;
    } });
Object.defineProperty(Context.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";return this._coefficients;
    } });
Object.defineProperty(Context.prototype, "bounds", { configurable: true, get: function get() {
        "use strict";return this._bounds;
    } });

module.exports = Context;

},{}],9:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component");

/* Implemented to define a transform/system from one point to another */
for (var Component____Key in Component) {
    if (Component.hasOwnProperty(Component____Key)) {
        Map[Component____Key] = Component[Component____Key];
    }
}var ____SuperProtoOfComponent = Component === null ? null : Component.prototype;Map.prototype = Object.create(____SuperProtoOfComponent);Map.prototype.constructor = Map;Map.__superConstructor__ = Component;function Map() {
    "use strict";if (Component !== null) {
        Component.apply(this, arguments);
    }
}
Object.defineProperty(Map.prototype, "dimensions", { configurable: true, get: function get() {
        "use strict";return 3;
    } });
Object.defineProperty(Map.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
    } });
Object.defineProperty(Map.prototype, "reset", { writable: true, configurable: true, value: function value() {
        "use strict";
    } });
Object.defineProperty(Map.prototype, "apply", { writable: true, configurable: true, value: function value(val, coefficients) {
        "use strict";
    } });

// initialize the map before beginning search, if needed
Object.defineProperty(Map.prototype, "initialize", { writable: true, configurable: true, value: function value(isSnapshot) {
        "use strict";
    } });

module.exports = Map;

},{"./Component":5}],10:[function(require,module,exports){
/** @preventMunge */"use strict";

function fact(a, b) {
    if (b === undefined) {
        b = a;
        a = 1;
    }

    if (a > b) {
        return NaN;
    }

    var p = 1;

    while (a !== b) {
        p *= b--;
    }

    return p;
}

function ipow(a, b) {
    if (b === 0) {
        return 1;
    }

    var p = 1;

    for (var i = 0; i < b; ++i) {
        p *= a;
    }

    return p;
}

module.exports = { fact: fact, ipow: ipow };

},{}],11:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("./Map");

/* Implements a map for an ODE solved using the Euler method */
for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        OdeMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;OdeMap.prototype = Object.create(____SuperProtoOfMap);OdeMap.prototype.constructor = OdeMap;OdeMap.__superConstructor__ = Map;function OdeMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(OdeMap.prototype, "epsilon", { configurable: true, get: function get() {
        "use strict";return 0.01;
    } });

Object.defineProperty(OdeMap.prototype, "apply", { writable: true, configurable: true, value: function value(val, coefficients) {
        "use strict";
        var v = this.applyOde(val, coefficients);
        var e = this.epsilon;

        return [val[0] + e * v[0], val[1] + e * v[1], val[2] + e * v[2]];
    } });

Object.defineProperty(OdeMap.prototype, "applyOde", { writable: true, configurable: true, value: function value(val, coefficients) {
        "use strict";
    } });

module.exports = OdeMap;

},{"./Map":9}],12:[function(require,module,exports){
/** @preventMunge */"use strict";

var _ = require("underscore");

/* Defines a single point */
function Point() {
    "use strict";
}
Object.defineProperty(Point, "isValid", { writable: true, configurable: true, value: function value(point) {
        "use strict";
        var sum = _.reduce(point, function (a, b) {
            return a + b;
        }, 0);
        return !isNaN(sum) && isFinite(sum);
    } });

Object.defineProperty(Point, "distanceSquared", { writable: true, configurable: true, value: function value(p1, p2) {
        "use strict";
        var d2 = 0;

        if (p1.length !== p2.length) {
            return NaN;
        }

        for (var i = 0; i < p1.length; ++i) {
            var dv = p1[i] - p2[i];
            d2 += dv * dv;
        }

        return d2;
    } });

Object.defineProperty(Point, "distance", { writable: true, configurable: true, value: function value(p1, p2) {
        "use strict";
        return Math.sqrt(Point.distanceSquared(p1, p2));
    } });

module.exports = Point;

},{"underscore":42}],13:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component"),
    Components = require("./Components");

/* Implemented to define a transform from a normalized vertex to another normalized vertex or set of vertices */
for (var Component____Key in Component) {
    if (Component.hasOwnProperty(Component____Key)) {
        Projection[Component____Key] = Component[Component____Key];
    }
}var ____SuperProtoOfComponent = Component === null ? null : Component.prototype;Projection.prototype = Object.create(____SuperProtoOfComponent);Projection.prototype.constructor = Projection;Projection.__superConstructor__ = Component;function Projection() {
    "use strict";if (Component !== null) {
        Component.apply(this, arguments);
    }
}
Object.defineProperty(Projection, "displayName", { configurable: true, get: function get() {
        "use strict";return "Default";
    } });

Object.defineProperty(Projection, "description", { configurable: true, get: function get() {
        "use strict";
        return "Doesn't apply any projection to points";
    } });

Object.defineProperty(Projection.prototype, "apply", { writable: true, configurable: true, value: function value(context, vertex) {
        "use strict";return vertex;
    } });
Object.defineProperty(Projection.prototype, "reset", { writable: true, configurable: true, value: function value() {
        "use strict";
    } });

Components.register(Projection, Projection, true);

module.exports = Projection;

},{"./Component":5,"./Components":6}],14:[function(require,module,exports){
/** @preventMunge */"use strict";

var _ = require("underscore");
/* Parameter types for Components */

/* Used to define component attributes that can be rendered in a settings dialog */
function Props() {
    "use strict";
}
/* A numeric value */
Object.defineProperty(Props, "number", { writable: true, configurable: true, value: function value(property, label, min, max, options) {
        "use strict";
        return _.extend({}, {
            type: "number",
            property: property,
            label: label,
            min: min,
            max: max,
            range: false
        }, _.pick(options, "icon", "integral", "step", "decimalPlaces"));
    } });

Object.defineProperty(Props, "numberRange", { writable: true, configurable: true, value: function value(label, propertyMin, propertyMax, min, max, options) {
        "use strict";
        return _.extend({}, {
            type: "number",
            propertyMin: propertyMin,
            propertyMax: propertyMax,
            label: label,
            min: min,
            max: max,
            range: true
        }, _.pick(options, "icon", "integral", "step", "decimalPlaces"));
    } });

Object.defineProperty(Props, "boolean", { writable: true, configurable: true, value: function value(property, label) {
        "use strict";
        return {
            type: "boolean",
            property: property,
            label: label
        };
    } });

Object.defineProperty(Props, "component", { writable: true, configurable: true, value: function value(property, label, componentType) {
        "use strict";
        return {
            type: "component",
            property: property,
            label: label,
            componentType: componentType
        };
    } });

Object.defineProperty(Props, "componentSet", { writable: true, configurable: true, value: function value(property, label, componentType) {
        "use strict";
        return {
            type: "componentSet",
            property: property,
            label: label,
            componentType: componentType
        };
    } });

Object.defineProperty(Props, "group", { writable: true, configurable: true, value: function value(label) {
        "use strict";for (var properties = [], $__0 = 1, $__1 = arguments.length; $__0 < $__1; $__0++) properties.push(arguments[$__0]);
        return {
            type: "group",
            label: label,
            properties: properties
        };
    } });

module.exports = Props;

},{"underscore":42}],15:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component"),
    Components = require("./Components");

/* Implemented to define a renderer that is capable of rendering colored vertices to a canvas */
for (var Component____Key in Component) {
    if (Component.hasOwnProperty(Component____Key)) {
        Renderer[Component____Key] = Component[Component____Key];
    }
}var ____SuperProtoOfComponent = Component === null ? null : Component.prototype;Renderer.prototype = Object.create(____SuperProtoOfComponent);Renderer.prototype.constructor = Renderer;Renderer.__superConstructor__ = Component;function Renderer() {
    "use strict";if (Component !== null) {
        Component.apply(this, arguments);
    }
}
/* Tests whether this renderer is supported by the browser */
Object.defineProperty(Renderer, "checkSupported", { writable: true, configurable: true, value: function value() {
        "use strict";
        return true;
    } });

/* Returns a DOM element (canvas) that acts as the rendering surface */
Object.defineProperty(Renderer.prototype, "create", { writable: true, configurable: true, value: function value(viewport) {
        "use strict";
    } });

/* Destroys rendering surface and any additional state */
Object.defineProperty(Renderer.prototype, "destroy", { writable: true, configurable: true, value: function value() {
        "use strict";
    } });

/* Sets rendering data to be rendered */
Object.defineProperty(Renderer.prototype, "setRenderData", { writable: true, configurable: true, value: function value(points) {
        "use strict";
    } });

/* Render to surface */
Object.defineProperty(Renderer.prototype, "render", { writable: true, configurable: true, value: function value(rotationX, rotationY) {
        "use strict";
    } });

/* Resizes rendering surface.  The actual surface doesn't need to be resized,
   but the scene needs to know what size the surface is in order to render correctly. */
Object.defineProperty(Renderer.prototype, "resize", { writable: true, configurable: true, value: function value(width, height) {
        "use strict";
    } });

Components.register(Renderer, Renderer, true);
module.exports = Renderer;

},{"./Component":5,"./Components":6}],16:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component");

/* Implemented to define random number generator used to generate a repeatable set of pseudo-random numbers */
for (var Component____Key in Component) {
    if (Component.hasOwnProperty(Component____Key)) {
        Rng[Component____Key] = Component[Component____Key];
    }
}var ____SuperProtoOfComponent = Component === null ? null : Component.prototype;Rng.prototype = Object.create(____SuperProtoOfComponent);Rng.prototype.constructor = Rng;Rng.__superConstructor__ = Component;function Rng() {
    "use strict";if (Component !== null) {
        Component.apply(this, arguments);
    }
}
Object.defineProperty(Rng.prototype, "seed", { configurable: true, get: function get() {
        "use strict";
    } });
Object.defineProperty(Rng.prototype, "reset", { writable: true, configurable: true, value: function value(seed) {
        "use strict";
    } });
Object.defineProperty(Rng.prototype, "next", { writable: true, configurable: true, value: function value() {
        "use strict";
    } });

module.exports = Rng;

},{"./Component":5}],17:[function(require,module,exports){
/** @preventMunge */"use strict";

var Component = require("./Component");

/* Implemented to define a search criterion used to filter out undesirable strange attractors */
for (var Component____Key in Component) {
    if (Component.hasOwnProperty(Component____Key)) {
        SearchCriterion[Component____Key] = Component[Component____Key];
    }
}var ____SuperProtoOfComponent = Component === null ? null : Component.prototype;SearchCriterion.prototype = Object.create(____SuperProtoOfComponent);SearchCriterion.prototype.constructor = SearchCriterion;SearchCriterion.__superConstructor__ = Component;function SearchCriterion() {
    "use strict";if (Component !== null) {
        Component.apply(this, arguments);
    }
}
Object.defineProperty(SearchCriterion.prototype, "requiresSettling", { configurable: true, get: function get() {
        "use strict";return true;
    } });
Object.defineProperty(SearchCriterion.prototype, "test", { writable: true, configurable: true, value: function value(context, nextValue, nextValueNormalized) {
        "use strict";
    } });
Object.defineProperty(SearchCriterion.prototype, "renderStats", { writable: true, configurable: true, value: function value() {
        "use strict";
    } });
Object.defineProperty(SearchCriterion.prototype, "reset", { writable: true, configurable: true, value: function value(context, initialValue) {
        "use strict";
    } });

module.exports = SearchCriterion;

},{"./Component":5}],18:[function(require,module,exports){
/** @preventMunge */ /* Time utility */
"use strict";

function Time() {
    "use strict";
}
Object.defineProperty(Time, "now", { writable: true, configurable: true, value: function value() {
        "use strict";
        return Date.now ? Date.now() : new Date().getTime();
    } });

module.exports = Time;

},{}],19:[function(require,module,exports){
/** @preventMunge */"use strict";

var SearchCriterion = require("../SearchCriterion"),
    Point = require("../Point"),
    Props = require("../Props"),
    OdeMap = require("../OdeMap"),
    LinearCongruentialGenerator = require("../rngs/LinearCongruentialGenerator"),
    Components = require("../Components");

var TWOD = 8;
var N2 = 0.001 * TWOD;
var N1 = 0.00001 * TWOD;
var NUM_SAMPLES = 500;
var LOG_E = 0.4342944819;
var MIN_ITERATIONS = 500;

for (var SearchCriterion____Key in SearchCriterion) {
    if (SearchCriterion.hasOwnProperty(SearchCriterion____Key)) {
        FractalDimension[SearchCriterion____Key] = SearchCriterion[SearchCriterion____Key];
    }
}var ____SuperProtoOfSearchCriterion = SearchCriterion === null ? null : SearchCriterion.prototype;FractalDimension.prototype = Object.create(____SuperProtoOfSearchCriterion);FractalDimension.prototype.constructor = FractalDimension;FractalDimension.__superConstructor__ = SearchCriterion;
Object.defineProperty(FractalDimension, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Fractal Dimension";
    } });

Object.defineProperty(FractalDimension, "description", { configurable: true, get: function get() {
        "use strict";
        return "A value that describes dimensionality";
    } });

Object.defineProperty(FractalDimension, "params", { configurable: true, get: function get() {
        "use strict";
        return [Props.numberRange("Threshold", "min", "max", 0, 3, { decimalPlaces: 2 })];
    } });

function FractalDimension() {
    "use strict";
    SearchCriterion.call(this);
    this._max = 2;
    this._min = 1;
}

Object.defineProperty(FractalDimension.prototype, "max", { configurable: true, get: function get() {
        "use strict";
        return this._max;
    } });

Object.defineProperty(FractalDimension.prototype, "max", { configurable: true, set: function set(val) {
        "use strict";
        this._max = val;
    } });

Object.defineProperty(FractalDimension.prototype, "min", { configurable: true, get: function get() {
        "use strict";
        return this._min;
    } });

Object.defineProperty(FractalDimension.prototype, "min", { configurable: true, set: function set(val) {
        "use strict";
        this._min = val;
    } });

Object.defineProperty(FractalDimension.prototype, "reset", { writable: true, configurable: true, value: function value(context, initialValue) {
        "use strict";
        this._d2max = context.bounds.diagonalSquared();
        this._n1 = 0;
        this._n2 = 0;
        this._values = [];
        this._rng = new LinearCongruentialGenerator();
        this._f = 0;
        this._rng.reset(0);
        this._samples = 0;
    } });

Object.defineProperty(FractalDimension.prototype, "test", { writable: true, configurable: true, value: function value(context, nextValue) {
        "use strict";
        ++this._samples;
        this._values.push(nextValue);

        if (this._samples < NUM_SAMPLES) {
            return true;
        }

        // start truncating to keep number of samples the same size
        this._values = this._values.slice(1);

        var index = Math.floor(this._rng.next() * this._values.length);
        var sample = this._values[index];
        var distance = Point.distanceSquared(sample, nextValue) / this._d2max;

        if (distance < N2) {
            ++this._n2;
        }

        if (distance < N1) {
            ++this._n1;
        }

        if (this._samples < MIN_ITERATIONS) {
            return true;
        }

        if (this._n1 > 0) {
            this._f = LOG_E * Math.log(this._n2 / (this._n1 - 0.5));
        }

        if (this._samples < MIN_ITERATIONS + NUM_SAMPLES) {
            return true;
        }

        return this._f >= this._min && this._f <= this._max;
    } });

Object.defineProperty(FractalDimension.prototype, "renderStats", { writable: true, configurable: true, value: function value() {
        "use strict";
        return "F = " + this._f.toFixed(3);
    } });

Components.register(SearchCriterion, FractalDimension, false);
module.exports = FractalDimension;

},{"../Components":6,"../OdeMap":11,"../Point":12,"../Props":14,"../SearchCriterion":17,"../rngs/LinearCongruentialGenerator":38}],20:[function(require,module,exports){
/** @preventMunge */"use strict";

var SearchCriterion = require("../SearchCriterion"),
    Point = require("../Point"),
    Props = require("../Props"),
    OdeMap = require("../OdeMap"),
    Components = require("../Components");

var LOG2 = 0.6931471805599453;
var PRECISION = 100000000000;
var MIN_ITERATIONS = 100;

for (var SearchCriterion____Key in SearchCriterion) {
    if (SearchCriterion.hasOwnProperty(SearchCriterion____Key)) {
        LyapunovExponent[SearchCriterion____Key] = SearchCriterion[SearchCriterion____Key];
    }
}var ____SuperProtoOfSearchCriterion = SearchCriterion === null ? null : SearchCriterion.prototype;LyapunovExponent.prototype = Object.create(____SuperProtoOfSearchCriterion);LyapunovExponent.prototype.constructor = LyapunovExponent;LyapunovExponent.__superConstructor__ = SearchCriterion;
Object.defineProperty(LyapunovExponent, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Lyapunov Exponent";
    } });

Object.defineProperty(LyapunovExponent, "description", { configurable: true, get: function get() {
        "use strict";
        return "An exponent that describes stability";
    } });

Object.defineProperty(LyapunovExponent, "params", { configurable: true, get: function get() {
        "use strict";
        return [Props.numberRange("Threshold", "min", "max", 0, 1, { decimalPlaces: 2 })];
    } });

Object.defineProperty(LyapunovExponent.prototype, "requiresSettling", { configurable: true, get: function get() {
        "use strict";return false;
    } });

function LyapunovExponent() {
    "use strict";
    SearchCriterion.call(this);
    this._max = 0.15;
    this._min = 0.02;
}

Object.defineProperty(LyapunovExponent.prototype, "max", { configurable: true, get: function get() {
        "use strict";
        return this._max;
    } });

Object.defineProperty(LyapunovExponent.prototype, "max", { configurable: true, set: function set(val) {
        "use strict";
        this._max = val;
    } });

Object.defineProperty(LyapunovExponent.prototype, "min", { configurable: true, get: function get() {
        "use strict";
        return this._min;
    } });

Object.defineProperty(LyapunovExponent.prototype, "min", { configurable: true, set: function set(val) {
        "use strict";
        this._min = val;
    } });

Object.defineProperty(LyapunovExponent.prototype, "reset", { writable: true, configurable: true, value: function value(context, initialValue) {
        "use strict";
        this._innerSum = 0;
        this._delta = 1 / PRECISION;
        this._samples = 0;

        var dimensions = context.map.dimensions;
        var dv = Math.sqrt(this._delta * this._delta / dimensions);
        this._nearValue = [];
        for (var i = 0; i < 3; i++) {
            this._nearValue.push(initialValue[i] + dv);
        }
    } });

Object.defineProperty(LyapunovExponent.prototype, "test", { writable: true, configurable: true, value: function value(context, nextValue) {
        "use strict";
        /* transform our near point and compare against next value */
        this._nearValue = context.map.apply(this._nearValue, context.coefficients);
        if (!Point.isValid(this._nearValue)) {
            return false;
        }var distance = Point.distance(this._nearValue, nextValue);

        /* TODO: how to handle a distance of 0 */
        if (distance > 0) {
            this._innerSum += Math.log(distance / this._delta);
            /* readjust near point */
            for (var i = 0; i < 3; i++) {
                this._nearValue[i] = nextValue[i] + this._delta * (nextValue[i] - this._nearValue[i]) / distance;
            }
            this._samples++;
        }

        this._lyapunov = LOG2 * (this._innerSum / this._samples);

        if (context.map instanceof OdeMap) {
            this._lyapunov /= context.map.epsilon;
        }

        return this._samples < MIN_ITERATIONS || this._lyapunov >= this._min;
    } });

Object.defineProperty(LyapunovExponent.prototype, "renderStats", { writable: true, configurable: true, value: function value() {
        "use strict";
        return "L = " + this._lyapunov.toFixed(3);
    } });

Components.register(SearchCriterion, LyapunovExponent, true);
module.exports = LyapunovExponent;

},{"../Components":6,"../OdeMap":11,"../Point":12,"../Props":14,"../SearchCriterion":17}],21:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        AndOrMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;AndOrMap.prototype = Object.create(____SuperProtoOfMap);AndOrMap.prototype.constructor = AndOrMap;AndOrMap.__superConstructor__ = Map;function AndOrMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(AndOrMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "AND & OR";
    } });

Object.defineProperty(AndOrMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A map with AND and OR";
    } });

Object.defineProperty(AndOrMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 14;
    } });

Object.defineProperty(AndOrMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        return [c[0] + c[1] * v[0] + c[2] * v[1] + (c[3] * v[0] & c[4] * v[1]) + (c[5] * v[0] | c[6] * v[1]), c[7] + c[8] * v[0] + c[9] * v[1] + (c[10] * v[0] & c[11] * v[1]) + (c[12] * v[0] | c[13] * v[1]), v[0] * v[0] + v[1] * v[1]];
    } });

Components.register(Map, AndOrMap, false);
module.exports = AndOrMap;

},{"../Components":6,"../Map":9}],22:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        CliffordMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;CliffordMap.prototype = Object.create(____SuperProtoOfMap);CliffordMap.prototype.constructor = CliffordMap;CliffordMap.__superConstructor__ = Map;function CliffordMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(CliffordMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Clifford";
    } });

Object.defineProperty(CliffordMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A Clifford map";
    } });

Object.defineProperty(CliffordMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 4;
    } });

Object.defineProperty(CliffordMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        return [Math.sin(3 * c[0] * v[1]) + Math.cos(3 * c[1] * v[0]), Math.sin(3 * c[2] * v[0]) + Math.cos(3 * c[3] * v[1]), Math.sin(v[0])];
    } });

Components.register(Map, CliffordMap, false);
module.exports = CliffordMap;

},{"../Components":6,"../Map":9}],23:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        CubicMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;CubicMap.prototype = Object.create(____SuperProtoOfMap);CubicMap.prototype.constructor = CubicMap;CubicMap.__superConstructor__ = Map;function CubicMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(CubicMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Cubic";
    } });

Object.defineProperty(CubicMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A polynomial map of degree 3";
    } });

Object.defineProperty(CubicMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 60;
    } });

Object.defineProperty(CubicMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        var x = v[0],
            y = v[1],
            z = v[2];

        return [c[0] * x * x * x + c[1] * y * y * y + c[2] * z * z * z + c[3] * x * x * y + c[4] * x * x * z + c[5] * y * y * x + c[6] * y * y * z + c[7] * z * z * x + c[8] * z * z * y + c[9] * x * y * z + c[10] * x * x + c[11] * y * y + c[12] * z * z + c[13] * x * y + c[14] * x * z + c[15] * y * z + c[16] * x + c[17] * y + c[18] * z + c[19], c[20] * x * x * x + c[21] * y * y * y + c[22] * z * z * z + c[23] * x * x * y + c[24] * x * x * z + c[25] * y * y * x + c[26] * y * y * z + c[27] * z * z * x + c[28] * z * z * y + c[29] * x * y * z + c[30] * x * x + c[31] * y * y + c[32] * z * z + c[33] * x * y + c[34] * x * z + c[35] * y * z + c[36] * x + c[37] * y + c[38] * z + c[39], c[40] * x * x * x + c[41] * y * y * y + c[42] * z * z * z + c[43] * x * x * y + c[44] * x * x * z + c[45] * y * y * x + c[46] * y * y * z + c[47] * z * z * x + c[48] * z * z * y + c[49] * x * y * z + c[50] * x * x + c[51] * y * y + c[52] * z * z + c[53] * x * y + c[54] * x * z + c[55] * y * z + c[56] * x + c[57] * y + c[58] * z + c[59]];
    } });

Components.register(Map, CubicMap, true);
module.exports = CubicMap;

},{"../Components":6,"../Map":9}],24:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    OdeMap = require("../OdeMap"),
    Components = require("../Components");

for (var OdeMap____Key in OdeMap) {
    if (OdeMap.hasOwnProperty(OdeMap____Key)) {
        CubicOdeMap[OdeMap____Key] = OdeMap[OdeMap____Key];
    }
}var ____SuperProtoOfOdeMap = OdeMap === null ? null : OdeMap.prototype;CubicOdeMap.prototype = Object.create(____SuperProtoOfOdeMap);CubicOdeMap.prototype.constructor = CubicOdeMap;CubicOdeMap.__superConstructor__ = OdeMap;function CubicOdeMap() {
    "use strict";if (OdeMap !== null) {
        OdeMap.apply(this, arguments);
    }
}
Object.defineProperty(CubicOdeMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Cubic ODE";
    } });

Object.defineProperty(CubicOdeMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A polynomial ODE of degree 3";
    } });

Object.defineProperty(CubicOdeMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 60;
    } });

Object.defineProperty(CubicOdeMap.prototype, "epsilon", { configurable: true, get: function get() {
        "use strict";
        return 0.1;
    } });

Object.defineProperty(CubicOdeMap.prototype, "applyOde", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        var x = v[0],
            y = v[1],
            z = v[2];

        return [c[0] * x * x * x + c[1] * y * y * y + c[2] * z * z * z + c[3] * x * x * y + c[4] * x * x * z + c[5] * y * y * x + c[6] * y * y * z + c[7] * z * z * x + c[8] * z * z * y + c[9] * x * y * z + c[10] * x * x + c[11] * y * y + c[12] * z * z + c[13] * x * y + c[14] * x * z + c[15] * y * z + c[16] * x + c[17] * y + c[18] * z + c[19], c[20] * x * x * x + c[21] * y * y * y + c[22] * z * z * z + c[23] * x * x * y + c[24] * x * x * z + c[25] * y * y * x + c[26] * y * y * z + c[27] * z * z * x + c[28] * z * z * y + c[29] * x * y * z + c[30] * x * x + c[31] * y * y + c[32] * z * z + c[33] * x * y + c[34] * x * z + c[35] * y * z + c[36] * x + c[37] * y + c[38] * z + c[39], c[40] * x * x * x + c[41] * y * y * y + c[42] * z * z * z + c[43] * x * x * y + c[44] * x * x * z + c[45] * y * y * x + c[46] * y * y * z + c[47] * z * z * x + c[48] * z * z * y + c[49] * x * y * z + c[50] * x * x + c[51] * y * y + c[52] * z * z + c[53] * x * y + c[54] * x * z + c[55] * y * z + c[56] * x + c[57] * y + c[58] * z + c[59]];
    } });

Components.register(Map, CubicOdeMap, true);
module.exports = CubicOdeMap;

},{"../Components":6,"../Map":9,"../OdeMap":11}],25:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        ExponentMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;ExponentMap.prototype = Object.create(____SuperProtoOfMap);ExponentMap.prototype.constructor = ExponentMap;ExponentMap.__superConstructor__ = Map;function ExponentMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(ExponentMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Exponent";
    } });

Object.defineProperty(ExponentMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A map with varied exponents";
    } });

Object.defineProperty(ExponentMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 20;
    } });

Object.defineProperty(ExponentMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        var absX = Math.abs(v[0]);
        var absY = Math.abs(v[1]);
        var absZ = Math.abs(v[2]);

        return [c[0] + c[1] * v[0] + c[2] * v[1] + c[3] * v[2] + c[4] * Math.pow(absX, c[5]) + c[6] * Math.pow(absY, c[7]) + c[8] * Math.pow(absZ, c[9]), c[10] + c[11] * v[0] + c[12] * v[1] + c[13] * v[2] + c[14] * Math.pow(absX, c[15]) + c[16] * Math.pow(absY, c[17]) + c[18] * Math.pow(absZ, c[19]), v[0] * v[0] + v[1] * v[1]];
    } });

Components.register(Map, ExponentMap, false);
module.exports = ExponentMap;

},{"../Components":6,"../Map":9}],26:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        HenonMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;HenonMap.prototype = Object.create(____SuperProtoOfMap);HenonMap.prototype.constructor = HenonMap;HenonMap.__superConstructor__ = Map;function HenonMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(HenonMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Hénon";
    } });

Object.defineProperty(HenonMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A Hénon map";
    } });

Object.defineProperty(HenonMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 3;
    } });

Object.defineProperty(HenonMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        return [v[1], v[2], c[0] + c[1] * v[0] + c[2] * v[1] - v[2] * v[2]];
    } });

Components.register(Map, HenonMap, false);
module.exports = HenonMap;

},{"../Components":6,"../Map":9}],27:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    OdeMap = require("../OdeMap"),
    Components = require("../Components");

for (var OdeMap____Key in OdeMap) {
    if (OdeMap.hasOwnProperty(OdeMap____Key)) {
        LorenzMap[OdeMap____Key] = OdeMap[OdeMap____Key];
    }
}var ____SuperProtoOfOdeMap = OdeMap === null ? null : OdeMap.prototype;LorenzMap.prototype = Object.create(____SuperProtoOfOdeMap);LorenzMap.prototype.constructor = LorenzMap;LorenzMap.__superConstructor__ = OdeMap;function LorenzMap() {
    "use strict";if (OdeMap !== null) {
        OdeMap.apply(this, arguments);
    }
}
Object.defineProperty(LorenzMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Lorenz";
    } });

Object.defineProperty(LorenzMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A Lorenz map";
    } });

Object.defineProperty(LorenzMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 3;
    } });

Object.defineProperty(LorenzMap.prototype, "epsilon", { configurable: true, get: function get() {
        "use strict";
        return 0.01;
    } });

Object.defineProperty(LorenzMap.prototype, "applyOde", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        var sigma = c[0] * 10;
        var rho = c[1] * 28;
        var beta = c[2] * 2.66666666667;

        return [sigma * (v[1] - v[0]), v[0] * (rho - v[2]) - v[1], v[0] * v[1] - beta * v[2]];
    } });

Components.register(Map, LorenzMap, false);
module.exports = LorenzMap;

},{"../Components":6,"../Map":9,"../OdeMap":11}],28:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        PeterDeJongMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;PeterDeJongMap.prototype = Object.create(____SuperProtoOfMap);PeterDeJongMap.prototype.constructor = PeterDeJongMap;PeterDeJongMap.__superConstructor__ = Map;function PeterDeJongMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(PeterDeJongMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Peter De Jong";
    } });

Object.defineProperty(PeterDeJongMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A Peter De Jong map";
    } });

Object.defineProperty(PeterDeJongMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 4;
    } });

Object.defineProperty(PeterDeJongMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        return [Math.sin(3 * c[0] * v[1]) - Math.cos(3 * c[1] * v[0]), Math.sin(3 * c[2] * v[0]) - Math.cos(3 * c[3] * v[1]), Math.sin(v[0])];
    } });

Components.register(Map, PeterDeJongMap, false);
module.exports = PeterDeJongMap;

},{"../Components":6,"../Map":9}],29:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    MathExt = require("../MathExt"),
    Props = require("../Props"),
    Components = require("../Components");

var D = 3;

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        PolynomialMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;PolynomialMap.prototype = Object.create(____SuperProtoOfMap);PolynomialMap.prototype.constructor = PolynomialMap;PolynomialMap.__superConstructor__ = Map;
Object.defineProperty(PolynomialMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Polynomial";
    } });

Object.defineProperty(PolynomialMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A polynomial map of variable degree";
    } });

Object.defineProperty(PolynomialMap, "params", { configurable: true, get: function get() {
        "use strict";
        return [Props.number("degree", "Degree", 2, 10, { integral: true })];
    } });

function PolynomialMap() {
    "use strict";
    Map.call(this);
    this._degree = 4;
}

Object.defineProperty(PolynomialMap.prototype, "degree", { configurable: true, get: function get() {
        "use strict";
        return this._degree;
    } });

Object.defineProperty(PolynomialMap.prototype, "degree", { configurable: true, set: function set(val) {
        "use strict";
        this._degree = val;
    } });

Object.defineProperty(PolynomialMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return MathExt.fact(D - 1, D + this._degree) / MathExt.fact(this._degree);
    } });

Object.defineProperty(PolynomialMap.prototype, "reset", { writable: true, configurable: true, value: function value() {
        "use strict";
        // a map of powers, e.g. D = 2, degree = 2 -> [[0,0],[1,0],[0,1],[1,1],[2,0],[0,2]]
        this._powers = [];
        var loopVars = [];
        var sum = 0;

        while (true) {
            var v = undefined;
            var maxV = undefined;

            if (loopVars.length > 0) {
                do {
                    v = loopVars.splice(-1)[0];
                    sum -= v;
                    maxV = this._degree - sum;
                } while (v === maxV && loopVars.length > 0);

                if (loopVars.length === 0 && v === maxV) {
                    break;
                }

                loopVars.push(++v);
                sum += v;
            }

            while (loopVars.length < D) {
                loopVars.push(0);
            }

            this._powers.push(loopVars.slice());
        }
    } });

Object.defineProperty(PolynomialMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        var vs = [];
        var i = 0;

        for (var d = 0; d < D; ++d) {
            var sum = 0;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._powers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var powers = _step.value;

                    var p = c[i];

                    for (var n = 0; n < D; ++n) {
                        p *= MathExt.ipow(v[n], powers[n]);
                    }

                    sum += p;
                    ++i;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            vs[d] = sum;
        }

        return vs;
    } });

Components.register(Map, PolynomialMap, false);
module.exports = PolynomialMap;

},{"../Components":6,"../Map":9,"../MathExt":10,"../Props":14}],30:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    OdeMap = require("../OdeMap"),
    MathExt = require("../MathExt"),
    Props = require("../Props"),
    Components = require("../Components");

var D = 3;

for (var OdeMap____Key in OdeMap) {
    if (OdeMap.hasOwnProperty(OdeMap____Key)) {
        PolynomialOdeMap[OdeMap____Key] = OdeMap[OdeMap____Key];
    }
}var ____SuperProtoOfOdeMap = OdeMap === null ? null : OdeMap.prototype;PolynomialOdeMap.prototype = Object.create(____SuperProtoOfOdeMap);PolynomialOdeMap.prototype.constructor = PolynomialOdeMap;PolynomialOdeMap.__superConstructor__ = OdeMap;
Object.defineProperty(PolynomialOdeMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Polynomial ODE";
    } });

Object.defineProperty(PolynomialOdeMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A polynomial ODE of variable degree";
    } });

Object.defineProperty(PolynomialOdeMap, "params", { configurable: true, get: function get() {
        "use strict";
        return [Props.number("degree", "Degree", 2, 10, { integral: true })];
    } });

function PolynomialOdeMap() {
    "use strict";
    OdeMap.call(this);
    this._degree = 4;
}

Object.defineProperty(PolynomialOdeMap.prototype, "degree", { configurable: true, get: function get() {
        "use strict";
        return this._degree;
    } });

Object.defineProperty(PolynomialOdeMap.prototype, "degree", { configurable: true, set: function set(val) {
        "use strict";
        this._degree = val;
    } });

Object.defineProperty(PolynomialOdeMap.prototype, "epsilon", { configurable: true, get: function get() {
        "use strict";
        return 0.1;
    } });

Object.defineProperty(PolynomialOdeMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return MathExt.fact(D - 1, D + this._degree) / MathExt.fact(this._degree);
    } });

Object.defineProperty(PolynomialOdeMap.prototype, "reset", { writable: true, configurable: true, value: function value() {
        "use strict";
        // a map of powers, e.g. D = 2, degree = 2 -> [[0,0],[1,0],[0,1],[1,1],[2,0],[0,2]]
        this._powers = [];
        var loopVars = [];
        var sum = 0;

        while (true) {
            var v = undefined;
            var maxV = undefined;

            if (loopVars.length > 0) {
                do {
                    v = loopVars.splice(-1)[0];
                    sum -= v;
                    maxV = this._degree - sum;
                } while (v === maxV && loopVars.length > 0);

                if (loopVars.length === 0 && v === maxV) {
                    break;
                }

                loopVars.push(++v);
                sum += v;
            }

            while (loopVars.length < D) {
                loopVars.push(0);
            }

            this._powers.push(loopVars.slice());
        }
    } });

Object.defineProperty(PolynomialOdeMap.prototype, "applyOde", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        var vs = [];
        var i = 0;

        for (var d = 0; d < D; ++d) {
            var sum = 0;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this._powers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var powers = _step.value;

                    var p = c[i];

                    for (var n = 0; n < D; ++n) {
                        p *= MathExt.ipow(v[n], powers[n]);
                    }

                    sum += p;
                    ++i;
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator["return"]) {
                        _iterator["return"]();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            vs[d] = sum;
        }

        return vs;
    } });

Components.register(Map, PolynomialOdeMap, false);
module.exports = PolynomialOdeMap;

},{"../Components":6,"../Map":9,"../MathExt":10,"../OdeMap":11,"../Props":14}],31:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        QuadraticMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;QuadraticMap.prototype = Object.create(____SuperProtoOfMap);QuadraticMap.prototype.constructor = QuadraticMap;QuadraticMap.__superConstructor__ = Map;function QuadraticMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(QuadraticMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Quadratic";
    } });

Object.defineProperty(QuadraticMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A polynomial map of degree 2";
    } });

Object.defineProperty(QuadraticMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 30;
    } });

Object.defineProperty(QuadraticMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        return [v[0] * v[0] * c[0] + v[1] * v[1] * c[1] + v[2] * v[2] * c[2] + v[0] * v[1] * c[3] + v[0] * v[2] * c[4] + v[1] * v[2] * c[5] + v[0] * c[6] + v[1] * c[7] + v[2] * c[8] + c[9], v[0] * v[0] * c[10] + v[1] * v[1] * c[11] + v[2] * v[2] * c[12] + v[0] * v[1] * c[13] + v[0] * v[2] * c[14] + v[1] * v[2] * c[15] + v[0] * c[16] + v[1] * c[17] + v[2] * c[18] + c[19], v[0] * v[0] * c[20] + v[1] * v[1] * c[21] + v[2] * v[2] * c[22] + v[0] * v[1] * c[23] + v[0] * v[2] * c[24] + v[1] * v[2] * c[25] + v[0] * c[26] + v[1] * c[27] + v[2] * c[28] + c[29]];
    } });

Components.register(Map, QuadraticMap, true);
module.exports = QuadraticMap;

},{"../Components":6,"../Map":9}],32:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    OdeMap = require("../OdeMap"),
    Components = require("../Components");

for (var OdeMap____Key in OdeMap) {
    if (OdeMap.hasOwnProperty(OdeMap____Key)) {
        QuadraticOdeMap[OdeMap____Key] = OdeMap[OdeMap____Key];
    }
}var ____SuperProtoOfOdeMap = OdeMap === null ? null : OdeMap.prototype;QuadraticOdeMap.prototype = Object.create(____SuperProtoOfOdeMap);QuadraticOdeMap.prototype.constructor = QuadraticOdeMap;QuadraticOdeMap.__superConstructor__ = OdeMap;function QuadraticOdeMap() {
    "use strict";if (OdeMap !== null) {
        OdeMap.apply(this, arguments);
    }
}
Object.defineProperty(QuadraticOdeMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Quadratic ODE";
    } });

Object.defineProperty(QuadraticOdeMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A polynomial ODE of degree 2";
    } });

Object.defineProperty(QuadraticOdeMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 30;
    } });

Object.defineProperty(QuadraticOdeMap.prototype, "epsilon", { configurable: true, get: function get() {
        "use strict";
        return 0.1;
    } });

Object.defineProperty(QuadraticOdeMap.prototype, "applyOde", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        return [v[0] * v[0] * c[0] + v[1] * v[1] * c[1] + v[2] * v[2] * c[2] + v[0] * v[1] * c[3] + v[0] * v[2] * c[4] + v[1] * v[2] * c[5] + v[0] * c[6] + v[1] * c[7] + v[2] * c[8] + c[9], v[0] * v[0] * c[10] + v[1] * v[1] * c[11] + v[2] * v[2] * c[12] + v[0] * v[1] * c[13] + v[0] * v[2] * c[14] + v[1] * v[2] * c[15] + v[0] * c[16] + v[1] * c[17] + v[2] * c[18] + c[19], v[0] * v[0] * c[20] + v[1] * v[1] * c[21] + v[2] * v[2] * c[22] + v[0] * v[1] * c[23] + v[0] * v[2] * c[24] + v[1] * v[2] * c[25] + v[0] * c[26] + v[1] * c[27] + v[2] * c[28] + c[29]];
    } });

Components.register(Map, QuadraticOdeMap, true);
module.exports = QuadraticOdeMap;

},{"../Components":6,"../Map":9,"../OdeMap":11}],33:[function(require,module,exports){
/** @preventMunge */"use strict";

var _ = require("underscore"),
    Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        RandomMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;RandomMap.prototype = Object.create(____SuperProtoOfMap);RandomMap.prototype.constructor = RandomMap;RandomMap.__superConstructor__ = Map;function RandomMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(RandomMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Random";
    } });

Object.defineProperty(RandomMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A randomly selected map";
    } });

Object.defineProperty(RandomMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return this._map.coefficients;
    } });

Object.defineProperty(RandomMap.prototype, "map", { configurable: true, get: function get() {
        "use strict";
        return this._map;
    } });

Object.defineProperty(RandomMap.prototype, "map", { configurable: true, set: function set(val) {
        "use strict";
        this._map = val;
    } });

Object.defineProperty(RandomMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        return this._map.apply(v, c);
    } });

Object.defineProperty(RandomMap.prototype, "initialize", { writable: true, configurable: true, value: function value(isSnapshot) {
        "use strict";
        if (isSnapshot) {
            this._map.initialize(isSnapshot);
            return;
        }

        var types = _.filter(Components.findTypes(Map), function (type) {
            return type !== RandomMap;
        });
        var TMap = types[_.random(0, types.length - 1)];
        this._map = new TMap();
        this._map.initialize(isSnapshot);
    } });

Object.defineProperty(RandomMap.prototype, "reset", { writable: true, configurable: true, value: function value() {
        "use strict";
        this._map.reset();
    } });

Components.register(Map, RandomMap, true);
module.exports = RandomMap;

},{"../Components":6,"../Map":9,"underscore":42}],34:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    OdeMap = require("../OdeMap"),
    Components = require("../Components");

for (var OdeMap____Key in OdeMap) {
    if (OdeMap.hasOwnProperty(OdeMap____Key)) {
        RosslerMap[OdeMap____Key] = OdeMap[OdeMap____Key];
    }
}var ____SuperProtoOfOdeMap = OdeMap === null ? null : OdeMap.prototype;RosslerMap.prototype = Object.create(____SuperProtoOfOdeMap);RosslerMap.prototype.constructor = RosslerMap;RosslerMap.__superConstructor__ = OdeMap;function RosslerMap() {
    "use strict";if (OdeMap !== null) {
        OdeMap.apply(this, arguments);
    }
}
Object.defineProperty(RosslerMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Rössler";
    } });

Object.defineProperty(RosslerMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A Rössler map";
    } });

Object.defineProperty(RosslerMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 3;
    } });

Object.defineProperty(RosslerMap.prototype, "epsilon", { configurable: true, get: function get() {
        "use strict";
        return 0.01;
    } });

Object.defineProperty(RosslerMap.prototype, "applyOde", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        var a = c[0] * 0.2 * 2,
            b = c[1] * 0.2 * 2,
            c = c[2] * 5.7 * 2;

        return [-v[1] - v[2], v[0] + a * v[1], b + v[2] * (v[0] - c)];
    } });

Components.register(Map, RosslerMap, false);
module.exports = RosslerMap;

},{"../Components":6,"../Map":9,"../OdeMap":11}],35:[function(require,module,exports){
/** @preventMunge */"use strict";

var Map = require("../Map"),
    Components = require("../Components");

for (var Map____Key in Map) {
    if (Map.hasOwnProperty(Map____Key)) {
        TentMap[Map____Key] = Map[Map____Key];
    }
}var ____SuperProtoOfMap = Map === null ? null : Map.prototype;TentMap.prototype = Object.create(____SuperProtoOfMap);TentMap.prototype.constructor = TentMap;TentMap.__superConstructor__ = Map;function TentMap() {
    "use strict";if (Map !== null) {
        Map.apply(this, arguments);
    }
}
Object.defineProperty(TentMap, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Tent";
    } });

Object.defineProperty(TentMap, "description", { configurable: true, get: function get() {
        "use strict";
        return "A tent map";
    } });

Object.defineProperty(TentMap.prototype, "coefficients", { configurable: true, get: function get() {
        "use strict";
        return 10;
    } });

Object.defineProperty(TentMap.prototype, "apply", { writable: true, configurable: true, value: function value(v, c) {
        "use strict";
        return [c[0] + c[1] * v[0] + c[2] * v[1] + c[3] * Math.abs(v[0]) + c[4] * Math.abs(v[1]), c[5] + c[6] * v[0] + c[7] * v[1] + c[8] * Math.abs(v[0]) + c[9] * Math.abs(v[1]), v[0] * v[0] + v[1] * v[1]];
    } });

Components.register(Map, TentMap, false);
module.exports = TentMap;

},{"../Components":6,"../Map":9}],36:[function(require,module,exports){
/** @preventMunge */"use strict";

var m4 = require("../../utils/matrix"),
    Renderer = require("../Renderer"),
    Components = require("../Components"),
    Props = require("../Props");

var VERTEX_PROGRAM = "\nuniform mat4 rotation;\nuniform mat4 projection;\nattribute vec4 position;\nattribute vec4 color;\n\nvarying vec4 vColor;\n\nvoid main() {\n    gl_Position = projection * rotation * position;\n    gl_PointSize = 1.0;\n    vColor = color;\n}\n";

var FRAGMENT_PROGRAM = "\nprecision mediump float;\n\nvarying vec4 vColor;\n\nvoid main() {\n    gl_FragColor = vColor;\n}\n";

function degToRad(d) {
    return d * Math.PI / 180;
}

function createShader(gl, type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createVertexShader(gl) {
    return createShader(gl, gl.VERTEX_SHADER, VERTEX_PROGRAM);
}

function createFragmentShader(gl) {
    return createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_PROGRAM);
}

function createShaderProgram(gl) {
    var program = gl.createProgram();
    gl.attachShader(program, createVertexShader(gl));
    gl.attachShader(program, createFragmentShader(gl));
    gl.linkProgram(program);
    gl.useProgram(program);
    return program;
}

for (var Renderer____Key in Renderer) {
    if (Renderer.hasOwnProperty(Renderer____Key)) {
        WebGLNativeRenderer[Renderer____Key] = Renderer[Renderer____Key];
    }
}var ____SuperProtoOfRenderer = Renderer === null ? null : Renderer.prototype;WebGLNativeRenderer.prototype = Object.create(____SuperProtoOfRenderer);WebGLNativeRenderer.prototype.constructor = WebGLNativeRenderer;WebGLNativeRenderer.__superConstructor__ = Renderer;function WebGLNativeRenderer() {
    "use strict";if (Renderer !== null) {
        Renderer.apply(this, arguments);
    }
}
Object.defineProperty(WebGLNativeRenderer, "displayName", { configurable: true, get: function get() {
        "use strict";return "WebGL Native Renderer";
    } });

Object.defineProperty(WebGLNativeRenderer, "description", { configurable: true, get: function get() {
        "use strict";
        return "Uses WebGL to render graphics";
    } });

Object.defineProperty(WebGLNativeRenderer, "checkSupported", { writable: true, configurable: true, value: function value() {
        "use strict";
        try {
            var canvas = document.createElement("canvas");
            return !!(canvas.getContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
        } catch (e) {
            return false;
        }
    } });

Object.defineProperty(WebGLNativeRenderer.prototype, "create", { writable: true, configurable: true, value: function value(viewport) {
        "use strict";
        var canvas = document.createElement("canvas");
        var width = viewport.width * viewport.devicePixelRatio;
        var height = viewport.height * viewport.devicePixelRatio;

        canvas.width = width;
        canvas.height = height;
        canvas.style.width = width;
        canvas.style.height = height;

        var gl = canvas.getContext("webgl", { preserveDrawingBuffer: true }) || canvas.getContext("experimental-webgl", { preserveDrawingBuffer: true });
        var buffer = gl.createBuffer();

        var program = createShaderProgram(gl);
        var positionIndex = gl.getAttribLocation(program, "position");
        var colorIndex = gl.getAttribLocation(program, "color");

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 28, 0);
        gl.enableVertexAttribArray(positionIndex);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 28, 12);
        gl.enableVertexAttribArray(colorIndex);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.clearColor(0.88, 0.88, 0.88, 1);
        gl.clearDepth(1);
        gl.enable(gl.DEPTH_TEST);
        gl.enable(gl.BLEND);
        gl.blendEquation(gl.FUNC_ADD);
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
        gl.viewport(0, 0, width, height);

        var projectionMatrix = m4.translate(m4.perspective(degToRad(60), width / height, 0.0001, 100), 0, 0, -2.5);
        var orthographicMatrix = m4.orthographic(-1.5, 1.5, -1.5, 1.5, -2, 2);
        var projectionLocation = gl.getUniformLocation(program, "projection");
        gl.uniformMatrix4fv(projectionLocation, false, orthographicMatrix);

        this._rotationLocation = gl.getUniformLocation(program, "rotation");

        this._gl = gl;
        this._buffer = buffer;

        return canvas;
    } });

Object.defineProperty(WebGLNativeRenderer.prototype, "setRenderData", { writable: true, configurable: true, value: function value(points) {
        "use strict";
        var gl = this._gl;
        var buffer = this._buffer;

        var floats = [];

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = points[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var point = _step.value;

                // position
                for (var i = 0; i < 3; ++i) {
                    floats.push(point[i]);
                }

                // w
                //floats.push(1.0);

                // color
                for (var i = 0; i < 3; ++i) {
                    if (point.length > 3) {
                        floats.push(point[i]);
                    } else {
                        floats.push(0);
                    }
                }

                // a
                if (point.length > 6) {
                    floats.push(point[6]);
                } else {
                    floats.push(0.1);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(floats), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        this._bufferSize = points.length;
    } });

Object.defineProperty(WebGLNativeRenderer.prototype, "destroy", { writable: true, configurable: true, value: function value() {
        "use strict";
    } });

Object.defineProperty(WebGLNativeRenderer.prototype, "resize", { writable: true, configurable: true, value: function value(width, height) {
        "use strict";
        this._gl.viewport(0, 0, width, height);
    } });

Object.defineProperty(WebGLNativeRenderer.prototype, "render", { writable: true, configurable: true, value: function value(rotationX, rotationY) {
        "use strict";
        var gl = this._gl;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        var count = this._bufferSize || 0;

        if (count > 0) {
            var rotationMatrix = m4.xRotate(m4.yRotate(m4.identity(), rotationX), -rotationY);
            gl.uniformMatrix4fv(this._rotationLocation, false, rotationMatrix);
            gl.drawArrays(gl.POINTS, 0, count);
        }
    } });

Components.register(Renderer, WebGLNativeRenderer, true);
module.exports = WebGLNativeRenderer;

},{"../../utils/matrix":40,"../Components":6,"../Props":14,"../Renderer":15}],37:[function(require,module,exports){
/** @preventMunge */"use strict";

var Rng = require("../Rng");

for (var Rng____Key in Rng) {
    if (Rng.hasOwnProperty(Rng____Key)) {
        DefaultRng[Rng____Key] = Rng[Rng____Key];
    }
}var ____SuperProtoOfRng = Rng === null ? null : Rng.prototype;DefaultRng.prototype = Object.create(____SuperProtoOfRng);DefaultRng.prototype.constructor = DefaultRng;DefaultRng.__superConstructor__ = Rng;function DefaultRng() {
    "use strict";if (Rng !== null) {
        Rng.apply(this, arguments);
    }
}
Object.defineProperty(DefaultRng.prototype, "next", { writable: true, configurable: true, value: function value() {
        "use strict";
        return Math.random();
    } });

module.exports = DefaultRng;

},{"../Rng":16}],38:[function(require,module,exports){
/** @preventMunge */"use strict";

var Rng = require("../Rng"),
    Components = require("../Components");

var M = Math.pow(2, 48);
var A = 25214903917;
var C = 11;

for (var Rng____Key in Rng) {
    if (Rng.hasOwnProperty(Rng____Key)) {
        LinearCongruentialGenerator[Rng____Key] = Rng[Rng____Key];
    }
}var ____SuperProtoOfRng = Rng === null ? null : Rng.prototype;LinearCongruentialGenerator.prototype = Object.create(____SuperProtoOfRng);LinearCongruentialGenerator.prototype.constructor = LinearCongruentialGenerator;LinearCongruentialGenerator.__superConstructor__ = Rng;function LinearCongruentialGenerator() {
    "use strict";if (Rng !== null) {
        Rng.apply(this, arguments);
    }
}
Object.defineProperty(LinearCongruentialGenerator, "displayName", { configurable: true, get: function get() {
        "use strict";
        return "Linear Congruential Generator";
    } });

Object.defineProperty(LinearCongruentialGenerator, "description", { configurable: true, get: function get() {
        "use strict";
        return "Modulo arithmetic generated numbers";
    } });

Object.defineProperty(LinearCongruentialGenerator.prototype, "seed", { configurable: true, get: function get() {
        "use strict";
        return this._seed;
    } });

Object.defineProperty(LinearCongruentialGenerator.prototype, "seed", { configurable: true, set: function set(val) {
        "use strict";
        this.reset(val);
    } });

Object.defineProperty(LinearCongruentialGenerator.prototype, "reset", { writable: true, configurable: true, value: function value(seed) {
        "use strict";
        this._seed = seed;
        this._x = seed;
    } });

Object.defineProperty(LinearCongruentialGenerator.prototype, "next", { writable: true, configurable: true, value: function value() {
        "use strict";
        this._x = (A * this._x + C) % M;
        return this._x / M;
    } });

Components.register(Rng, LinearCongruentialGenerator, true);
module.exports = LinearCongruentialGenerator;

},{"../Components":6,"../Rng":16}],39:[function(require,module,exports){
/** @preventMunge */"use strict";

var Rng = require("../Rng");

for (var Rng____Key in Rng) {
  if (Rng.hasOwnProperty(Rng____Key)) {
    MersenneTwister[Rng____Key] = Rng[Rng____Key];
  }
}var ____SuperProtoOfRng = Rng === null ? null : Rng.prototype;MersenneTwister.prototype = Object.create(____SuperProtoOfRng);MersenneTwister.prototype.constructor = MersenneTwister;MersenneTwister.__superConstructor__ = Rng;function MersenneTwister() {
  "use strict";if (Rng !== null) {
    Rng.apply(this, arguments);
  }
}

module.exports = MersenneTwister;

},{"../Rng":16}],40:[function(require,module,exports){
/** @preventMunge */"use strict";

module.exports = {
    projection: function projection(width, height, depth) {
        // Note: This matrix flips the Y axis so 0 is at the top.
        return [2 / width, 0, 0, 0, 0, -2 / height, 0, 0, 0, 0, 2 / depth, 0, -1, 1, 0, 1];
    },

    multiply: function multiply(a, b) {
        var a00 = a[0];
        var a01 = a[1];
        var a02 = a[2];
        var a03 = a[3];
        var a10 = a[4];
        var a11 = a[5];
        var a12 = a[6];
        var a13 = a[7];
        var a20 = a[8];
        var a21 = a[9];
        var a22 = a[10];
        var a23 = a[11];
        var a30 = a[12];
        var a31 = a[13];
        var a32 = a[14];
        var a33 = a[15];
        var b00 = b[0];
        var b01 = b[1];
        var b02 = b[2];
        var b03 = b[3];
        var b10 = b[4];
        var b11 = b[5];
        var b12 = b[6];
        var b13 = b[7];
        var b20 = b[8];
        var b21 = b[9];
        var b22 = b[10];
        var b23 = b[11];
        var b30 = b[12];
        var b31 = b[13];
        var b32 = b[14];
        var b33 = b[15];
        return [b00 * a00 + b01 * a10 + b02 * a20 + b03 * a30, b00 * a01 + b01 * a11 + b02 * a21 + b03 * a31, b00 * a02 + b01 * a12 + b02 * a22 + b03 * a32, b00 * a03 + b01 * a13 + b02 * a23 + b03 * a33, b10 * a00 + b11 * a10 + b12 * a20 + b13 * a30, b10 * a01 + b11 * a11 + b12 * a21 + b13 * a31, b10 * a02 + b11 * a12 + b12 * a22 + b13 * a32, b10 * a03 + b11 * a13 + b12 * a23 + b13 * a33, b20 * a00 + b21 * a10 + b22 * a20 + b23 * a30, b20 * a01 + b21 * a11 + b22 * a21 + b23 * a31, b20 * a02 + b21 * a12 + b22 * a22 + b23 * a32, b20 * a03 + b21 * a13 + b22 * a23 + b23 * a33, b30 * a00 + b31 * a10 + b32 * a20 + b33 * a30, b30 * a01 + b31 * a11 + b32 * a21 + b33 * a31, b30 * a02 + b31 * a12 + b32 * a22 + b33 * a32, b30 * a03 + b31 * a13 + b32 * a23 + b33 * a33];
    },

    identity: function identity() {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    },

    translation: function translation(tx, ty, tz) {
        return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, tx, ty, tz, 1];
    },

    xRotation: function xRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1];
    },

    yRotation: function yRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1];
    },

    zRotation: function zRotation(angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);

        return [c, s, 0, 0, -s, c, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    },

    scaling: function scaling(sx, sy, sz) {
        return [sx, 0, 0, 0, 0, sy, 0, 0, 0, 0, sz, 0, 0, 0, 0, 1];
    },

    translate: function translate(m, tx, ty, tz) {
        return this.multiply(m, this.translation(tx, ty, tz));
    },

    xRotate: function xRotate(m, angleInRadians) {
        return this.multiply(m, this.xRotation(angleInRadians));
    },

    yRotate: function yRotate(m, angleInRadians) {
        return this.multiply(m, this.yRotation(angleInRadians));
    },

    zRotate: function zRotate(m, angleInRadians) {
        return this.multiply(m, this.zRotation(angleInRadians));
    },

    scale: function scale(m, sx, sy, sz) {
        return this.multiply(m, this.scaling(sx, sy, sz));
    },

    perspective: function perspective(fieldOfView, aspect, near, far) {
        var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfView);
        var rangeInv = 1 / (near - far);

        return [f / aspect, 0, 0, 0, 0, f, 0, 0, 0, 0, (near + far) * rangeInv, -1, 0, 0, near * far * rangeInv * 2, 0];
    },

    orthographic: function orthographic(left, right, bottom, top, near, far) {
        var w = right - left;
        var h = top - bottom;
        var p = far - near;

        var x = (right + left) / w;
        var y = (top + bottom) / h;
        var z = (far + near) / p;

        return [2 / w, 0, 0, 0, 0, 2 / h, 0, 0, 0, 0, -2 / p, 0, -x, -y, -z, 1];
    }
};

},{}],41:[function(require,module,exports){
(function (global){
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.JSEncode = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),DecodeStream=function(){function e(t){_classCallCheck(this,e),this._text=t,this._index=0}return _createClass(e,[{key:"reset",value:function(){this._index=0}},{key:"peek",value:function(){return this._index<this._text.length?this._text[this._index]:null}},{key:"next",value:function(){return this._index<this._text.length?this._text[this._index++]:null}},{key:"expect",value:function(e){this.expectNotEof(),this._expect(e,this.next())}},{key:"_expect",value:function(e,t){if(t!==e)throw"expected '"+e+"' at offset "+this._index}},{key:"expectEof",value:function(){if(!this.isEof())throw"expected end of input"}},{key:"expectNotEof",value:function(){if(this.isEof())throw"unexpected end of input"}},{key:"isEof",value:function(){return this._index>=this._text.length}}]),e}(),JSEncoder=function(){function e(t){_classCallCheck(this,e),this._types={},this._includePrivateFields=!1,this._ignoreUnregisteredTypes=!1,t&&(t.types&&this.registerTypes.apply(this,_toConsumableArray(t.types)),this._includePrivateFields=!!t.includePrivateFields,this._ignoreUnregisteredTypes=!!t.ignoreUnregisteredTypes)}return _createClass(e,[{key:"registerTypes",value:function(){var e=!0,t=!1,r=void 0;try{for(var n=arguments.length,o=Array(n),i=0;i<n;i++)o[i]=arguments[i];for(var a,c=o[Symbol.iterator]();!(e=(a=c.next()).done);e=!0){var u=a.value;if(u.constructor!==Function)throw"type"+u+" must be a Function";var s=this._getTypeName(u);if(!s)throw"anonymous type cannot be registered";if(this._types.hasOwnProperty(s))throw"type "+s+" already registered";this._types[s]=u}}catch(e){t=!0,r=e}finally{try{!e&&c.return&&c.return()}finally{if(t)throw r}}}},{key:"encode",value:function(e){return this._encodeAny(e)}},{key:"_getTypeName",value:function(e){var t=e.name;return void 0===t?this._guessTypeName(e):t||null}},{key:"_guessTypeName",value:function(e){var t=/function\s([^(]{1,})\(/,r=t.exec(e.toString());return r&&r.length>1?r[1].trim():null}},{key:"_hasSetter",value:function(e,t){var r=Object.getOwnPropertyDescriptor(e,t);return!r.get||r.set}},{key:"_getPropertyNames",value:function(e){if(!Object||!Object.getOwnPropertyNames){var t=[];for(var r in e)e.hasOwnProperty(r)&&t.push(r);return t}var n=e.constructor.prototype;if(e.constructor===Object||!n){var o=[],i=!0,a=!1,c=void 0;try{for(var u,s=Object.getOwnPropertyNames(e)[Symbol.iterator]();!(i=(u=s.next()).done);i=!0){var l=u.value;e.hasOwnProperty(l)&&this._hasSetter(e,l)&&o.push(l)}}catch(e){a=!0,c=e}finally{try{!i&&s.return&&s.return()}finally{if(a)throw c}}return o}var d={},y=!0,f=!1,h=void 0;try{for(var v,_=Object.getOwnPropertyNames(e)[Symbol.iterator]();!(y=(v=_.next()).done);y=!0){var p=v.value;e.hasOwnProperty(p)&&this._hasSetter(e,p)&&(d[p]=!0)}}catch(e){f=!0,h=e}finally{try{!y&&_.return&&_.return()}finally{if(f)throw h}}var x=!0,g=!1,k=void 0;try{for(var m,w=Object.getOwnPropertyNames(n)[Symbol.iterator]();!(x=(m=w.next()).done);x=!0){var b=m.value;n.hasOwnProperty(b)&&this._hasSetter(n,b)&&(d[b]=!0)}}catch(e){g=!0,k=e}finally{try{!x&&w.return&&w.return()}finally{if(g)throw k}}var N=[];for(var S in d)d.hasOwnProperty(S)&&N.push(S);return N}},{key:"_canEncode",value:function(e){if(void 0===e||null==e)return!0;switch(e.constructor){case String:case Number:case Boolean:case Array:case Object:return!0;case Function:return!1}return e.constructor.constructor===Function}},{key:"_encodeAny",value:function(e){if(void 0===e)return this._encodeUndefined();if(null===e)return this._encodeNull();switch(e.constructor){case String:return this._encodeString(e);case Number:return this._encodeNumber(e);case Boolean:return this._encodeBoolean(e);case Array:return this._encodeArray(e);case Object:return this._encodeDictionary(e);case Function:throw"cannot encode Function"}if(e.constructor.constructor===Function)return this._encodeObject(e);throw"unable to encode unsupported type "+e.constructor.name}},{key:"_encodeUndefined",value:function(){return"u"}},{key:"_encodeNull",value:function(){return"n"}},{key:"_encodeString",value:function(e){return e.length+":"+e}},{key:"_encodeNumber",value:function(e){return"("+e+")"}},{key:"_encodeBoolean",value:function(e){return e?"t":"f"}},{key:"_encodeArray",value:function(e){var t="[",r=!0,n=!1,o=void 0;try{for(var i,a=e[Symbol.iterator]();!(r=(i=a.next()).done);r=!0){var c=i.value;this._canEncode(c)&&(t+=this._encodeAny(c))}}catch(e){n=!0,o=e}finally{try{!r&&a.return&&a.return()}finally{if(n)throw o}}return t+"]"}},{key:"_encodeDictionary",value:function(e){var t="{",r=!0,n=!1,o=void 0;try{for(var i,a=this._getPropertyNames(e)[Symbol.iterator]();!(r=(i=a.next()).done);r=!0){var c=i.value;this._canEncode(e[c])&&(t+=this._encodeString(c),t+=this._encodeAny(e[c]))}}catch(e){n=!0,o=e}finally{try{!r&&a.return&&a.return()}finally{if(n)throw o}}return t+"}"}},{key:"_encodeObject",value:function(e){var t=this._getTypeName(e.constructor);if(!t)throw"could not determine type for constructor: "+e.constructor+", value: "+JSON.stringify(e);var r="<"+this._encodeString(t),n=!0,o=!1,i=void 0;try{for(var a,c=this._getPropertyNames(e)[Symbol.iterator]();!(n=(a=c.next()).done);n=!0){var u=a.value;this._shouldEncodeField(e,u)&&(r+=this._encodeString(u),r+=this._encodeAny(e[u]))}}catch(e){o=!0,i=e}finally{try{!n&&c.return&&c.return()}finally{if(o)throw i}}return r+">"}},{key:"_allowedFieldName",value:function(e){return!(!e||e.constructor!==String)&&(0!==e.indexOf("_")||this._includePrivateFields)}},{key:"_shouldEncodeField",value:function(e,t){return!!this._canEncode(e[t])&&this._allowedFieldName(t)}},{key:"decode",value:function(e){var t=new DecodeStream(e),r=this._decodeAny(t);return t.expectEof(),r}},{key:"_decodeAny",value:function(e){switch(e.expectNotEof(),e.peek()){case"u":return this._decodeUndefined(e);case"n":return this._decodeNull(e);case"(":return this._decodeNumber(e);case"t":case"f":return this._decodeBoolean(e);case"[":return this._decodeArray(e);case"{":return this._decodeDictionary(e);case"<":return this._decodeObject(e)}return this._decodeString(e)}},{key:"_decodeUndefined",value:function(e){e.expect("u")}},{key:"_decodeNull",value:function(e){return e.expect("n"),null}},{key:"_decodeString",value:function(e){for(var t="",r="";!e.isEof()&&this._isNumber(e.peek());)t+=e.next();var n=Number(t);if(Math.floor(n)!==n||n<0)throw t+" is not a valid length value for string";e.expect(":");for(var o=0;o<n;++o)e.expectNotEof(),r+=e.next();return r}},{key:"_decodeNumber",value:function(e){var t="";for(e.expect("(");!e.isEof()&&")"!=e.peek();)t+=e.next();e.expect(")");var r=Number(t);if(isNaN(r))throw t+" is not a valid Number value";return r}},{key:"_decodeBoolean",value:function(e){if(e.expectNotEof(),e.peek("t")||e.peek("f"))return"t"===e.next();throw e.peek()+" is not a valid Boolean value"}},{key:"_decodeArray",value:function(e){var t=[];for(e.expect("[");!e.isEof()&&"]"!=e.peek();)t.push(this._decodeAny(e));return e.expect("]"),t}},{key:"_decodeDictionary",value:function(e){var t={};for(e.expect("{");!e.isEof()&&"}"!=e.peek();){var r=this._decodeString(e);t[r]=this._decodeAny(e)}return e.expect("}"),t}},{key:"_decodeObject",value:function(e){e.expect("<");var t=this._decodeString(e),r=!1;if(!this._types.hasOwnProperty(t)){if(!this._ignoreUnregisteredTypes)throw t+" is not a known registered type";r=!0}for(var n=this._types[t],o=n?new n:{};!e.isEof()&&">"!==e.peek();){var i=this._decodeString(e),a=this._decodeAny(e);this._allowedFieldName(i)&&(o[i]=a)}return e.expect(">"),r?null:o}},{key:"_isNumber",value:function(e){return!isNaN(Number(e))}}]),e}();exports.default=JSEncoder,module.exports=exports.default;

},{}]},{},[1])(1)
});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],42:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[1]);
