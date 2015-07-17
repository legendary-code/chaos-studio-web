 let Store = require('./Store'),
     Actions = require('../actions/Actions'),
     Configuration = require('../chaos/Configuration'),
     QuadraticMap = require('../chaos/maps/QuadraticMap'),
     LyapunovExponent = require('../chaos/criteria/LyapunovExponent'),
     LinearCongruentialGenerator = require( '../chaos/rngs/LinearCongruentialGenerator'),
     WebGLRenderer = require('../chaos/renderers/WebGLRenderer'),
     DefaultColorizer = require('../chaos/Colorizer'),
     DefaultProjection = require('../chaos/Projection');

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
            new DefaultProjection(),
            new DefaultColorizer()
        );
    }

    invoke(action) {
    }

    get configuration() {
        return this.state.configuration;
    }
}

module.exports = new SearchConfigurationStore();