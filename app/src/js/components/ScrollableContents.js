let React = require('react');

class ScrollableContents extends React.Component {
    render() {
        return (
            <div className="scrollable-contents">
                {this.props.children}
            </div>
        )
    }
}

module.exports = ScrollableContents;