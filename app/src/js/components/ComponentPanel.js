/*
    Represents a single component to be configured with parameter value.
    This control comes in two flavors: dropDown or listItem.  For dropDown,
    a list of possible types must also be provided. The component may be
    replaced, if a different type is selected from the dropDown.  For listItem,
    the panel may be deleted via the onDeleteClick event.
*/

var React = require('react'),
    NumberParam = require('./NumberParam'),
    mui = require('material-ui'),
    Paper = mui.Paper,
    DropDownMenu = mui.DropDownMenu,
    IconButton = mui.IconButton;

var ComponentPanel = React.createClass({
    render() {
        let params = this.props.component.type.params;
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
                        paramControls.push(<NumberParam name={name} type={param} component={this.props.component} />);
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
        let selectedIndex = 0;
        let i = 0;
        let componentType = this.props.component ? this.props.component.type : null;

        let menuItems = this.props.types.map(function (TComponent) {
            if (componentType === TComponent) {
                selectedIndex = i;
            }

            i++;

            return {payload: TComponent, text: TComponent.displayName};
        });

        return (
            <div className="component-panel">
                <Paper>
                    <div className="component-panel-container">
                        <div className="component-panel-container">
                            <div className="component-panel-header">
                                <DropDownMenu menuItems={menuItems} onChange={this._onDropDownChanged} />
                            </div>

                            <div className="component-panel-params">
                                {paramsSection}
                            </div>
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
                            <label className="component-panel-header-label">{this.props.component.type.displayName}</label>
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
        if (this.props.onComponentDelete) {
            this.props.onComponentDelete(this.props.component);
        }
    },

    _onDropDownChanged(e, index, TComponent) {
        if (this.props.onComponentChanged) {
            this.props.onComponentChanged(TComponent);
        }
    }
});

module.exports = ComponentPanel;
