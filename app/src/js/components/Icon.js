let _ = require('underscore'),
    React = require('react');

let Icon = React.createClass({
    propTypes: {
        icon: React.PropTypes.string.isRequired
    },

    render() {
        let className = "icon " + this.props.icon;
        let other = _.omit(this.props.icon, "icon");

        return (
            <span className={className} role="img" {...other}></span>
        );
    }
});

module.exports = Icon;