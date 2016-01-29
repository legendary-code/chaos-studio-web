import Store from './Store';
import Actions from '../actions/Actions';
import Configuration from '../chaos/Configuration';
import QuadraticMap from '../chaos/maps/QuadraticMap';
import LyapunovExponent from '../chaos/criteria/LyapunovExponent';
import LinearCongruentialGenerator from  '../chaos/rngs/LinearCongruentialGenerator';
import WebGLRenderer from '../chaos/renderers/WebGLRenderer';
import DefaultColorizer from '../chaos/Colorizer';
import DefaultProjection from '../chaos/Projection';

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

export default new SearchConfigurationStore();