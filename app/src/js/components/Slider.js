let $ = require('jquery'),
    React = require('react');

class Slider extends React.Component {
    constructor(props) {
        super.constructor(props);
        this.state = {
            value: props.value,
            dragging: false
        };
    }

    componentDidMount() {
        document.addEventListener("mousemove", this._drag.bind(this));
        document.addEventListener("mouseup", this._dragEnd.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("mousemove", this._drag.bind(this));
        document.addEventListener("mouseup", this._dragEnd.bind(this));
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
            <div className="slider" onMouseDown={this._dragBegin.bind(this)}>
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
        // copy event, because for some reason it gets nulled out later
        let event = { pageX: e.pageX };
        this.setState({ dragging: true }, () => this._drag(event));
    }

    _dragEnd() {
        this.setState({dragging: false});
    }

    _drag(e) {
        if (!this.state.dragging) {
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
    onValueChanged: React.PropTypes.func
};

module.exports = Slider;