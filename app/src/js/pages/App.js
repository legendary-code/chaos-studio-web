import React, { Component, PropTypes } from 'react';
import AppBar from '../components/AppBar';
import AppContents from '../components/AppContents';
import NavDrawerContainer from '../containers/NavDrawerContainer';
import Modals from '../components/Modals';

class App extends Component {
    render() {
        const { modals } = this.props;

        return (
            <div className="app">
                <AppBar icon="icon-menu" onClick={this.props.clickMenu} title={this.props.title} />
                <NavDrawerContainer />
                <AppContents>
                    {this.props.children}
                </AppContents>
                <Modals modals={modals} />
            </div>
        );
    }

    static propTypes = {
        clickMenu: PropTypes.func,
        children: PropTypes.arrayOf(PropTypes.element),
        title: PropTypes.string
    };
}

export default App;