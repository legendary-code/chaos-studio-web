
var React = require('react'),
    mui = require('material-ui'),
    Dialog = mui.Dialog,
    FlatButton = mui.FlatButton,
    DropDownMenu = mui.DropDownMenu,
    Tabs = mui.Tabs,
    Tab = mui.Tab,
    ComponentPanel = require('./ComponentPanel'),
    ComponentList = require('./ComponentList'),
    Components = require('../chaos/Components'),
    Configuration = require('../chaos/Configuration'),
    ChaosDispatcher = require('../dispatcher/ChaosDispatcher'),
    SearchConfigurationStore = require('../stores/SearchConfigurationStore'),
    Actions = require('../actions/Actions');

var SearchDialog = React.createClass({
    getInitialState() {
        let configuration = SearchConfigurationStore.configuration;

        return {
            map: configuration.map.clone(),
            criteria: configuration.criteria.map((criterion) => { return criterion.clone(); }),
            rng: configuration.rng.clone()
        };
    },

    render: function() {
        let actions = [
            <FlatButton label="Cancel" secondary={true} onTouchTap={this._onCancelClick} />,
            <FlatButton label="Search" primary={true} onTouchTap={this._onSearchClick} />
        ];

        return (
            <Dialog ref="dialog" title="Find Attractor" actions={actions} className="search-dialog">
                <Tabs tabWidth={80}>
                    <Tab label="Map">
                        <ComponentPanel
                            key="map"
                            style="dropDown"
                            types={Components.maps}
                            component={this.state.map}
                            onComponentChanged={this._onMapChanged}/>
                    </Tab>
                    <Tab label="Criteria">
                        <ComponentList
                            key="criteria"
                            components={this.state.criteria}
                            types={Components.criteria}
                            onComponentDelete={this._onCriterionDelete}
                            onComponentAdd={this._onCriterionAdd} />
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
        this.refs.dialog.dismiss();

        let configuration = new Configuration(this.state.map, this.state.criteria, this.state.rng);
        ChaosDispatcher.dispatch(Actions.CHANGE_SEARCH_CONFIGURATION, configuration);

        if(this.props.onSearchClick) {
            this.props.onSearchClick(this.state);
        }
    },
    _onCriterionDelete(criterion) {
        let criteria = this.state.criteria;
        criteria.splice(criteria.indexOf(criterion), 1);

        this.setState({
            criteria: criteria
        });
    },
    _onCriterionAdd(TCriterion) {
        let criteria = this.state.criteria;
        criteria.push(new TCriterion());

        this.setState({
            criteria: criteria
        });
    },
    _onMapChanged(TMap) {
        this.setState({
            map: new TMap()
        });
    }
});

module.exports = SearchDialog;