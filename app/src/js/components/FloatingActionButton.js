let React = require('react'),
    Ripple = require('../mixins/Ripple'),
    Icon = require('../components/Icon'),
    cx = require('react-addons').classSet;

let FloatingActionButton = React.createClass({
    propTypes: {
        mini: React.PropTypes.bool,
        icon: React.PropTypes.string.isRequired
    },

    mixins: [ Ripple ],

    render() {
        let className = cx({
            "floating-action-button": true,
            "mini": this.props.mini
        });

        return (
            <div className={className}>
                <Icon icon={this.props.icon} />
            </div>
        );
    }
});

module.exports = FloatingActionButton;