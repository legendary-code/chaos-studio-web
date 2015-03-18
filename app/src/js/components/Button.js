let React = require('react'),
    Ripple = require('../mixins/Ripple'),
    cx = require('react-addons').classSet;

let Button = React.createClass({
    propTypes: {
        className: React.PropTypes.string,
        raised: React.PropTypes.bool,
        onClick: React.PropTypes.func
    },

    getDefaultProps() {
        return {
            rippleTarget: ".hit-area"
        }
    },

    mixins: [ Ripple ],

    render() {
        let outerClasses = {
            "button-spacing": true,
            "raised": this.props.raised,
            "flat": !this.props.raised
        };

        let innerClassName = cx({
            "button": true,
            "raised": this.props.raised,
            "flat": !this.props.raised
        });

        let overlayClassName = cx({
            "overlay": true,
            "raised": this.props.raised,
            "flat": !this.props.raised
        });

        if (this.props.className) {
            outerClasses[this.props.className] = true;
        }

        return (
            <div className={cx(outerClasses)}>
                <div
                    className={innerClassName}
                    onClick={this.props.onClick}>
                    <div className={overlayClassName} />
                    {this.props.children}
                </div>
            </div>
        );
    }
});

module.exports = Button;