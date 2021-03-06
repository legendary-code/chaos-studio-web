let React = require('react');

class Header extends React.Component {
    render() {
        return (
            <label className="font-setting-subhead settings-header">{this.props.label}</label>
        )
    }
}

Header.propTypes = {
    label: React.PropTypes.string.isRequired
};

module.exports = Header;