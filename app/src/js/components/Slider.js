let $ = require('jquery'),
    React = require('react'),
    cx = require('../utils/ReactUtils').cx;

class Slider extends React.Component {
    constructor(props) {
        super.constructor(props);
        this.state = {
            value: props.value,
            dragging: false
        };
    }

    componentDidMount() {
        $(React.findDOMNode(this.refs.slider)).on("vmousedown", this._dragBegin.bind(this));
        $(document).on("vmousemove", this._drag.bind(this));
        $(document).on("vmouseup", this._dragEnd.bind(this));
    }

    componentWillUnmount() {
        $(React.findDOMNode(this.refs.slider)).off("vmousedown", this._dragBegin.bind(this));
        $(document).off("vmousemove", this._drag.bind(this));
        $(document).off("vmouseup", this._dragEnd.bind(this));
    }

    _percent() {
        let percent = (this.state.value - this.props.min) / (this.props.max - this.props.min);
        return percent * 100;
    }

    render() {
        let trackStyle = {
            width: this._percent() + "%"
        };

        let thumbStyle = {
            left: this._percent() + "%"
        };

        let sliderClass = cx({
            "slider": true,
            "enabled": !this.props.disabled,
            "disabled": !!this.props.disabled
        });

        return (
            <div className={sliderClass} ref="slider" >
                <div className="slider-track" ref="sliderTrack">
                    <div className="slider-track-filled" ref="sliderTrackFilled" style={trackStyle}>
                    </div>
                    <div className="slider-thumb" style={thumbStyle}>
                        <div className="slider-outer-thumb">
                        </div>
                        <div className="slider-inner-thumb">
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    _dragBegin(e) {
        if (this.state.disabled) {
            return;
        }

        // copy event, because for some reason it gets nulled out later
        let event = { pageX: e.pageX };
        this.setState({ dragging: true }, () => this._drag(event));
    }

    _dragEnd() {
        if (this.state.disabled) {
            return;
        }

        this.setState({dragging: false});
    }

    _drag(e) {
        if (this.state.disabled || !this.state.dragging) {
            return;
        }

        let track = $(React.findDOMNode(this.refs.sliderTrack));
        let xMin = track.offset().left;
        let xMax = xMin + track.width();

        console.log("pageX: " + e.pageX + ", min: " + xMin + ", max: " + xMax);

        if (e.pageX < xMin) {
            this.setState({value: this.props.min});
            return;
        }

        if (e.pageX > xMax) {
            this.setState({value: this.props.max});
            return;
        }

        let newValue = this.props.min + (((e.pageX - xMin) / (xMax - xMin)) * (this.props.max - this.props.min));

        if (this.props.onValueChanged) {
            this.props.onValueChanged(newValue);
        }

        this.setState({
            value: newValue
        });
    }
}

Slider.propTypes = {
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired,
    disabled: React.PropTypes.boolean,
    onValueChanged: React.PropTypes.func
};

module.exports = Slider;