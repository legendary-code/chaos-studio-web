let React = require('react'),
    ToggleButton = require('./ToggleButton');

class Checkbox extends ToggleButton {
    constructor(props) {
        super.constructor(
            props,
            "icon-checked",
            "icon-unchecked",
            "icon-checked-disabled",
            "icon-unchecked-disabled"
        );
    }
}

module.exports = Checkbox;