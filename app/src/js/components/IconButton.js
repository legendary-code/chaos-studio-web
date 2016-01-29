import React from 'react';
import { cx } from '../utils/ReactUtils';
import Button from './button';
import Icon from './Icon';

export default class IconButton extends React.Component {
    render() {
        let icon = this.props.icon;
        let label = this.props.label;
        let left = this.props.left | !this.props.right;
        let right = this.props.right & !this.props.left;

        let outerClass = cx({
            "icon-button": true,
            "left": left,
            "right": right,
            "label": this.props.label
        });

        let children = [];

        if (icon) {
            icon += " left";
            children.push(<Icon icon={icon} key="icon"/>);
        }

        if (label) {
            children.push(<label className="font-button" key="label">{label}</label>);
        }

        return (
            <Button className={outerClass} onClick={this.props.onClick} raised={this.props.raised}>
                {children}
            </Button>
        )
    }

    static get propTypes() {
        return {
            icon: React.PropTypes.string,
            label: React.PropTypes.string,
            left: React.PropTypes.bool,
            right: React.PropTypes.bool,
            raised: React.PropTypes.bool,
            onClick: React.PropTypes.func
        }
    }

    static get defaultProps() {
        return {
            left: false,
            right: false
        }
    };
}
