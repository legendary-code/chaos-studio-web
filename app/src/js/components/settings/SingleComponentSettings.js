import React from 'react';
import Header from './Header';
import Choice from './Choice';
import Slider from '../Slider';
import Checkbox from '../Checkbox';
import Toggle from '../Toggle';
import ComponentToggle from './ComponentToggle';
import LyapunovExponent from '../../chaos/criteria/LyapunovExponent';
import ValueEditorsFactory from './values/ValueEditorsFactory';

/* Settings dialog view for configuring a single component
 * Consists of two sections:
 * - Basics
 *   - Contains a single selector for the component type
 * - Advanced
 *   - Contains configurable properties for component
 */
export default class SingleComponentSettings extends React.Component {
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
