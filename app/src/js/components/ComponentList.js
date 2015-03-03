let React = require('react'),
    mui = require('material-ui'),
    IconButton = mui.IconButton,
    DropDownMenu = mui.DropDownMenu,
    Paper = mui.Paper,
    ComponentPanel = require('./ComponentPanel');

let ComponentList = React.createClass({
    render() {
        let panels = [];

        for (let component of this.props.components) {
            panels.push(
                <ComponentPanel
                    key={component.type}
                    component={component}
                    style='listItem'
                    onComponentDelete={this._onComponentDelete} />
            );
        }

        let availableTypes = this.availableTypes();
        let menuItems = availableTypes.map((TComponent) => {
           return {payload: TComponent, text: TComponent.displayName};
        });

        if (menuItems.length == 0) {
            menuItems.push({text: ''});
        }

        let disabled = availableTypes.length == 0;

        return (
            <div className="component-list">
                <Paper className="component-list-header-paper">
                    <div className="component-list-container">
                        <div className="component-list-header">
                            <DropDownMenu
                                ref="typesDropDown"
                                menuItems={menuItems}
                                className="component-list-drop-down"
                                disabled={disabled}
                                onChange={this._onDropDownChanged} />
                            <IconButton
                                className="component-list-add-button"
                                iconClassName="icon-add-circle-outline"
                                disabled={disabled}
                                onClick={this._onAddClick} />
                        </div>
                    </div>
                </Paper>
                {panels}
            </div>
        );
    },

    availableTypes() {
        let configuredTypes = this.props.components.map((component) => { return component.type; });
        let availableTypes = [];

        for (let TComponent of this.props.types) {
            if (configuredTypes.indexOf(TComponent) == -1) {
                availableTypes.push(TComponent);
            }
        }

        return availableTypes;
    },

    _onDropDownChanged(e, TComponent) {
        this.setState({selectedType: TComponent});
    },

    _onComponentDelete(TComponent) {
        if (this.props.onComponentDelete) {
            this.props.onComponentDelete(TComponent);
        }
    },

    _onAddClick() {
        if (this.props.onComponentAdd) {
            let availableTypes = this.availableTypes();
            let TComponent = availableTypes[this.refs.typesDropDown.state.selectedIndex];
            this.props.onComponentAdd(TComponent);
        }
    }
});

module.exports = ComponentList;