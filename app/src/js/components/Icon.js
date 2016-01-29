import _ from 'underscore';
import React from 'react';

export default class Icon extends React.Component {
    render() {
        let className = "icon " + this.props.icon;
        let other = _.omit(this.props.icon, "icon");

        return (
            <span className={className} role="img" {...other}></span>
        );
    }
}

Icon.propTypes = {
    icon: React.PropTypes.string.isRequired
};
