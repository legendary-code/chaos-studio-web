var React = require('react'),
    AppBarWithNav = require('../components/AppBarWithNav'),
    SearchConfigurationStore = require('../stores/SearchConfigurationStore'),
    Viewport = require('../components/Viewport'),
    Configuration = require('../chaos/Configuration'),
    AttractorFinder = require('../chaos/AttractorFinder'),
    mui = require('material-ui'),
    IconButton = mui.IconButton,
    SettingsDialog = require('../components/SettingsDialog');

var Explore = React.createClass({
    render: function() {
        var searchButton = (
            <IconButton
                className="icon-button"
                iconClassName="icon-visibility"
                linkButton={true}
                onTouchTap={this._searchTouchTap} />
        );

        var settingsButton = (
            <IconButton
                className="icon-button"
                iconClassName="icon-settings"
                onTouchTap={this._settingsTouchTap}
                linkButton={true} />
        );

        return (
            <div>
                <AppBarWithNav title="Explore">
                {settingsButton}
                {searchButton}
                </AppBarWithNav>
                <Viewport ref="viewport" />
                <SettingsDialog ref="settingsDialog" />
            </div>
        );
    },

    _onSearchComplete(points) {
        this.refs.viewport.setState({searching: false});
        this.refs.viewport.setRenderData(points);
    },

    _searchTouchTap() {
        this.refs.viewport.setState({searching: true});

        let config = SearchConfigurationStore.configuration;
        let finder = new AttractorFinder(config, function(msg) { console.log(msg); }.bind(this), this._onSearchComplete.bind(this));
        finder.find();
    },

    _settingsTouchTap() {
        this.refs.settingsDialog.show();
    }
});

module.exports = Explore;