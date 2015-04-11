let Store = require('./Store'),
    Actions = require('../actions/Actions'),
    Router = require('react-router');

class RouterStore extends Store {
    _run(routes, callback) {

        this._router = Router.create({
            routes: routes,
            location: Router.HashLocation
        });

        this._router.run(callback);
    }

    isActive(route) {
        return this._router.isActive(route);
    }

    getCurrentRoutes() {
        return this._router.getCurrentRoutes();
    }

    getCurrentParams() {
        return this._router.getCurrentParams();
    }

    invoke(action) {
        switch (action.type) {
            case Actions.TRANSITION_TO.id:
                this._router.transitionTo(action.data);
                break;
            case Actions.RUN_ROUTES.id:
                this._run(action.data.routes, action.data.callback);
                break;
        }
    }
}

module.exports = new RouterStore();