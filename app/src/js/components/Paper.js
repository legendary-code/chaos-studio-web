let React = require('react'),
    cx = require('react-addons').classSet;

let Paper = React.createClass({
    propTypes: {
        container: React.PropTypes.bool
    },

    render() {
        let className = cx({
            "paper": true,
            "container": this.props.container
        });

        return (
            <div className={className}>
                {this.props.children}
            </div>
        )
    }
});

module.exports = Paper;