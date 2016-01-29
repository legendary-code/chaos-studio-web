import React from 'react';
import Checkbox from '../../Checkbox';

export default class BooleanValueEditor extends React.Component {
    render() {
        return (
            <div className="boolean-value-editor">
                <div>
                    <Checkbox toggled={this.props.binding.val} />
                    <label className="font-setting-value-label">{this.props.label}</label>
                </div>
            </div>
        );
    }

    _valueChanged(val) {
        this.props.binding.val = val;
    }
}
