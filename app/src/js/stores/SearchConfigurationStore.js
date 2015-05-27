let Store = require('./Store'),
    Actions = require('../actions/Actions'),
    Configuration = require('../chaos/Configuration'),
    QuadraticMap = require('../chaos/maps/QuadraticMap'),
    LyapunovExponent = require('../chaos/criteria/LyapunovExponent'),
    LinearCongruentialGenerator = require( '../chaos/rngs/LinearCongruentialGenerator'),
    WebGLRenderer = require('../chaos/renderers/WebGLRenderer'),
    Perspective = require('../chaos/projections/Perspective'),
    PencilSketch = require('../chaos/colorizers/PencilSketch');

class SearchConfigurationStore extends Store {
    // TODO: read from cookies
    getInitialState() {
        return {
            configuration: this._createDefaultConfiguration()
        };
    }

    _createDefaultConfiguration() {
        return new Configuration(
            new QuadraticMap(),
            [ new LyapunovExponent() ],
            new LinearCongruentialGenerator(),
            new WebGLRenderer(),
            new Perspective(),
            new PencilSketch()
        );
    }

    invoke(action) {
    }

    get configuration() {
        return this.state.configuration;
    }
}

module.exports = new SearchConfigurationStore();