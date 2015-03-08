let Store = require('./Store'),
    Actions = require('../actions/Actions'),
    Router = require('react-router'),
    Navigation = Router.Navigation;

class NavigationDrawerStore extends Store {
    getInitialState() {
        return { hidden: true, location: "home" };
    }

    invoke(action) {
        switch (action.type) {
            case Actions.SHOW_NAV_DRAWER.id:
                this.setState({hidden: false});
                break;

            case Actions.HIDE_NAV_DRAWER.id:
                this.setState({hidden: true});
                break;

            case Actions.TOGGLE_NAV_DRAWER.id:
                this.setState({hidden: !this.state.hidden});
                break;

            case Actions.CHANGE_NAV_LOCATION.id:
                this.setState({location: action.data});
                break;
        }
    }
}

module.exports = new NavigationDrawerStore();