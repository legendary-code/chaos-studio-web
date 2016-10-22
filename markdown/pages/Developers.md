#### Introduction
Looking to contribute some cool new map or perhaps a better random number
generator algorithm, or a cool new render visualization?  This is the
place for you!

#### Contributing
The source can be found here: [https://github.com/legendary-code/chaos-studio-web](https://github.com/legendary-code/chaos-studio-web)

If you wish to contribute, clone the repository, create a branch and make
your changes there.  Afterwards, push your branch up and create a pull
request:

```bash
git clone git@github.com:legendary-code/chaos-studio-web.git
cd chaos-studio-web
git checkout -B your_branch_name
git commit -am "Your changes commit message"
git push -u origin your_branch_name
```
 
I've severely slacked in writing tests, so, please, make sure
you test the new feature you implement by running it locally.

```bash
npm install
npm install -g gulp
gulp serve
```

#### Architecture
To get started, I'm going to give the high-level architecture of all the
pieces that work together to run and render a strange attractor.  All
these various pieces are configured and contained within a class called
`Configuration`.  The bulk of the work of searching for a strange attractor
happens inside the `AttractorFinder` class, given a configuration.  In a
configuration, you can configure a `Map`, a set of `SearchCriterion`, a
`Rng` (random number generator), a `Renderer`, a `Projection`, and finally
a `Colorizer`.

The first thing `AttractorFinder` will do is use the provided `Rng` to 
generate a set of random coefficients for your `Map`.  It will also select
an initial value and start iterating over the map.  It will use the set
of `SearchCriterion` to test each point.  If any of the tests fail, it
will reject the set of chosen coefficients and continue the search process
again.  If all the tests pass, the finder will continue iterating over the
map, generating the actual points that will be used to render the strange
attractor.  Each point generated will go through the `Projection` to apply
any custom deformations or projections, the `Colorizer` to give the points
color, and then finally rendered using the `Renderer`.

#### Components
All the various functionality that's been implemented for things like
random number generators, maps, renderers, and so forth have been
implemented in an organized components API.  All components are
implemented in the latest version of JavaScript: ECMAScript 6.  The next
few sections will go over all the various component classes that can be
extended to implement new features.

##### Component
This is the base class for all components that can be implemented. When
implementing a new component, you'll almost never extend this class
directly, but instead, you'll be extending a subclass that is more
specific to the kind of component you wish to implement.  If you wish
to add a new map, you would extend the `Map` component.  

All components must implement at minimum, two static getters for the
`displayName` and `description` of the component, which will appear in
the settings dialog.  Components may also specify a static getter for
configuration `params` that can be configured in the settings dialog.

In order for a component to be usable, it must also be registered with
the `Components` helper class:

```js
let Map = require('../Map'),
    Props = require('../Props'),
    Components = require('../Components');

class MyAwesomeMap extends Map {
    // Required
    static get displayName() {
        return "My Awesome Map";
    }

    // Required
    static get description() {
        return "A map made of pure awesomeness";
    }
    
    // Optional
    static get params() {
        return [
            Props.number("Theta", "theta", 0.0, 1.0, { decimalPlaces: 2 })
        ];
    }
    
    get theta() {
        return this._theta;
    }
    
    set theta(val) {
        this._theta = val;
    }

    // Can be used for default param values 
    constructor() {
        this._theta = 0.4;
    }
}

Components.register(Map, MyAwesomeMap, false);
module.exports = MyAwesomeMap;
```

Each base component type may have additional things that may need to be
implemented, which will be covered in their respective sections below.

##### Map
This is the heart and soul of all strange attractors.  A map defines the
set of equations that are used to find these interesting shapes, given
a randomly selected set of coefficients.

A map has two getters that can be overridden, and a method for transforming
a single point.  If we wanted to implement a map for the Logistic Equation,
it might look something like this:

```
let Map = require('../Map'),
    Components = require('../Components');

class LogisticMap extends Map {
    // Required
    static get displayName() {
        return "Logistic";
    }

    // Required
    static get description() {
        return "A map of the Logistic Equation";
    }
    
    // Optional, default returns 3
    // (Using a value other than 3 is untested as some old code may
    // still assume everything is 3 dimensions.)
    get dimensions() {
        return 1;
    }

    // Required, the number of coefficients your map uses
    get coefficients() {
        return 1;
    }

    // Required, apply the function
    apply(v, c) {
        return [
            c[0] * v[0] * (1 - v[0]);
        ];
    }
}

Components.register(Map, LogisticMap, false);
module.exports = LogisticMap;
```

Note that `dimensions` and `coefficients` here are not static.  This means
that you could create a map that depending on how its configured, might
have different dimensionality or a different number of required coefficients.

##### Rng
This component is extended to implement a custom random number generator,
used to generate the random coefficients of the map and perhaps other values.

A common random number generator is the linear congruential generator, which
uses modulo arithmetic to generate numbers.  It's implemented like this:

```
let Rng = require('../Rng'),
    Components = require('../Components');

const M = Math.pow(2, 48);
const A = 25214903917;
const C = 11;

class LinearCongruentialGenerator extends Rng {
    // Required
    static get displayName() {
        return "Linear Congruential Generator";
    }

    // Required
    static get description() {
        return "Modulo arithmetic generated numbers";
    }

    // Required, get the seed value
    get seed() {
        return this._seed;
    }
    
    // Required, set the seed and reset internal state
    reset(seed) {
        this._seed = this._x = seed;
    }

    // Required, generate the next number, [0...1]
    next() {
        this._x = (A * this._x + C) % M;
        return (this._x / M);
    }
}

Components.register(Rng, LinearCongruentialGenerator, true);
module.exports = LinearCongruentialGenerator;
```

Currently, the seed is picked using the system time and will always be
and integer.  Each time `next()` is called, the next pseudo-random value
should be returned. In order to be able to generate an attractor more
than once, the `Rng` *must* generate the same sequence of numbers when
reset with the same seed value.  The value that `next()` returns should
be between `0` and `1`.

##### SearchCriterion
This component is extended to implement a criterion that a set of initial
points must pass in order for the set of randomly chosen coefficients to
be deemed as having generated a strange attractor or some other interesting
system.  The criteria that is most often used is the `LyapunovExponent`
criteria, which will determine whether your system is chaotic, essentially,
a strange attractor.

Other interesting criteria could be added to test
things like whether the attractor is oblong, how high of a fractal dimension
it occupies, and so forth.  Adding too many criteria will result in more
computations to find attractors and may slow the search significiantly.

If you wanted to create a criterion to test for only positive-valued points
it could look something like this:

```
var SearchCriterion = require('../SearchCriterion'),
    Props = require('../Props'),
    Components = require('../Components');

class PositiveOnly extends SearchCriterion {
    // Required
    static get displayName() {
        return "Positive Only";
    }

    // Required
    static get description() {
        return "An exponent that describes stability";
    }

    // Optional
    static get params() {
        return [
            Props.number("minIterations", "Minimum Iterations", 1, 1000, { integral: true, step: 10 })
        ];
    }
    
    // Can be used for default param values 
    constructor() {
        this._minIterations = 1000;
    }
    
    // Optional
    static get requiresBounds() { 
        return false; 
    }

    // Required, called each time we begin a new search
    reset(context, initialValue) {
        this._samples = 0;
    }

    // Required, called for each point when searching
    test(context, nextValue, nextValueNormalized) {
        this._samples++;
        
        if (this._samples < this._minIterations) {
            // Wait until we've reached minimum number of iterations
            // before we start testing
            return true;
        }

        nextValue.forEach(function(value) {
            if (value > 0) {
                return false;
            }
        });
    }
}

Components.register(SearchCriterion, PositiveOnly, false);
module.exports = PositiveOnly;
```

In this code sample, we add a parameter `minIterations`, which is used to
control when we actually begin considering points for testing.  This is
important because the very first few iterations may have points that
jump around a lot, so if your test is sensitive to change over iterations,
it's best to skip the first few iterations.  During the search phase and
render phase, there's a phase called 'settling' the attractor, which
basically discards a bunch of points because of this erratic behavior, as
the values are attracting towards the basin of attraction.

##### Projection
This component is extended to implement a projection that can be used to
deform a set of points in some way before being passed off to the `Colorizer`.
This is analogous to a geometry shader in the shader pipeline of a GPU.
If you wanted to implement a projection that distorts the points by taking
the square root of the coordinate values, it would look something like this:

```
let _ = require('underscore'),
    Projection = require('../Projection'),
    Components = require('../Components');

class SquareRootDistortion extends Projection {
    // Required
    static get displayName() {
        return "Square Root Distortion";
    }

    // Required
    static get description() {
        return "Takes the square root of coordinate values";
    }

    // Required, apply the projection
    apply(context, vertex) {
        return _.map(
            vertex,
            function(val) {
                return Math.sqrt(val); 
            }
        ); 
    }
    
    // Optional, reset if projection is stateful
    reset() {
    }
}

Components.register(Projection, SquareRootDistortion, false);
module.exports = SquareRootDistortion;
```

Note that the `apply()` method can return an array of numbers that represents
the projected point, or, an array of projected/generated points. This could
be leveraged to do something like projecting a point into two points
separated to simulate stereoscopy.  The point value coming in is also always
normalized.

##### Colorizer
This component is extended to implement a colorizer which will apply color
to all given points.  I can be used to color points in interesting ways
and is analogous to the raster or fragment shader in a shader pipeline of
a GPU.  If you wanted to create a colorizer that makes all points red, it
might look something like this:

```
let Colorizer = require('../Colorizer'),
    Components = require('../Components');

class RedShade extends Colorizer {
    // Required
    static get displayName() {
        return "Red Shade";
    }

    // Required
    static get description() {
        return "Colorizes pixels red";
    }

    // Required, apply the colorization
    apply(context, vertex) {
        vertex.push(1); // r
        vertex.push(0); // g
        vertex.push(0); // b
        vertex.push(1); // a
        return vertex;
    }
    
    // Optional, reset if projection is stateful
    reset() {
    }
}

Components.register(Colorizer, RedShade, false);
module.exports = Colorizer;
```

Note that the format of the output vertices is highly dependent on the
renderer used, although, the ideal convention would be an array that
consists of the coordinates, followed by `red`, `green`, `blue`, and `alpha`
color values.

##### Renderer
This component is extended to implement the rendering of a set of projected,
colorized points to an HTML canvas.  Implementing one is fairly complex
and the given WebGLRenderer will suit most of your needs.  Below is the
base component definition:

```
let Component = require('./Component');

/* Implemented to define a renderer that is capable of rendering colored vertices to a canvas */
class Renderer extends Component {
    /* Tests whether this renderer is supported by the browser */
    static checkSupported() {
        return true;
    }

    /* Returns a DOM element (canvas) that acts as the rendering surface */
    create(width, height) { }

    /* Destroys rendering surface and any additional state */
    destroy() { }

    /* Sets rendering data to be rendered */
    setRenderData(points) { }

    /* Render to surface */
    render(rotationX, rotationY) { }

    /* Resizes rendering surface.  The actual surface doesn't need to be resized,
       but the scene needs to know what size the surface is in order to render correctly. */
    resize(width, height) { }
}

module.exports = Renderer;
```

#### Conclusion
That covers most of the things you can easily add on to, in order to add
new interesting maps, visualizations and so forth.  Most code not directly
related to front-end rendering resides in `src/js/chaos`, whereas all
React-related code resides in `src/js/components` and `src/js/pages`.