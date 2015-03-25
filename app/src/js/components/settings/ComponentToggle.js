let React = require('react'),
    Button = require('../Button'),
    Icon = require('../Icon'),
    Toggle = require('../Toggle');

// Represents a component and its settings that can be toggled on or off
class ComponentToggle extends React.Component {
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

module.exports = ComponentToggle;