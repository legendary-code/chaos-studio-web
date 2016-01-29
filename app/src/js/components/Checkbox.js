import React from 'react';
import ToggleButton from './ToggleButton';

export default class Checkbox extends ToggleButton {
    constructor(props) {
        super(
            props,
            "icon-checked",
            "icon-unchecked",
            "icon-checked-disabled",
            "icon-unchecked-disabled"
        );
    }
}
