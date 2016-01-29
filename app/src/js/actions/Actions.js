import _ from 'underscore';
import ChaosDispatcher from '../dispatcher/ChaosDispatcher';

let Actions = {
    /* Search Configuration */
    UPDATE_SEARCH_CONFIGURATION: 1,
    SAVE_SEARCH_CONFIGURATION: 2,

    /* Navigation */
    SHOW_NAV_DRAWER: 3,
    HIDE_NAV_DRAWER: 4,
    TOGGLE_NAV_DRAWER: 5,
    CHANGE_NAV_LOCATION: 6,
    RUN_ROUTES: 7,
    TRANSITION_TO: 8,

    /* Modal */
    SHOW_MODAL: 9,
    CLOSE_TOPMOST_MODAL: 10
};

/* Modify actions indirectly for better IDE auto completion behavior */
_.keys(Actions).forEach((action) => {
    let id = Actions[action];

    Actions[action] = {
        id: id,
        invoke: function(data) {
            ChaosDispatcher.dispatch({type: id, data: data});
        }
    }
});

export default Actions;