let React = require('react'),
    cx = require('react-addons').classSet,
    Button = require('./button'),
    Icon = require('./Icon');

let IconButton = React.createClass({
    propTypes: {
        icon: React.PropTypes.string,
        label: React.PropTypes.string.isRequired,
        left: React.PropTypes.bool,
        right: React.PropTypes.bool,
        raised: React.PropTypes.bool,
        onClick: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            left: false,
            right: false
        }
    },

    render() {
        let icon = this.props.icon;
        let label = this.props.label;
        let left = this.props.left | !this.props.right;
        let right = this.props.right & !this.props.left;

        let outerClass = cx({
            "icon-button": true,
            "left": left,
            "right": right,
            "label": this.props.label
        });

        let children = [];

        if (icon) {
            icon += " left";
            children.push(<Icon icon={icon} />);
        }

        if (label) {
            children.push(<label className="font-button">{label}</label>);
        }

        return (
            <Button className={outerClass} onClick={this.props.onClick} raised={this.props.raised}>
                {children}
            </Button>
        )
    }
});

module.exports = IconButton;