/** @jsx React.DOM */
window.__DEV__ = true;

require('babel/polyfill');

var React = require('react'),
    Router = require('react-router'),
    Routes = require('./routes'),
    injectTapEventPlugin = require("react-tap-event-plugin");

injectTapEventPlugin();

Router
    .create({
        routes: Routes,
        scrollBehavior: Router.ScrollToTopBehavior
    })
    .run(function(Handler){
        React.render(<Handler />, document.getElementById('app'));
    });

