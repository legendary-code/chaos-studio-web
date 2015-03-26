let React = require('react'),
    SettingsDialog = require('../components/SettingsDialog'),
    Actions = require('../actions/Actions'),
    QuadraticMap = require('../chaos/maps/QuadraticMap'),
    SingleComponentSettings = require('../components/settings/SingleComponentSettings'),
    FloatingActionButton = require('../components/FloatingActionButton'),
    LyapunovExponent = require('../chaos/criteria/LyapunovExponent'),
    ValueBinding = require('../components/settings/values/ValueBinding');

class Links extends React.Component {
    render() {
        return (
            <div>
                <FloatingActionButton icon="icon-settings-light" onClick={this._click.bind(this)} mini />
            </div>
        );
    }

    _click() {
        let binding = new ValueBinding({component: new LyapunovExponent()}, "component");

        Actions.SHOW_MODAL.invoke(
            <SettingsDialog>
                <SingleComponentSettings label="Map" binding={binding} types={[QuadraticMap, LyapunovExponent]}/>
            </SettingsDialog>
        );
    }
}

Links.pageName = "Links";

module.exports = Links;