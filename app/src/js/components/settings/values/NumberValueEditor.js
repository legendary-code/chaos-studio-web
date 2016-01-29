import React from 'react';
import Icon from '../../Icon';
import Slider from '../../Slider';

export default class NumberValueEditor extends React.Component {
    render() {
        return (
            <div className="number-value-editor">
                <label className="font-setting-value-label">{this.props.label}</label>
                <div className="icon-slider">
                    <Icon icon={this.props.icon} />
                    <Slider
                        min={this.props.min}
                        max={this.props.max}
                        value={this.props.binding.val}
                        onValueChanged={this._valueChanged.bind(this)}
                        disabled={this.props.disabled}
                    />
                </div>
            </div>
        );
    }

    _valueChanged(val) {
        this.props.binding.val = val;
    }
}
