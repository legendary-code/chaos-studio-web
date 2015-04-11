var Store = require('./Store'),
    Actions = require('../actions/Actions'),
    Configuration = require('../chaos/Configuration'),
    QuadraticMap = require('../chaos/maps/QuadraticMap'),
    LyapunovExponent = require('../chaos/criteria/LyapunovExponent'),
    LinearCongruentialGenerator = require( '../chaos/rngs/LinearCongruentialGenerator'),
    WebGLRenderer = require('../chaos/renderers/WebGLRenderer');

class SearchConfigurationStore extends Store {
    getInitialState() {
        return {
            configuration:
                new Configuration(
                    new QuadraticMap(),
                    [ new LyapunovExponent() ],
                    new LinearCongruentialGenerator(),
                    new WebGLRenderer()
                )
        };
    }

    invoke(action) {
        switch (action.type) {
            case Actions.CHANGE_SEARCH_CONFIGURATION:
                setState({
                    configuration: action.data
                });
                break;
        }
    }
}

module.exports = new SearchConfigurationStore();