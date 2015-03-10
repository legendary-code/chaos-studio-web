let React = require('react'),
    Ripple = require('../mixins/Ripple'),
    Icon = require('../components/Icon'),
    cx = require('react-addons').classSet,
    join = require('../utils/ReactUtils').join;

let FloatingActionButton = React.createClass({
    propTypes: {
        mini: React.PropTypes.bool,
        icon: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        onClick: React.PropTypes.func
    },

    mixins: [ Ripple ],

    render() {
        let className = cx({
            "floating-action-button": true,
            "mini": this.props.mini
        });

        className = join(className, this.props.className);

        return (
            <div className={className} onClick={this.props.onClick}>
                <Icon icon={this.props.icon} />
            </div>
        );
    }
});

module.exports = FloatingActionButton;