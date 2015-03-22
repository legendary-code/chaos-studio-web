let React = require('react'),
    cx = require('../utils/ReactUtils').cx,
    Button = require('./button'),
    Icon = require('./Icon');

class IconButton extends React.Component {
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
            children.push(<Icon icon={icon} />);
        }

        if (label) {
            children.push(<label className="font-button">{label}</label>);
        }

        return (
            <Button className={outerClass} onClick={this.props.onClick} raised={this.props.raised}>
                {children}
            </Button>
        )
    }
}

IconButton.propTypes = {
    icon: React.PropTypes.string,
    label: React.PropTypes.string.isRequired,
    left: React.PropTypes.bool,
    right: React.PropTypes.bool,
    raised: React.PropTypes.bool,
    onClick: React.PropTypes.func
};

IconButton.defaultProps = {
    left: false,
    right: false
};

module.exports = IconButton;