/** @jsx React.DOM */
var React = require('react'),
    mui = require('material-ui'),
    AppBarWithNav = require('./AppBarWithNav');

var Home = React.createClass({
    render: function() {
        return (
            <AppBarWithNav title="Chaos Studio > Home">

            </AppBarWithNav>
        );
    }
});

module.exports = Home;