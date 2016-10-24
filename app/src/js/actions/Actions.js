let _ = require('underscore'),
    ChaosDispatcher = require('../dispatcher/ChaosDispatcher');

let Actions = {
    /* Search Configuration */
    UPDATE_SEARCH_CONFIGURATION: 1,
    SAVE_SEARCH_CONFIGURATION: 2,
    RESET_SEARCH_CONFIGURATION: 3,

    /* Navigation */
    SHOW_NAV_DRAWER: 4,
    HIDE_NAV_DRAWER: 5,
    TOGGLE_NAV_DRAWER: 6,
    CHANGE_NAV_LOCATION: 7,
    RUN_ROUTES: 8,
    TRANSITION_TO: 9,

    /* Modal */
    SHOW_MODAL: 10,
    CLOSE_TOPMOST_MODAL: 11
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

module.exports = Actions;