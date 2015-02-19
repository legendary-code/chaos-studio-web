/** @jsx React.DOM */
var React = require('react'),
    mui = require('material-ui'),
    AppBarWithNav = require('./AppBarWithNav'),
    Viewport = require('./Viewport');

var Explore = React.createClass({
    render: function() {
        return (
            <div>
                <AppBarWithNav title="Chaos Studio > Explore" />
                <Viewport />
            </div>
        );
    }
});

module.exports = Explore;