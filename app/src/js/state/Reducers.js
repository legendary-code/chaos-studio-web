import {
    TOGGLE_NAV, HIDE_NAV, SET_TITLE, EDIT_CONFIGURATION, APPLY_CONFIGURATION,
    REJECT_CONFIGURATION
} from './Actions';
import Immutable from 'immutable';
import Configuration from '../chaos/Configuration';
import QuadraticMap from '../chaos/maps/QuadraticMap';
import LyapunovExponent from '../chaos/criteria/LyapunovExponent';
import LinearCongruentialGenerator from '../chaos/rngs/LinearCongruentialGenerator';
import WebGLRenderer from '../chaos/renderers/WebGLRenderer';
import DefaultProjection from '../chaos/Projection';
import DefaultColorizer from '../chaos/Colorizer';

/* TODO: Load from cookies or local storage */
const initialState = Immutable.fromJS({
    nav: {
        hidden: true
    },
    title: 'Chaos Studio',
    configuration:  {
        current: new Configuration(
            new QuadraticMap(),
            [ new LyapunovExponent() ],
            new LinearCongruentialGenerator(),
            new WebGLRenderer(),
            new DefaultProjection(),
            new DefaultColorizer()
        )
    }
});

export function chaosStudioApp(state = initialState, action = null) {
    switch(action.type) {
        case TOGGLE_NAV:
            return state.updateIn(['nav', 'hidden'], true, value => !value);

        case HIDE_NAV:
            return state.updateIn(['nav', 'hidden'], true, value => true);

        case SET_TITLE:
            return state.set('title', action.title);

        case EDIT_CONFIGURATION:
            return state.setIn(['configuration', 'new'], state.getIn(['configuration', 'current']));

        case APPLY_CONFIGURATION:
            return state
                .setIn(['configuration', 'current'], state.getIn(['configuration', 'new']))
                .removeIn(['configuration', 'new']);

        case REJECT_CONFIGURATION:
            return state.removeIn(['configuration','new']);

        default:
            return state;
    }
}
