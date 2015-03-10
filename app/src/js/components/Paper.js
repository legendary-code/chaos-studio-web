let React = require('react'),
    join = require('../utils/ReactUtils').join;

let Paper = React.createClass({
    propTypes: {
        className: React.PropTypes.string
    },

    render() {
        let className = join("paper", this.props.className);

        return (
            <div className={className}>
                {this.props.children}
            </div>
        )
    }
});

module.exports = Paper;