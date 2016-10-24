let React = require('react'),
    IconButton = require('./IconButton');

class AppBar extends React.Component {
    render() {
        return (
            <div className="app-bar container">
                <IconButton className="app-bar-button" icon={this.props.icon} onClick={this.props.onClick} />
                <label className="font-title">{this.props.label}</label>
                {this.props.children}
            </div>
        );
    }
}

AppBar.propTypes = {
    label: React.PropTypes.string.isRequired,
    icon: React.PropTypes.string.isRequired,
    onClick: React.PropTypes.func
};

module.exports = AppBar;