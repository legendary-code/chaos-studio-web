var React = require('react'),
    AppBarWithNav = require('../components/AppBarWithNav'),
    SearchConfigurationStore = require('../stores/SearchConfigurationStore'),
    Viewport = require('../components/Viewport'),
    Configuration = require('../chaos/Configuration'),
    AttractorFinder = require('../chaos/AttractorFinder'),
    mui = require('material-ui'),
    IconButton = mui.IconButton,
    SearchDialog = require('../components/SearchDialog');

var Explore = React.createClass({
    render: function() {
        var searchButton = (
            <IconButton
                className="icon-button"
                iconClassName="icon-visibility"
                linkButton={true}
                onTouchTap={this.searchTouchTap} />
        );

        var settingsButton = (
            <IconButton
                className="icon-button"
                iconClassName="icon-settings"
                href="https://github.com/eternal0/chaos-studio-web"
                linkButton={true} />
        );

        return (
            <div>
                <AppBarWithNav title="Explore">
                {settingsButton}
                {searchButton}
                </AppBarWithNav>
                <Viewport ref="viewport" />
                <SearchDialog ref="searchDialog" onSearchClick={this._onSearchClick} />
            </div>
        );
    },

    _onSearchClick() {
        this.refs.viewport.setState({searching: true});

        let config = SearchConfigurationStore.configuration;
        let finder = new AttractorFinder(config, function(msg) { console.log(msg); }.bind(this), this._onSearchComplete.bind(this));
        finder.find();
    },

    _onSearchComplete(points) {
        this.refs.viewport.setState({searching: false});
        this.refs.viewport.setRenderData(points);
    },

    searchTouchTap: function() {
        this.refs.searchDialog.show();
    }
});

module.exports = Explore;