/** @jsx React.DOM */
var React = require('react'),
    AppBarWithNav = require('./AppBarWithNav'),
    Viewport = require('./Viewport'),
    mui = require('material-ui'),
    IconButton = mui.IconButton,
    SearchDialog = require('./SearchDialog');

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
                <Viewport />
                <SearchDialog ref="searchDialog" />
            </div>
        );
    },

    searchTouchTap: function() {
        this.refs.searchDialog.show();
    }
});

module.exports = Explore;