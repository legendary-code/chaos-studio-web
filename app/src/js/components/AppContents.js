let React = require('react');

class AppContents extends React.Component {
    render() {
        return (
            <div className="app-contents">
                {this.props.children}
            </div>
        )
    }
}

module.exports = AppContents;