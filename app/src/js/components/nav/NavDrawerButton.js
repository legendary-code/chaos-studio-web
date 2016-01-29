import React, { Component, PropTypes } from 'react';
import { cx } from '../../utils/ReactUtils';
import Icon from './../Icon';
import Actions from '../../actions/Actions';
import Button from './../Button';

export default class NavDrawerButton extends Component {
    render() {
        let labelFont = cx({
            "font-nav-button": true,
            "font-active-route": this.props.active
        });

        return (
            <Button className="nav-drawer-button" onClick={this.props.onClick}>
                <Icon icon={this.props.icon} />
                <label className={labelFont}>{this.props.label}</label>
            </Button>
        )
    }

    static propTypes = {
        active: PropTypes.bool,
        icon: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func
    };
}