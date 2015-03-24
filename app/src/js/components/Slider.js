let React = require('react');

class Slider extends React.Component {
    constructor(props) {
        super.constructor(props);
        this.state = {
            value: props.value
        };
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

        return (
            <div className="slider">
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
}

Slider.propTypes = {
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    value: React.PropTypes.number.isRequired
};

module.exports = Slider;