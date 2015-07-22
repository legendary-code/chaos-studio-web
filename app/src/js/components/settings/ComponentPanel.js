let React = require('react'),
    Button = require('../Button'),
    FloatingActionButton = require('../FloatingActionButton'),
    Icon = require('../Icon');

class ComponentPanel extends React.Component {
    render() {
        let type = this.props.binding.val.type;
        let arrowClassName = "arrow-panel" + (this.props.showArrow ? "" : " hide");

        return (
            <div className="component-panel">
                <Button onClick={this._panelClick.bind(this)}>
                    <div className="icon-panel">
                        <FloatingActionButton
                            mini
                            onClick={this._iconClick.bind(this)}
                            flat={true}
                            icon={this.props.icon || "icon-settings"}
                            />
                    </div>
                    <div className="main-panel">
                        <label className="font-subhead">{type.displayName}</label>
                        <label className="font-caption-medium">{type.description || ""}</label>
                    </div>
                    <div className={arrowClassName}>
                        <Icon icon="icon-right-arrow" />
                    </div>
                </Button>
            </div>
        );
    }

    _panelClick() {
        if (this.props.onPanelClick) {
            this.props.onPanelClick();
        }
    }

    _iconClick() {
        if (this.props.onIconClick) {
            this.props.onIconClick();
        }
    }

    static get propTypes() {
        return {
            onIconClick: React.PropTypes.func,
            onPanelClick: React.PropTypes.func,
            icon: React.PropTypes.string,
            showArrow: React.PropTypes.bool,
            binding: React.PropTypes.object.isRequired
        };
    }
}

module.exports = ComponentPanel;