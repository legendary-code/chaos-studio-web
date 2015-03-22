let _ = require('underscore'),
    ChaosDispatcher = require('../dispatcher/ChaosDispatcher');

let Actions = {
    CHANGE_SEARCH_CONFIGURATION: 1,
    SHOW_NAV_DRAWER: 2,
    HIDE_NAV_DRAWER: 3,
    TOGGLE_NAV_DRAWER: 4,
    CHANGE_NAV_LOCATION: 5,
    RUN_ROUTES: 6,
    TRANSITION_TO: 7,
    SHOW_MODAL: 8,
    CLOSE_TOPMOST_MODAL: 9
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