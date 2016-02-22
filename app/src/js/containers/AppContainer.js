import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { App } from '../pages';
import { toggleNav, applyConfiguration, rejectConfiguration } from '../state/actions';

class AppContainer extends Component {
    render() {
        return (
            <App title={this.props.title}
                 clickMenu={this.props.actions.toggleNav}
                 newConfiguration={this.props.newConfiguration}
                 children={this.props.children}
                 settingsCancelClick={this.props.actions.rejectConfiguration} />
        );
    }
}

function mapStateToProps(state) {
    return {
        title: state.app.get('title'),
        newConfiguration: state.app.getIn(['configuration', 'new'])
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ toggleNav, applyConfiguration, rejectConfiguration }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);