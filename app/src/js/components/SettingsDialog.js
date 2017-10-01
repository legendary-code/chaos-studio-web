let $ = require('jquery'),
    _ = require('underscore'),
    React = require('react'),
    Modals = require('./Modals'),
    AppBar = require('./AppBar'),
    Actions = require('../actions/Actions'),
    Button = require('./Button'),
    Paper = require('./Paper'),
    SettingsPage = require('./settings/SettingsPage'),
    GA = require('../utils/GoogleAnalytics');


let Transition = {
    NONE: 0,
    NEXT: 1,
    PREV: 2
};

class SettingsDialog extends React.Component {
    constructor(props) {
        super();
        GA.event("settings", "open").send();

        this.state = {
            component: props.component,
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

        let page1 = this.state.transition === Transition.PREV ? this._page(-1) : null;
        let page2 = this.state.transition === Transition.NEXT ? this._page(-1) : this._page(0);
        let page3 = this.state.transition === Transition.NEXT ? this._page(0) : null;

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

        let appBarIcon = this.state.pages.length === 1 ? "icon-close" : "icon-back";
        let appBarIconClick = this.state.pages.length === 1 ? this._closeModal.bind(this) : this._prev.bind(this);

        let actionBarButtons;
        if (this.state.pages.length === 1) {
            actionBarButtons = [];

            if (this.props.defaultSettingsFactory) {
                actionBarButtons.push(<Button key="sd-reset-all" onClick={this._resetAll.bind(this)}>Reset All</Button>);
            }

            actionBarButtons.push(<Button key="sd-close" onClick={this._closeModal.bind(this)}>Close</Button>);
        } else {
            actionBarButtons = <Button key="sd-back" onClick={this._prev.bind(this)}>Back</Button>;
        }

        return (
            <div className="settings-dialog">
                <AppBar
                    label="Settings"
                    icon={appBarIcon}
                    onClick={appBarIconClick}>
                    <Button className="reset-button" onClick={this._resetAll.bind(this)}>Reset All</Button>
                </AppBar>
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
                    {actionBarButtons}
                </Paper>
            </div>
        )
    }

    _closeModal() {
        GA.event("settings", "close").send();
        Actions.CLOSE_TOPMOST_MODAL.invoke();

        if (this.props.onClose) {
            this.props.onClose(this.state.component);
        }
    }

    _resetAll() {
        if (confirm("Reset all settings?")) {
            GA.event("settings", "reset").send();
            let component = this.props.defaultSettingsFactory();
            this.setState({component: component, pages: [component]});
        }
    }

    _prev() {
        if (this.state.pages.length <= 1 || this.state.transition !== Transition.NONE) {
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
        if(this.state.transition !== Transition.NONE) {
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

SettingsDialog.propTypes = {
    defaultSettingsFactory: React.PropTypes.func,
    onClose: React.PropTypes.func
};

module.exports = SettingsDialog;