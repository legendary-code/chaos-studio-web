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
    getInitialState() {
        switch (this.props.style) {
            case 'dropDown':
                if (!this.props.types) {
                    throw "types required for dropDown style";
                }

                return {component: this.props.component || new this.props.types[0]};

            case 'listItem':
                if (!this.props.component) {
                    throw "component required for listItem style";
                }
                return {component: this.props.component};

            default:
                throw "unknown style " + this.props.style;
        }
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
        let selectedIndex = 0;
        let i = 0;
        let componentType = this.state.component.type;

        let menuItems = this.props.types.map(function (TComponent) {
            if (componentType === TComponent) {
                selectedIndex = i;
            }

            i++;

            return {payload: new TComponent(), text: TComponent.displayName}
        });

        return (
            <div className="component-panel">
                <Paper>
                    <div className="component-panel-container">
                        <div className="component-panel-container">
                            <div className="component-panel-header">
                                <DropDownMenu menuItems={menuItems} />
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

    _onDropDownChanged(e, TComponent) {
        let newComponent = new TComponent();

        if (this.props.onComponentReplaced) {
            this.props.onComponentReplaced(newComponent);
        }

        this.setState({component: newComponent});
    }
});

module.exports = ComponentPanel;
