let React = require('react'),
    FloatingActionButton = require('../FloatingActionButton');

class AddComponentPanel extends React.Component {
    render() {
        return (
            <div className="add-component-panel">
                <div className="icon-panel">
                    <FloatingActionButton
                        mini
                        onClick={this._click.bind(this)}
                        flat={true}
                        icon="icon-add"
                        />
                </div>
                <div className="main-panel">
                    <label className="font-subhead">Add...</label>
                    <label className="font-caption-medium">Add another setting</label>
                </div>
            </div>
        );
    }

    _click() {
        if (this.props.onClick) {
            this.props.onClick(this.props.binding, this.props.componentType);
        }
    }

    static get propTypes() {
        return {
            onClick: React.PropTypes.func,
            binding: React.PropTypes.object.isRequired,
            componentType: React.PropTypes.object.isRequired
        };
    }
}

module.exports = AddComponentPanel;