var Store = require('./Store'),
    Actions = require('../actions/Actions'),
    Configuration = require('../chaos/Configuration'),
    QuadraticMap = require('../chaos/maps/QuadraticMap'),
    LyapunovExponent = require('../chaos/criteria/LyapunovExponent'),
    DefaultRng = require( '../chaos/rngs/DefaultRng');

class SearchConfigurationStore extends Store {
    constructor() {
        super.constructor();
        this._configuration = new Configuration(
            new QuadraticMap(),
            [ new LyapunovExponent() ],
            new DefaultRng()
        );
    }

    get configuration() {
        return this._configuration;
    }

    _invoke(action) {
        switch (action.type) {
            case Actions.CHANGE_SEARCH_CONFIGURATION:
                this._configuration = action.data;
                break;

            default:
                return false;
        }

        return true;
    }
}

module.exports = new SearchConfigurationStore();