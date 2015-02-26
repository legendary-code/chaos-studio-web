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
    getInitialState() {
        let TMap = Components.maps[0];
        let criteria = Components.criteria.map((TCriterion) => {
            return new TCriterion();
        });

        return {
            map: new TMap(),
            criteria: criteria
        };
    },

    render: function() {
        let actions = [
            <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancelClick} />,
            <FlatButton label="Search" primary={true} onTouchTap={this._onSearchClick} />
        ];

        let criteriaPanels = [];

        for (let criterion of this.state.criteria) {
            criteriaPanels.push(<ComponentPanel key={criterion.type} component={criterion} style='listItem' />);
        }

        return (
            <Dialog ref="dialog" title="Find Attractor" actions={actions} className="search-dialog">
                <Tabs tabWidth={80}>
                    <Tab label="Map">
                        <ComponentPanel key="map" style="dropDown" types={Components.maps} component={this.state.map} />
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
    _onCancelClick() {
        this.refs.dialog.dismiss();
    },
    _onSearchClick() {
        if(this.props.onSearchClick) {
            this.props.onSearchClick(this.state);
        }
    }
});

module.exports = SearchDialog;