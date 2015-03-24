let React = require('react'),
    Header = require('./Header'),
    Choice = require('./Choice'),
    Slider = require('../Slider');

/* Settings dialog view for configuring a single component
 * Consists of two sections:
 * - Basics
 *   - Contains a single selector for the component type
 * - Advanced
 *   - Contains configurable properties for component
 */
class SingleComponentSettings extends React.Component {
    render() {
        return (
            <div>
                <Header label="Basics" />
                <Choice label={this.props.label} value={this.props.value} types={this.props.types} />
                <Header label="Advanced" />
                <Slider min={0.0} max={10.0} value={2.0}/>
            </div>
        );
    }
}

module.exports = SingleComponentSettings;