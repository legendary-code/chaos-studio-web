/* Represents a single component to be configured with parameter values */

var React = require('react'),
    NumberParam = require('./NumberParam'),
    mui = require('material-ui'),
    Paper = mui.Paper,
    DropDownMenu = mui.DropDownMenu,
    IconButton = mui.IconButton;

var ComponentPanel = React.createClass({
    getInitialState() {
        let TComponent;
        switch (this.props.style) {
            case 'dropDown':
                TComponent = this.props.types[0];
                break;

            case 'listItem':
                TComponent = this.props.type;
                break;

            default:
                throw "unknown component panel style: " + this.props.style;
        }

        return {component: new TComponent()};
    },
    render() {
        let params = this.state.component.type.params;
        let paramsSection;

        if (params) {
            let paramControls = [];
            for (let name in params) {
                if (!params.hasOwnProperty(name)) {
                    continue;
                }

                let param = params[name];
                switch (param.type) {
                    case 'number':
                        paramControls.push(<NumberParam name={name} type={param} component={this.state.component} />);
                        break;
                    case 'range':
                    case 'boolean':
                        break;
                }
            }

            paramsSection = (
                <div className="component-panel-params">
                    {paramControls}
                </div>
            );
        }

        switch (this.props.style) {
            case 'dropDown':
                return this.renderDropDown(paramsSection);
            case 'listItem':
                return this.renderListItem(paramsSection);
        }
    },

    renderDropDown(paramsSection) {
        let menuItems = this.props.types.map(function (TComponent) {
            return {payload: new TComponent(), text: TComponent.displayName}
        });

        return (
            <div className="component-panel">
                <Paper className="component-panel-container">
                    <div className="component-panel-container">
                        <div className="component-panel-header">
                            <DropDownMenu menuItems={menuItems} />
                        </div>

                        <div className="component-panel-params">
                            {paramsSection}
                        </div>
                    </div>
                </Paper>
            </div>
        );
    },

    renderListItem(paramsSection) {
        return (
            <div className="component-panel">
                <Paper>
                    <div className="component-panel-container">
                        <div className="component-panel-header">
                            <label className="component-panel-header-label">{this.state.component.type.displayName}</label>
                            <IconButton
                                className="component-panel-delete-button"
                                iconClassName="icon-cancel"
                                onClick={this._onDeleteClick} />
                        </div>

                        <div className="component-panel-params">
                            {paramsSection}
                        </div>
                    </div>
                </Paper>
            </div>
        );
    },

    _onDeleteClick() {
        if (this.props.onDeleteClick) {
            this.props.onDeleteClick(this);
        }
    },

    getComponent() {
        return this.state.component;
    }
});

module.exports = ComponentPanel;
