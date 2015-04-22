let React = require('react'),
    Ripple = require('./effects/Ripple'),
    cx = require('../utils/ReactUtils').cx;

class Button extends React.Component {
    componentDidMount() {
        if (!this.props.disabled) {
            this._ripple = new Ripple(this.refs.rippleTarget);
        }
    }

    componentWillUnmount() {
        if (!this.props.disabled) {
            this._ripple.destroy();
        }
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

        let overlay = this.props.noOverlay ? "" : <div className={overlayClassName} />;

        if (this.props.className) {
            outerClasses[this.props.className] = true;
        }

        return (
            <div className={cx(outerClasses)}>
                <div
                    ref="rippleTarget"
                    className={innerClassName}
                    onClick={this._onClick.bind(this)}>
                    {overlay}
                    {this.props.children}
                </div>
            </div>
        );
    }

    doRipple(clickEvent) {
        this._ripple.doRipple(clickEvent);
    }

    _onClick() {
        if (!!this.props.disabled) {
            return;
        }

        this.props.onClick();
    }
}

Button.propTypes = {
    className: React.PropTypes.string,
    raised: React.PropTypes.bool,
    noOverlay: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func
};

module.exports = Button;