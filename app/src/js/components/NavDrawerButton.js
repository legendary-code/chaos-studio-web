let React = require('react'),
    cx = require('react-addons').classSet,
    Ripple = require('../mixins/Ripple'),
    Icon = require('./Icon'),
    Router = require('react-router'),
    Actions = require('../actions/Actions'),
    NavigationDrawerStore = require('../stores/NavigationDrawerStore');

let NavDrawerButton = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        route: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func.isRequired
    },

    mixins: [ Ripple, Router.State, Router.Navigation ],

    componentDidMount() {
        NavigationDrawerStore.addListener(this._navChanged);
    },

    componentWillUnmount() {
        NavigationDrawerStore.removeListener(this._navChanged);
    },

    render() {
        let icon = this.props.icon;
        let label = this.props.label;

        let labelFont = cx({
            "font-nav-button": true,
            "font-active-route": this.isActive(this.props.route)
        });

        return (
            <div className="nav-drawer-button" onClick={this._onNavClick}>
                <div className="nav-drawer-button-inner" type="button">
                    <Icon icon={icon} />
                    <label className={labelFont}>{label}</label>
                </div>
            </div>
        )
    },

    _onNavClick() {
        this.transitionTo(this.props.route);
        Actions.CHANGE_NAV_LOCATION.invoke(this.props.route);
        Actions.HIDE_NAV_DRAWER.invoke();
    },

    _navChanged() {
        this.forceUpdate();
    }
});

module.exports = NavDrawerButton;