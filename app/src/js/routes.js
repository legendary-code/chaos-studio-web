/** @jsx React.DOM */

var Router = require('react-router'),
    Route = Router.Route,
    DefaultRoute = Router.DefaultRoute,

    /* Components */
    Master = require('./components/Master'),
    Home = require('./components/Home'),
    Explore = require('./components/Explore');

var Routes = (
    <Route name="root" path="/" handler={Master}>
        <Route name="home" handler={Home} />
        <Route name="explore" handler={Explore} />
        <DefaultRoute handler={Home} />
    </Route>
);

module.exports = Routes;