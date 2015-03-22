let React = require('react'),
    SettingsDialog = require('../components/SettingsDialog'),
    Actions = require('../actions/Actions'),
    QuadraticMap = require('../chaos/maps/QuadraticMap'),
    SingleComponentSettings = require('../components/settings/SingleComponentSettings'),
    FloatingActionButton = require('../components/FloatingActionButton');

class Links extends React.Component {
    render() {
        return (
            <div>
                <FloatingActionButton icon="icon-settings-light" onClick={this._click.bind(this)} mini />
            </div>
        );
    }

    _click() {
        Actions.SHOW_MODAL.invoke(
            <SettingsDialog>
                <SingleComponentSettings label="Map" value={new QuadraticMap()} types={[QuadraticMap]}/>
            </SettingsDialog>
        );
    }
}

Links.pageName = "Links";

module.exports = Links;