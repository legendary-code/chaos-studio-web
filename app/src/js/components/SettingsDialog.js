let $ = require('jquery'),
    React = require('react'),
    Modals = require('./Modals'),
    AppBar = require('./AppBar');

class SettingsDialog extends React.Component {
    render() {
        return (
            <div className="settings-dialog">
                <AppBar className="settings-title-bar" label="Settings" icon="icon-back" />
                <div className="settings-contents">
                    {this.props.children}
                </div>
            </div>
        )
    }
}

module.exports = SettingsDialog;