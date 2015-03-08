let React = require('react'),
    Ripple = require('../mixins/Ripple'),
    Icon = require('./Icon');

let NavDrawerButton = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired,
        label: React.PropTypes.string.isRequired,
        onClick: React.PropTypes.func
    },

    mixins: [ Ripple ],

    render() {
        let icon = this.props.icon;
        let label = this.props.label;
        let onClick = this.props.onClick;

        return (
            <div className="nav-drawer-button">
                <button className="nav-drawer-button-inner" type="button" onClick={onClick}>
                    <Icon icon={icon} />
                    <label className="font-nav-button">{label}</label>
                </button>
            </div>
        )
    }
});

module.exports = NavDrawerButton;