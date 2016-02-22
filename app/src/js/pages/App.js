import React, { Component, PropTypes } from 'react';
import AppBar from '../components/AppBar';
import AppContents from '../components/AppContents';
import NavDrawerContainer from '../containers/NavDrawerContainer';
import Modals from '../components/Modals';
import SettingsDialog from '../components/SettingsDialog';

class App extends Component {
    render() {
        const modals = [];

        if (this.props.newConfiguration) {
            modals.push(
                <SettingsDialog
                    component={this.props.newConfiguration}
                    cancelClick={this.props.settingsCancelClick}
                />
            );
        }

        return (
            <div className="app">
                <AppBar icon="icon-menu" onClick={this.props.clickMenu} title={this.props.title} />
                <NavDrawerContainer />
                <AppContents>
                    {this.props.children}
                </AppContents>
                <Modals>
                    {modals}
                </Modals>
            </div>
        );
    }

    static propTypes = {
        clickMenu: PropTypes.func,
        settingsApplyClick: PropTypes.func,
        settingsCancelClick: PropTypes.func,
        newConfiguration: PropTypes.object,
        children: PropTypes.element,
        title: PropTypes.string
    };
}

export default App;