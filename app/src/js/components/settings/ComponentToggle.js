import React from 'react';
import Button from '../Button';
import Icon from '../Icon';
import Toggle from '../Toggle';

// Represents a component and its settings that can be toggled on or off
export default class ComponentToggle extends React.Component {
    constructor(props) {
        super.constructor(props);
        this.state = { expanded: false };
    }

    render() {
        let icon = this.state.expanded ? "icon-expand-less" : "icon-expand-more";

        return (
            <div className="component-toggle">
                <div className="header">
                    <Button onClick={this._toggleExpand.bind(this)}>
                        <Icon icon={icon} />
                        <label className="font-subhead">{this.props.label}</label>
                    </Button>
                    <Toggle />
                </div>
            </div>
        );
    }

    _toggleExpand() {
        this.setState({expanded: !this.state.expanded});
    }
}

ComponentToggle.propTypes = {
  "label": React.PropTypes.string.isRequired
};
