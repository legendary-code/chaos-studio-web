let React = require('react'),
    ToggleButton = require('./ToggleButton');

class Checkbox extends ToggleButton {
    constructor(props) {
        props.toggled = !!props.checked;
        props.toggledIcon = "icon-checked";
        props.notToggledIcon = "icon-unchecked";
        props.toggledDisabledIcon = "icon-checked-disabled";
        props.notToggledDisabledIcon = "icon-unchecked-disabled";

        super.constructor(props);
    }
}

Checkbox.propTypes = {
    "checked": React.PropTypes.boolean
};

module.exports = Checkbox;