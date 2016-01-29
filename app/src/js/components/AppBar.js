import React from 'react';
import IconButton from './IconButton';

export default class AppBar extends React.Component {
    render() {
        return (
            <div className="app-bar container">
                <IconButton className="app-bar-button" icon={this.props.icon} onClick={this.props.onClick} />
                <label className="font-title">{this.props.title}</label>
            </div>
        );
    }
}

AppBar.propTypes = {
    title: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
};
