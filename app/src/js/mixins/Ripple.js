/* Implements a mixin for applying Ripple animation upon clicking a component */

let React = require('react'),
    $ = require('jquery');

let Ripple = {
    propTypes: {
        rippleTarget: React.PropTypes.string
    },

    componentDidMount() {
        $(this.getDOMNode()).on("mousedown", this._doRipple);
        $(this.getDOMNode()).on("touchstart", this._doRipple);
    },

    componentWillUnmount() {
        $(this.getDOMNode()).off("mousedown", this._doRipple);
        $(this.getDOMNode()).off("touchstart", this._doRipple);
    },

    _getRippleTarget() {
        let target = $(this.getDOMNode());
        return  this.props.rippleTarget ? target.find(this.props.rippleTarget) : target;
    },

    _doRipple(e) {
        let parent = this._getRippleTarget();
        let ripple = $("<span class='ripple'></span>");
        let diam = Math.max(parent.outerWidth(), parent.outerHeight());
        let offset = parent.offset();
        let x = e.pageX - offset.left;
        let y = e.pageY - offset.top;

        parent.append(ripple);
        ripple.css({
            top: y+"px",
            left: x+"px"
        });

        /* Use jQuery animation to get around hidden overflow issues with rounded borders and animations*/

        ripple.animate({
                top: y - (diam * 1.25),
                left: x - (diam * 1.25),
                height: diam * 2.5,
                width: diam * 2.5,
                opacity: 0
            }, 500, function() {
                ripple.remove();
            }
        );
    }
};

module.exports = Ripple;
