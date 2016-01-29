import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavDrawer, NavDrawerButton, NavDrawerDivider } from '../components/nav';
import { hideNav } from '../state/actions';
import { routeActions } from 'react-router-redux';

class NavDrawerContainer extends Component {
    render() {
        return (
            <NavDrawer hidden={this.props.hidden} clickOutside={this.props.actions.hideNav}>
                <NavDrawerButton icon="icon-home" label="Home" onClick={this._gotoPage('')} />
                <NavDrawerButton icon="icon-search" label="Explore" onClick={this._gotoPage('explore')}/>
                <NavDrawerDivider />
                <NavDrawerButton icon="icon-settings" label="Settings" onClick={this._gotoPage('settings')}/>
                <NavDrawerButton icon="icon-github" label="Developers" onClick={this._gotoPage('developers')}/>
                <NavDrawerDivider />
                <NavDrawerButton icon="icon-info-outline" label="Links" onClick={this._gotoPage('links')}/>
            </NavDrawer>
        );
    }

    _gotoPage(route) {
        return () => this.props.actions.push({pathname: route});
    }
}

function mapStateToProps(state) {
    return {
        hidden: state.app.getIn(['nav', 'hidden'], false)
    }
}

function mapDispatchToProps(dispatch) {
    return { actions: bindActionCreators({ hideNav, push: routeActions.push }, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(NavDrawerContainer);