let React = require('react'),
    Button = require('./Button'),
    Icon = require('./Icon');

// Represents a button that can be toggled on, off, disabled with icons for each of the possible states
class ToggleButton extends React.Component {
    constructor(props, ...icons) {
        super.constructor(props);
        this.state = { toggled: !!this.props.toggled };
        this._toggledIcon = icons[0];
        this._notToggledIcon = icons[1];
        this._toggledDisabledIcon = icons[2];
        this._notToggledDisabledIcon = icons[3];

    }

    render() {
        let icon = !!this.props.disabled ?
            !!this.state.toggled ? this._toggledDisabledIcon : this._notToggledDisabledIcon :
            !!this.state.toggled ? this._toggledIcon : this._notToggledIcon ;

        return (
            <Button className="toggle-button" onClick={this._toggle.bind(this)} disabled={this.props.disabled} noOverlay>
                <Icon icon={icon} />
            </Button>
        );
    }

    _toggle() {
        if (!!this.props.disabled) {
            return;
        }

        let newValue = !this.state.toggled;

        if (this.props.onValueChanged) {
            this.props.onValueChanged(newValue)
        }

        this.setState({toggled: newValue});
    }
}

ToggleButton.propTypes = {
    "toggledIcon": React.PropTypes.string.isRequired,
    "notToggledIcon": React.PropTypes.string.isRequired,
    "toggledDisabledIcon": React.PropTypes.string.isRequired,
    "notToggledDisabledIcon": React.PropTypes.string.isRequired,
    "toggled": React.PropTypes.boolean,
    "disabled": React.PropTypes.boolean,
    "onValueChanged": React.PropTypes.func
};

module.exports = ToggleButton;