let React = require('react'),
    IconButton = require('./IconButton'),
    Actions = require('../actions/Actions');

let AppBar = React.createClass({
    propTypes: {
        label: React.PropTypes.string.isRequired
    },

    render() {
        return (
            <div className="app-bar container">
                <IconButton className="app-bar-button" icon="icon-menu" onClick={this._toggleNavBar} />
                <label className="font-title">{this.props.label}</label>
            </div>
        );
    },

    _toggleNavBar() {
        Actions.TOGGLE_NAV_DRAWER.invoke();
    }
});

module.exports = AppBar;