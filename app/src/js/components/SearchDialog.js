/** @jsx React.DOM */
var React = require('react'),
    mui = require('material-ui'),
    Dialog = mui.Dialog,
    FlatButton = mui.FlatButton,
    DropDownMenu = mui.DropDownMenu,
    Components = require('../Components');

var SearchDialog = React.createClass({
    render: function() {

        var mapMenuItems = Components.maps.map(function(map) {
            return { payload: map, text: map.displayName }
        });

        var actions = [
            <FlatButton label="Cancel" secondary={true} />,
            <FlatButton label="Search" primary={true} />
        ];

        return (
            <Dialog ref="dialog" title="Find Attractor" actions={actions}>
                <div>
                    <h2>Map</h2>
                    <DropDownMenu menuItems={mapMenuItems} />
                </div>
            </Dialog>
        );
    },
    show: function() {
        this.refs.dialog.show();
    }
});

module.exports = SearchDialog;