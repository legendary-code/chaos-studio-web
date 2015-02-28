var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,
    mui = require('material-ui'),
    AppCanvas = mui.AppCanvas;

var Master = React.createClass({
    render: function() {
        return (
            <AppCanvas predefinedLayout={1}>
                <RouteHandler />
            </AppCanvas>
        );
    }
});

module.exports = Master;