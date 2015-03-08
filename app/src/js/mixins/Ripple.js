/* Implements a mixin for applying Ripple animation upon clicking a component */

let React = require('react'),
    $ = require('jquery');

let Ripple = {
    propTypes: {
        rippleTarget: React.PropTypes.string
    },

    componentDidMount() {
        this._ripple = $(this.getDOMNode())
        this.getDOMNode().addEventListener("click", this._onClick);
    },

    componentWillUnmount() {
        delete this._ripple;
        this.getDOMNode().removeEventListener("click", this._onClick);
    },

    _getRippleTarget() {
        let target = $(this.getDOMNode());
        return  this.props.rippleTarget ? target.find(this.props.rippleTarget) : target;
    },

    _onClick(e) {
        let parent = this._getRippleTarget();
        let ripple = $("<span class='ripple'></span>");
        parent.append(ripple);

        let diam = Math.max(parent.outerWidth(), parent.outerHeight());
        ripple.css({height: diam, width: diam});

        let x = e.pageX - parent.offset().left - ripple.width() / 2;
        let y = e.pageY - parent.offset().top - ripple.height() / 2;

        ripple.css({top: y+"px", left: x+"px"});

        setTimeout(
            function() {
                ripple.remove();
            },
            500
        );
    }
};

module.exports = Ripple;
