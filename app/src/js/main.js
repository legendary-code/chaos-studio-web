window.__DEV__ = true;

require('babel/polyfill');

let React = require('react'),
    Router = require('react-router'),
    Routes = require('./routes');

React.initializeTouchEvents(true);

Router.run(Routes, (Handler) => {
    React.render(<Handler />, document.getElementById('app'));
});
