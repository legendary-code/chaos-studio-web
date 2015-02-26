/** @jsx React.DOM */
var React = require('react'),
    mui = require('material-ui'),
    Dialog = mui.Dialog,
    FlatButton = mui.FlatButton,
    DropDownMenu = mui.DropDownMenu,
    Tabs = mui.Tabs,
    Tab = mui.Tab,
    ComponentPanel = require('./ComponentPanel'),
    Components = require('../chaos/Components');

var SearchDialog = React.createClass({
    render: function() {
        let mapMenuItems = Components.maps.map(function(TMap) {
            return { payload: new TMap(), text: TMap.displayName }
        });

        let actions = [
            <FlatButton label="Cancel" secondary={true} />,
            <FlatButton label="Search" primary={true} onClick={this._onSearchClick} />
        ];

        let criteriaPanels = [];

        for (let TComponent of Components.criteria) {
            criteriaPanels.push(<ComponentPanel type={TComponent} style='listItem' />);
        }

        return (
            <Dialog ref="dialog" title="Find Attractor" actions={actions} className="search-dialog">
                <Tabs tabWidth={80}>
                    <Tab label="Map">
                        <DropDownMenu ref="mapDropDownMenu" menuItems={mapMenuItems} />
                    </Tab>
                    <Tab label="Criteria">
                        {criteriaPanels}
                    </Tab>
                </Tabs>
            </Dialog>
        );
    },
    show() {
        this.refs.dialog.show();
    },
    _onSearchClick() {
        if(this.props.onSearchClick) {
            let config = null;
            this.props.onSearchClick(config);
        }
    }
});

module.exports = SearchDialog;