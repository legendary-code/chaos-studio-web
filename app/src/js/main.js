/** @jsx React.DOM */
var React = require('react'),
    App = require('./App');

require('./Components');

React.renderComponent(
    <App />,
    document.getElementById('app')
);