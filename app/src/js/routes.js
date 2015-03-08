let React = require('react'),
    Router = require('react-router'),
    Route = Router.Route,
    Redirect = Router.Redirect,
    App = require('./pages/App'),
    Home = require('./pages/Home'),
    Explore = require('./pages/Explore'),
    Settings = require('./pages/Settings'),
    Developers = require('./pages/Developers'),
    Links = require('./pages/Links');

let Routes = (
    <Route handler={App}>
        <Route name="home" handler={Home} />
        <Route name="explore" handler={Explore} />
        <Route name="settings" handler={Settings} />
        <Route name="developers" handler={Developers} />
        <Route name="links" handler={Links} />
        <Redirect from="/" to="/home" />
    </Route>

);

module.exports = Routes;