window.__DEV__ = true;

import $ from 'jquery';
window.jQuery = $;

import 'babel-polyfill';

import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { chaosStudioApp } from './state/reducers';
import { Router, Route, IndexRoute, useRouterHistory } from 'react-router';
import { createHashHistory } from 'history';
import { syncHistory, routeReducer } from 'react-router-redux';
import { App, Home, Explore, Settings, Developers, Links } from './pages';
import AppContainer from './containers/AppContainer';
import { setTitle } from './state/actions';

import thunk from 'redux-thunk';
import React from 'react';
import ReactDOM from 'react-dom';

// combined reducer
const reducer = combineReducers({
    router: routeReducer,
    app: chaosStudioApp
});

// middleware
const hashHistory = useRouterHistory(createHashHistory)({ queryKey: false });
const reduxRouterMiddleware = syncHistory(hashHistory);
const createStoreWithMiddleware = applyMiddleware(
    reduxRouterMiddleware,
    thunk
)(createStore);

const store = createStoreWithMiddleware(reducer);

function showTitle(title) {
    return (nextState, transition, callback) => {
        store.dispatch(setTitle(title));
        callback();
    }
}

ReactDOM.render(
    <Provider store={store}>
        <Router history={hashHistory}>
            <Route path="/" component={AppContainer}>
                <IndexRoute component={Home} onEnter={showTitle('Chaos Studio')} />
                <Route path="explore/:snapshotId" component={Explore} onEnter={showTitle('Explore')} />
                <Route path="explore" component={Explore} onEnter={showTitle('Explore')} />
                <Route path="settings" component={Settings} onEnter={showTitle('Settings')} />
                <Route path="developers" component={Developers} onEnter={showTitle('Developers')} />
                <Route path="links" component={Links} onEnter={showTitle('Links')} />
            </Route>
        </Router>
    </Provider>,
    document.getElementById('app')
);

