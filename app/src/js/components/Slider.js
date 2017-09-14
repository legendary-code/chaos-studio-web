let $ = require('jquery'),
    React = require('react'),
    cx = require('../utils/ReactUtils').cx;

class Slider extends React.Component {
    constructor(props) {
        super.constructor(props);

        let values = [];

        if (props.range) {
            let formattedMinValue = this._formatValue(props.minValue);
            values.push(formattedMinValue);

            if (this.props.onMinValueChanged) {
                this.props.onMinValueChanged(formattedMinValue);
            }

            let formattedMaxValue = this._formatValue(props.maxValue);
            values.push(formattedMaxValue);
            if (this.props.onMaxValueChanged) {
                this.props.onMaxValueChanged(formattedMaxValue);
            }
        } else {
            let formattedValue = this._formatValue(props.value);
            values.push(formattedValue);

            if (this.props.onValueChanged) {
                this.props.onValueChanged(formattedValue);
            }
        }

        // ensure it's min --> max
        values.sort((a , b) => a - b);

        this.state = {
            values: values,
            dragging: false,
            dragIndex: null
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

    _percent(index) {
        let percent = (this.state.values[index] - this.props.min) / (this.props.max - this.props.min);
        return percent * 100;
    }

    render() {
        let trackStyle = {
            left: this.props.range ? this._percent(0) + '%' : 0,
            width: this.props.range ? (this._percent(1) - this._percent(0)) + '%' : this._percent(0) + '%'
        };

        let sliderClasses = {
            "slider": true,
            "enabled": !this.props.disabled,
            "disabled": !!this.props.disabled
        };

        if (this.props.className) {
            sliderClasses[this.props.className] = true;
        }

        let sliderClass = cx(sliderClasses);

        let thumbs = [ <div key="slider-track" className="slider-track-filled" ref="sliderTrackFilled" style={trackStyle}></div> ];

        for (let i in this.state.values) {
            let thumbStyle = {
                left: this._percent(i) + "%"
            };

            thumbs.push(
                <div className="slider-thumb" key={"slider-thumb-"+i} style={thumbStyle}>
                    <div className="slider-outer-thumb">
                    </div>
                    <div className="slider-inner-thumb">
                    </div>
                </div>
            );
        }

        return (
            <div className={sliderClass} ref="slider" >
                <div className="slider-track" ref="sliderTrack">
                    {thumbs}
                </div>
            </div>
        );
    }

    _dragBegin(e) {
        if (this.state.disabled) {
            return;
        }

        // find nearest thumb
        let minDistance = Infinity;
        let index = NaN;
        let newValue = this._computeValueFromScreenSpace(e);

        for (let i in this.state.values) {
            let distance = Math.abs(this.state.values[i] - newValue);
            if (distance < minDistance) {
                minDistance = distance;
                index = i;
            }
        }

        // copy event, because for some reason it gets nulled out later
        let event = { pageX: e.pageX };
        this.setState({ dragging: true, dragIndex: index }, () => this._drag(event));
    }

    _dragEnd() {
        if (this.state.disabled) {
            return;
        }

        this.setState({dragging: false});
    }

    _formatValue(val) {
        if(this.props.decimalPlaces) {
            val = Number(val.toFixed(this.props.decimalPlaces));
        }

        if (!this.props.step && !this.props.integral) {
            return val;
        }

        if (this.props.step) {
            val = val / this.props.step;
        }

        val = Math.round(val);

        if (this.props.step) {
            val = val * this.props.step;
        }

        return val;
    }

    _computeValueFromScreenSpace(e) {
        let track = $(React.findDOMNode(this.refs.sliderTrack));
        let xMin = track.offset().left;
        let xMax = xMin + track.width();

        return this.props.min + (((e.pageX - xMin) / (xMax - xMin)) * (this.props.max - this.props.min));
    }

    _drag(e) {
        if (this.state.disabled || !this.state.dragging) {
            return;
        }

        let newValue = this._computeValueFromScreenSpace(e);

        if (newValue < this.props.min) {
            newValue = this.props.min;
        }

        if (newValue > this.props.max) {
            newValue = this.props.max;
        }

        newValue = this._formatValue(newValue);

        let newValues = this.state.values;
        newValues[this.state.dragIndex] = newValue;

        // flip dragIndex if we cross the other thumb
        let dragIndex = this.state.dragIndex;
        if (this.props.range && newValues[0] > newValues[1]) {
            dragIndex = 1 - dragIndex;
        }

        // ensure it's min --> max
        newValues.sort((a , b) => a - b);

        if (this.props.onValuesChanged) {
            this.props.onValuesChanged(newValues);
        }

        if (this.props.onValueChanged) {
            this.props.onValueChanged(newValue);
        }

        this.setState({
            values: newValues,
            dragIndex: dragIndex
        });
    }
}

Slider.propTypes = {
    className: React.PropTypes.string,
    min: React.PropTypes.number.isRequired,
    max: React.PropTypes.number.isRequired,
    integral: React.PropTypes.bool,
    step: React.PropTypes.number,
    decimalPlaces: React.PropTypes.number,
    value: React.PropTypes.number,
    minValue: React.PropTypes.number,
    maxValue: React.PropTypes.number,
    disabled: React.PropTypes.boolean,
    onValueChanged: React.PropTypes.func,
    onValuesChanged: React.PropTypes.func
};

module.exports = Slider;