let $ = require('jquery'),
    React = require('react'),
    Modals = require('./Modals'),
    AppBar = require('./AppBar'),
    Actions = require('../actions/Actions');

class SettingsDialog extends React.Component {
    render() {
        return (
            <div className="settings-dialog">
                <AppBar
                    className="settings-title-bar"
                    label="Settings"
                    icon="icon-back"
                    onClick={this._closeModal.bind(this)} />
                <div className="settings-contents">
                    {this.props.children}
                </div>
            </div>
        )
    }

    _closeModal() {
        Actions.CLOSE_TOPMOST_MODAL.invoke();
    }
}

module.exports = SettingsDialog;