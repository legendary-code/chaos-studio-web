import React from 'react';

export default class AppContents extends React.Component {
    render() {
        return (
            <div className="app-contents">
                {this.props.children}
            </div>
        )
    }
}
