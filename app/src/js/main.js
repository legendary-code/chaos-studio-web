window.__DEV__ = true;

require('babel/polyfill');
window.jQuery = require('jquery');
require('./jquery.mobile.custom');
require('inobounce');

let React = require('react'),
    RouterStore = require('./stores/RouterStore'),
    Actions = require('./actions/Actions'),
    Routes = require('./routes'),
    GA = require('./utils/GoogleAnalytics');

React.initializeTouchEvents(true);

Actions.RUN_ROUTES.invoke({
    routes: Routes,
    callback: (Handler) => {
        GA.pageview({dl: window.location.href}).send();
        React.render(<Handler />, document.getElementById('app'));
    }
});