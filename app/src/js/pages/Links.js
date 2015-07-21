let React = require('react'),
    SettingsDialog = require('../components/SettingsDialog'),
    FloatingActionButton = require('../components/FloatingActionButton'),
    Actions = require('../actions/Actions'),
    SearchConfigurationStore = require('../stores/SearchConfigurationStore');

class Links extends React.Component {
    render() {
        return (
            <div>
                <FloatingActionButton icon="icon-settings-light" onClick={this._click.bind(this)} mini />
            </div>
        );
    }

    _click() {
        Actions.SHOW_MODAL.invoke(<SettingsDialog component={SearchConfigurationStore.configuration} />);
    }
}

Links.pageName = "Links";

module.exports = Links;