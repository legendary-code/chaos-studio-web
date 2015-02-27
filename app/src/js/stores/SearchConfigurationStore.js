var Store = require('./Store'),
    Actions = require('../actions/Actions'),
    QuadraticMap = require('../chaos/maps/QuadraticMap'),
    LyapunovExponent = require('../chaos/criteria/LyapunovExponent'),
    DefaultRng = require( '../chaos/rngs/DefaultRng');

class SearchConfigurationStore extends Store {
    constructor() {
        super.constructor();
        this._configuration = {
            map: new QuadraticMap(),
            criteria: [ new LyapunovExponent() ],
            rng: new DefaultRng()
        };
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

    get configuration() {
        return this._configuration;
    }
}

module.exports = new SearchConfigurationStore();