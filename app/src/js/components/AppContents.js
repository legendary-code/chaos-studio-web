let React = require('react');

let AppContents = React.createClass({
    render() {
        return (
            <div className="app-contents">
                {this.props.children}
            </div>
        )
    }
});

module.exports = AppContents;