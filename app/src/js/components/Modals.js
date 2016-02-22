import React, { PropTypes } from 'react';

export default class Modals extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }

    static propTypes = {
        children: PropTypes.element
    };
}
