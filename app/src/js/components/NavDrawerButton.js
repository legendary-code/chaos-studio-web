let React = require('react'),
    cx = require('../utils/ReactUtils').cx,
    Icon = require('./Icon'),
    Actions = require('../actions/Actions'),
    Button = require('./Button'),
    RouterStore = require('../stores/RouterStore'),
    NavigationDrawerStore = require('../stores/NavigationDrawerStore');

class NavDrawerButton extends React.Component {
    componentDidMount() {
        NavigationDrawerStore.addListener(this._navChanged.bind(this));
    }

    componentWillUnmount() {
        NavigationDrawerStore.removeListener(this._navChanged.bind(this));
    }

    render() {
        let icon = this.props.icon;
        let label = this.props.label;

        let labelFont = cx({
            "font-nav-button": true,
            "font-active-route": RouterStore.isActive(this.props.route)
        });

        return (
            <Button className="nav-drawer-button" onClick={this._onNavClick.bind(this)}>
                <Icon icon={icon} />
                <label className={labelFont}>{label}</label>
            </Button>
        )
    }

    _onNavClick() {
        Actions.TRANSITION_TO.invoke(this.props.route);
        Actions.CHANGE_NAV_LOCATION.invoke(this.props.route);
        Actions.HIDE_NAV_DRAWER.invoke();
    }

    _navChanged() {
        this.forceUpdate();
    }
}

NavDrawerButton.propTypes = {
    icon: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    route: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
};

module.exports = NavDrawerButton;