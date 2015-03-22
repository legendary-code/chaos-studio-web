let React = require('react'),
    Icon = require('../components/Icon'),
    Button = require('../components/Button'),
    cx = require('../utils/ReactUtils').cx,
    join = require('../utils/ReactUtils').join;

class FloatingActionButton extends React.Component {
    render() {
        let className = cx({
            "floating-action-button": true,
            "mini": this.props.mini
        });

        className = join(className, this.props.className);

        return (
            <Button className={className} onClick={this.props.onClick} raised>
                <Icon icon={this.props.icon} />
            </Button>
        );
    }
}

FloatingActionButton.propTypes = {
    mini: React.PropTypes.bool,
    icon: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func
};

module.exports = FloatingActionButton;