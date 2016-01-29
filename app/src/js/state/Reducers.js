import { TOGGLE_NAV, HIDE_NAV, SET_TITLE } from './actions';
import Immutable from 'immutable';

/* TODO: Load from cookies or local storage */
const initialState = Immutable.fromJS({
    nav: {
        hidden: true
    },
    title: 'Chaos Studio'
});

export function chaosStudioApp(state = initialState, action = null) {
    switch(action.type) {
        case TOGGLE_NAV:
            return state.updateIn(['nav', 'hidden'], true, value => !value);

        case HIDE_NAV:
            return state.updateIn(['nav', 'hidden'], true, value => true);

        case SET_TITLE:
            return state.set('title', action.title);
        default:
            return state;
    }
}
