let React = require('react'),
    Router = require('react-router'),
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,
    App = require('./pages/App'),
    Home = require('./pages/Home');

let Routes = (
    <Route name="app" path="/" handler={App} title="Home">
        <DefaultRoute handler={Home} title="Home" />
        <Route name="home" title="Home" handler={Home} />
    </Route>
);

module.exports = Routes;