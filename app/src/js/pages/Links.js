import React from 'react';
import SettingsDialog from '../components/SettingsDialog';
import FloatingActionButton from '../components/FloatingActionButton';
import Actions from '../actions/Actions';
import SearchConfigurationStore from '../stores/SearchConfigurationStore';

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
export default Links;