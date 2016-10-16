let React = require('react'),
    Icon = require('../../Icon'),
    Slider = require('../../Slider');

class NumberValueEditor extends React.Component {
    render() {
        let value = this.props.target[this.props.property];
        let minValue = this.props.target[this.props.propertyMin];
        let maxValue = this.props.target[this.props.propertyMax];
        let valueText = 'value: ';

        if (this.props.range) {
            valueText += minValue + ' ... ' + maxValue;
        } else {
            valueText += value;
        }

        return (
            <div className="number-value-editor">
                <label className="font-setting-value-label">{this.props.label}</label>
                <div className="icon-slider">
                    <Icon icon={this.props.icon || 'icon-settings'} />
                    <Slider
                        {...this.props}
                        value={value}
                        minValue={minValue}
                        maxValue={maxValue}
                        onValueChanged={this._valueChanged.bind(this)}
                        onValuesChanged={this._valuesChanged.bind(this)}
                        disabled={this.props.disabled}
                    />
                </div>
                <div className="binding-value font-caption-medium">{valueText}</div>
            </div>
        );
    }

    _valueChanged(val) {
        this.props.target[this.props.property] = val;
        this.forceUpdate();
    }

    _valuesChanged(vals) {
        this.props.target[this.props.propertyMin] = vals[0];
        this.props.target[this.props.propertyMax] = vals[1];
        this.forceUpdate();
    }
}

Slider.propTypes = {
    target: React.PropTypes.object.isRequired,
    params: React.PropTypes.object.isRequired
};


module.exports = NumberValueEditor;