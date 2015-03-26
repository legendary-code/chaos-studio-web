let React = require('react'),
    Actions = require('../../actions/Actions'),
    Button = require('../Button'),
    ChoicePicker = require('./ChoicePicker');

class Choice extends React.Component {
    render() {
        let name = this.props.value.type.displayName || "(none)";

        return (
            <Button className="settings-choice" onClick={this._showPicker.bind(this)}>
                <label className="font-subhead">{this.props.label}</label>
                <label className="font-caption-medium">{name}</label>
            </Button>
        );
    }

    _showPicker() {
        Actions.SHOW_MODAL.invoke(
            <ChoicePicker
                selected={this.props.value.type}
                types={this.props.types}
                onValueChanged={this._typeChanged.bind(this)}
            />
        )
    }

    _typeChanged(TComponent) {
        if (this.props.onValueChanged) {
            this.props.onValueChanged(TComponent)
        }
    }
}

Choice.propTyes = {
    label: React.PropTypes.string.isRequired,
    value: React.PropTypes.object.isRequired
};

module.exports = Choice;