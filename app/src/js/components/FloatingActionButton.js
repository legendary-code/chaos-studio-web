let React = require('react'),
    Icon = require('../components/Icon'),
    Button = require('../components/Button'),
    cx = require('react-addons').classSet,
    join = require('../utils/ReactUtils').join;

let FloatingActionButton = React.createClass({
    propTypes: {
        mini: React.PropTypes.bool,
        icon: React.PropTypes.string.isRequired,
        className: React.PropTypes.string,
        onClick: React.PropTypes.func
    },

    render() {
        let className = cx({
            "floating-action-button": true,
            "mini": this.props.mini
        });

        className = join(className, this.props.className);

        return (
            <Button className={className} onClick={this.props.onClick} raised>
                <Icon icon={this.props.icon} />
            </Button>
        );
    }
});

module.exports = FloatingActionButton;