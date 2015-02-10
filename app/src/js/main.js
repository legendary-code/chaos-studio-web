/** @jsx React.DOM */
var React = require('react'),
    App = require('./App');

React.renderComponent(
    <App />,
    document.getElementById('app')
);