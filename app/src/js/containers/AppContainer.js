import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { App } from '../pages';
import { toggleNav } from '../state/actions';

class AppContainer extends Component {
    render() {
        return (
            <App title={this.props.title} clickMenu={this.props.actions.toggleNav} />
        );
    }
}

function mapStateToProps(state) {
    return {
        title: state.app.get('title')
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators({ toggleNav }, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);