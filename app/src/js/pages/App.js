let React = require('react'),
    AppBar = require('../components/AppBar'),
    NavDrawer = require('../components/NavDrawer'),
    AppContents = require('../components/AppContents'),
    NavDrawerButton = require('../components/NavDrawerButton'),
    NavDrawerDivider = require('../components/NavDrawerDivider'),
    RouterStore = require('../stores/RouterStore'),
    Router = require('react-router'),
    Actions = require('../actions/Actions'),
    Modals = require('../components/Modals'),
    RouteHandler = Router.RouteHandler;

class App extends React.Component {
    _getRouteTitle() {
        let routes = RouterStore.getCurrentRoutes();
        let route = routes[routes.length - 1];
        return route.handler.pageName;
    }

    render() {
        let label = this._getRouteTitle();

        return (
            <div className="app">
                <AppBar icon="icon-menu" onClick={this._toggleNavBar} label={label} />
                <NavDrawer>
                    <NavDrawerButton icon="icon-home" label="Home" route="home"/>
                    <NavDrawerDivider />
                    <NavDrawerButton icon="icon-search" label="Explore" route="explore"/>
                    <NavDrawerButton icon="icon-github" label="Developers" route="developers"/>
                    <NavDrawerDivider />
                    <NavDrawerButton icon="icon-info-outline" label="Links" route="links"/>
                    <NavDrawerButton icon="icon-pencil" label="Changelog" route="changelog"/>
                </NavDrawer>
                <AppContents>
                    <RouteHandler />
                </AppContents>
                <Modals />
            </div>
        );
    }

    _toggleNavBar() {
        Actions.TOGGLE_NAV_DRAWER.invoke();
    }
}

module.exports = App;