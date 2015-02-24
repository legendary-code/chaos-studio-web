/** @jsx React.DOM */

var Router = require('react-router'),
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,

    /* Components */
    Master = require('./components/Master'),
    Home = require('./pages/Home'),
    Explore = require('./pages/Explore');

var Routes = (
    <Route name="root" path="/" handler={Master}>
        <Route name="home" handler={Home} />
        <Route name="explore" handler={Explore} />
        <DefaultRoute handler={Home} />
    </Route>
);

module.exports = Routes;