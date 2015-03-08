let React = require('react'),
    cx = require('react-addons').classSet,
    Ripple = require('../mixins/Ripple'),
    Icon = require('./Icon');

let Button = React.createClass({
    propTypes: {
        icon: React.PropTypes.string,
        label: React.PropTypes.string,
        left: React.PropTypes.bool,
        right: React.PropTypes.bool,
        raised: React.PropTypes.bool,
        onClick: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            rippleTarget: ".button-inner",
            left: false,
            right: false
        }
    },

    mixins: [ Ripple ],

    render() {
        let icon = this.props.icon;
        let label = this.props.label;
        let onClick = this.props.onClick;
        let left = this.props.left | !this.props.right;
        let right = this.props.right & !this.props.left;

        let outerClass = cx({
            "button": true,
            "left": left,
            "right": right
        });

        let innerClass = cx({
            "button-inner": true,
            "raised": this.props.raised,
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
            <div className={outerClass}>
                <button className={innerClass} type="button" onClick={onClick}>
                    {children}
                </button>
            </div>
        )
    }
});

module.exports = Button;