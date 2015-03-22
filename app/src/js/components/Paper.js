let React = require('react'),
    join = require('../utils/ReactUtils').join;

class Paper extends React.Component {
    render() {
        let className = join("paper", this.props.className);

        return (
            <div className={className}>
                {this.props.children}
            </div>
        )
    }
}

Paper.propTypes = {
    className: React.PropTypes.string
};

module.exports = Paper;