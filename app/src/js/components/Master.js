var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    AppBar = require('./AppBar'),
    NavDrawer = require('./NavDrawer');

var Master = React.createClass({
    render: function() {
        return (
            <div>
                <AppBar />
                <NavDrawer />
            </div>
        );
    }
});

module.exports = Master;