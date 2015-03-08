let React = require('react'),
    AppBar = require('../components/AppBar'),
    NavDrawer = require('../components/NavDrawer'),
    AppContents = require('../components/AppContents'),
    NavDrawerButton = require('../components/NavDrawerButton'),
    NavDrawerDivider = require('../components/NavDrawerDivider'),
    Router = require('react-router'),
    Button = require('../components/Button'),
    RouteHandler = Router.RouteHandler;

let App = React.createClass({

    mixins: [ Router.State ],

    _getRouteTitle() {
        let routes = this.getRoutes();
        let route = routes[routes.length - 1];
        return `Chaos Studio > ${route.handler.pageName}`;
    },

    render: function() {
        let label = this._getRouteTitle();

        return (
            <div className="app">
                <AppBar label={label} />
                <NavDrawer>
                    <NavDrawerButton icon="icon-home" label="Home"/>
                    <NavDrawerButton icon="icon-search" label="Explore"/>
                    <NavDrawerDivider />
                    <NavDrawerButton icon="icon-settings" label="Settings"/>
                    <NavDrawerDivider />
                    <NavDrawerButton icon="icon-info-outline" label="Links"/>
                </NavDrawer>
                <AppContents>
                    <RouteHandler />
                </AppContents>
            </div>
        );
    }
});

module.exports = App;