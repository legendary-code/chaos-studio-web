let React = require('react'),
    Header = require('./Header'),
    Choice = require('./Choice'),
    Slider = require('../Slider'),
    Checkbox = require('../Checkbox'),
    Toggle = require('../Toggle'),
    ComponentToggle = require('./ComponentToggle'),
    LyapunovExponent = require('../../chaos/criteria/LyapunovExponent'),
    ValueEditorsFactory = require('./values/ValueEditorsFactory');

/* Settings dialog view for configuring a single component
 * Consists of two sections:
 * - Basics
 *   - Contains a single selector for the component type
 * - Advanced
 *   - Contains configurable properties for component
 */
class SingleComponentSettings extends React.Component {
    render() {
        let editors = ValueEditorsFactory.create(this.props.binding.val);

        let advancedSettings = [];

        if (editors.length > 0) {
            advancedSettings.push(<Header label="Advanced" />);
            advancedSettings = advancedSettings.concat(editors);
        }

        return (
            <div>
                <Header label="Basics" />
                <Choice
                    label={this.props.label}
                    value={this.props.binding.val}
                    types={this.props.types}
                    onValueChanged={this._valueChanged.bind(this)}
                />
                {advancedSettings}
            </div>
        );
    }

    _valueChanged(TComponent) {
        this.props.binding.val = new TComponent();
        this.forceUpdate();
    }
}

module.exports = SingleComponentSettings;