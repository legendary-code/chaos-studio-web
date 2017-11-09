 let Store = require('./Store'),
     Actions = require('../actions/Actions'),
     Configuration = require('../chaos/Configuration'),
     Component = require('../chaos/Component'),
     QuadraticMap = require('../chaos/maps/QuadraticMap'),
     LyapunovExponent = require('../chaos/criteria/LyapunovExponent'),
     LinearCongruentialGenerator = require( '../chaos/rngs/LinearCongruentialGenerator'),
     WebGLRenderer = require('../chaos/renderers/WebGLRenderer'),
     DefaultColorizer = require('../chaos/Colorizer'),
     DefaultProjection = require('../chaos/Projection'),
     Cookies = require('js-cookie');

class SearchConfigurationStore extends Store {
    getInitialState() {
        let configuration;

        try {
            let cookieValue = Cookies.get('configuration');

            if (cookieValue) {
                configuration = this.ensureDefaults(Configuration.decode(cookieValue));
            }
        } catch (e) {
            console.error("Failed to read configuration from cookies: " + e);
        }

        return {
            configuration: configuration || this.createDefaultConfiguration()
        };
    }

    ensureDefaults(configuration) {
        if (!configuration) {
            return configuration;
        }

        configuration.map = configuration.map || new QuadraticMap();
        configuration.criteria = configuration.criteria ? configuration.criteria : [ new LyapunovExponent() ];
        configuration.rng = configuration.rng || new LinearCongruentialGenerator();
        configuration.renderer = configuration.renderer || new WebGLRenderer();
        configuration.projection = configuration.projection || new DefaultProjection();
        configuration.colorizer = configuration.colorizer || new DefaultColorizer();

        return configuration;
    }

    createDefaultConfiguration() {
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
        switch (action.type) {
            case Actions.RESET_SEARCH_CONFIGURATION.id:
                this.setState({configuration: this.createDefaultConfiguration()});
                break;

            case Actions.SAVE_SEARCH_CONFIGURATION.id:
                Cookies.set('configuration', action.data.encode(), { expires: 100 * 365 });
                this.setState({configuration: action.data});
                break;
        }
    }

    get configuration() {
        return this.state.configuration;
    }
}

module.exports = new SearchConfigurationStore();