let React = require('react'),
    Checkbox = require('../../Checkbox');

class BooleanValueEditor extends React.Component {
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

    _valueChanged(value) {
        this.props.binding.val = value;
    }
}

module.exports = BooleanValueEditor;