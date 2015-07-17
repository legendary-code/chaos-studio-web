let $ = require('jquery'),
    React = require('react'),
    Modals = require('./Modals'),
    AppBar = require('./AppBar'),
    Actions = require('../actions/Actions'),
    Button = require('./Button'),
    Paper = require('./Paper');

class SettingsDialog extends React.Component {
    render() {
        return (
            <div className="settings-dialog">
                <AppBar
                    label="Settings"
                    icon="icon-back"
                    onClick={this._closeModal.bind(this)} />
                <Paper className="desktop-title-bar">
                    <label className="font-title">Settings</label>
                </Paper>
                <div className="settings-contents">
                    {this.props.children}
                </div>
                <Paper className="action-bar">
                    <Button>CANCEL</Button>
                    <Button>OK</Button>
                </Paper>
            </div>
        )
    }

    _closeModal() {
        Actions.CLOSE_TOPMOST_MODAL.invoke();
    }
}

module.exports = SettingsDialog;