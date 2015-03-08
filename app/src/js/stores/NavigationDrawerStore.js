let Store = require('./Store'),
    Actions = require('../actions/Actions');

class NavigationDrawerStore extends Store {
    getInitialState() {
        return { hidden: true };
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
        }
    }
}

module.exports = new NavigationDrawerStore();