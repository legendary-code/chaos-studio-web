import $ from 'jquery';
import _ from 'underscore';
import React from 'react';
import Modals from './Modals';
import AppBar from './AppBar';
import Actions from '../actions/Actions';
import Button from './Button';
import Paper from './Paper';
import SettingsPage from './settings/SettingsPage';

let Transition = {
    NONE: 0,
    NEXT: 1,
    PREV: 2
};

export default class SettingsDialog extends React.Component {
    constructor(props) {
        super();
        this.state = {
            pages: [ props.component ],
            transition: Transition.NONE,
            state: 0
        };
    }

    _page(n) {
        return this.state.pages.length + n > 0 ? this.state.pages[this.state.pages.length + n - 1] : null;
    }

    _n(n, i) {
        return ((n -1 + i) % 3) + 1;
    }

    render() {
        let content;

        let page1 = this.state.transition == Transition.PREV ? this._page(-1) : null;
        let page2 = this.state.transition == Transition.NEXT ? this._page(-1) : this._page(0);
        let page3 = this.state.transition == Transition.NEXT ? this._page(0) : null;

        let animClass = "";
        switch (this.state.transition) {
            case Transition.PREV:
                animClass = "slide-right";
                break;

            case Transition.NEXT:
                animClass = "slide-left";
                break;
        }

        let n = this.state.state;
        let beforeKey = "content-" + this._n(n, 1);
        let contentKey = "content-" + this._n(n, 2);
        let afterKey = "content-" + this._n(n, 3);

        let beforeClass = "contents before " + animClass + " " + beforeKey;
        let contentClass = "contents " + animClass + " " + contentKey;
        let afterClass = "contents after " + animClass + " " + afterKey;

        let appBarIcon = this.state.pages.length == 1 ? "icon-close" : "icon-back";
        let appBarIconClick = this.state.pages.length == 1 ? this._closeModal.bind(this) : this._prev.bind(this);

        return (
            <div className="settings-dialog">
                <AppBar
                    label="Settings"
                    icon={appBarIcon}
                    onClick={appBarIconClick} />
                <Paper className="desktop-title-bar">
                    <label className="font-title">Settings</label>
                </Paper>
                <div className="contents-container">
                    <SettingsPage
                        className={beforeClass}
                        key={beforeKey}
                        component={page1}
                        onEditComponent={this._next.bind(this)}
                        />
                    <SettingsPage
                        className={contentClass}
                        key={contentKey}
                        component={page2}
                        onEditComponent={this._next.bind(this)}
                        />
                    <SettingsPage
                        className={afterClass}
                        key={afterKey}
                        component={page3}
                        onEditComponent={this._next.bind(this)}
                        />
                </div>
                <Paper className="action-bar">
                    <Button onClick={this._prev.bind(this)}>CANCEL</Button>
                    <Button onClick={this._next.bind(this)}>OK</Button>
                </Paper>
            </div>
        )
    }

    _closeModal() {
        Actions.CLOSE_TOPMOST_MODAL.invoke();
    }

    _prev() {
        if (this.state.pages.length <= 1 || this.state.transition != Transition.NONE) {
            return;
        }

        let pages = this.state.pages.slice(0, this.state.pages.length - 1);
        this.setState({
            transition: Transition.PREV
        });

        setTimeout(function() {
            let state = this.state.state;
            state = (state + 2) % 3;
            this.setState({transition: Transition.NONE, state: state, pages: pages});
        }.bind(this), 200);
    }

    _next(component) {
        if(this.state.transition != Transition.NONE) {
            return;
        }

        let pages = this.state.pages;

        pages.push(component);

        this.setState({
            transition: Transition.NEXT,
            pages: pages
        });

        setTimeout(function() {
            let state = this.state.state;
            state = (state + 1) % 3;
            this.setState({transition: Transition.NONE, state: state});
        }.bind(this), 200);
    }
}
