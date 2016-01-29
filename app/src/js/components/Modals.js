import React from 'react';

export default class Modals extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.modals}
            </div>
        );
    }
}
