window.__DEV__ = true;

require('babel/polyfill');

let React = require('react'),
    RouterStore = require('./stores/RouterStore'),
    Actions = require('./actions/Actions'),
    Routes = require('./routes');

React.initializeTouchEvents(true);

Actions.RUN_ROUTES.invoke({
    routes: Routes,
    callback: (Handler) => {
        React.render(<Handler />, document.getElementById('app'));
    }
});
