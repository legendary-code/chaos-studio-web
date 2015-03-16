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
        return route.handler.pageName;
    },

    render: function() {
        let label = this._getRouteTitle();

        return (
            <div className="app">
                <AppBar label={label} />
                <NavDrawer>
                    <NavDrawerButton icon="icon-home" label="Home" route="home"/>
                    <NavDrawerButton icon="icon-search" label="Explore" route="explore"/>
                    <NavDrawerDivider />
                    <NavDrawerButton icon="icon-settings" label="Settings" route="settings"/>
                    <NavDrawerButton icon="icon-github" label="Developers" route="developers"/>
                    <NavDrawerDivider />
                    <NavDrawerButton icon="icon-info-outline" label="Links" route="links"/>
                </NavDrawer>
                <AppContents>
                    <RouteHandler />
                </AppContents>
            </div>
        );
    }
});

module.exports = App;