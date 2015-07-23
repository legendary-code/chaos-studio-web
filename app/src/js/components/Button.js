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
                    onClick={this._onClick.bind(this)}
                    onMouseEnter={this._onEnter.bind(this)}
                    onMouseLeave={this._onLeave.bind(this)}>
                    {overlay}
                    {this.props.children}
                </div>
            </div>
        );
    }

    doRipple(clickEvent) {
        this._ripple.doRipple(clickEvent);
    }

    _onClick(e) {
        if (!!this.props.disabled) {
            return;
        }

        this.props.onClick(e);
    }

    _onEnter() {
        if (this.props.onContextShow) {
            this.props.onContextShow(this.props.contextText);
        }
    }

    _onLeave() {
        if (this.props.onContextHide) {
            this.props.onContextHide();
        }
    }
}

Button.propTypes = {
    className: React.PropTypes.string,
    raised: React.PropTypes.bool,
    noOverlay: React.PropTypes.bool,
    disabled: React.PropTypes.bool,
    onClick: React.PropTypes.func,
    contextText: React.PropTypes.string,
    onContextShow: React.PropTypes.func,
    onContextHide: React.PropTypes.func
};

module.exports = Button;