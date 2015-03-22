let React = require('react'),
    Ripple = require('../mixins/Ripple'),
    cx = require('../utils/ReactUtils').cx;

class Button extends React.Component {
    componentDidMount() {
        this._ripple = new Ripple(this.refs.rippleTarget);
    }

    componentWillUnmount() {
        this._ripple.destroy();
    }

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
                    ref="rippleTarget"
                    className={innerClassName}
                    onClick={this.props.onClick}>
                    <div className={overlayClassName} />
                    {this.props.children}
                </div>
            </div>
        );
    }
}

Button.propTypes = {
    className: React.PropTypes.string,
    raised: React.PropTypes.bool,
    onClick: React.PropTypes.func
};

module.exports = Button;