let React = require('react'),
    Icon = require('../../Icon'),
    Slider = require('../../Slider');

class NumberValueEditor extends React.Component {
    render() {
        return (
            <div className="number-value-editor">
                <label className="font-setting-value-label">{this.props.label}</label>
                <div className="icon-slider">
                    <Icon icon={this.props.icon} />
                    <Slider
                        min={this.props.min}
                        max={this.props.max}
                        value={this.props.binding.value}
                        onValueChanged={this._valueChanged.bind(this)}
                        disabled={this.props.disabled}
                    />
                </div>
            </div>
        );
    }

    _valueChanged(value) {
        this.props.binding.value = value;
    }
}

module.exports = NumberValueEditor;