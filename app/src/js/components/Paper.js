import React from 'react';
import { join } from '../utils/ReactUtils';

export default class Paper extends React.Component {
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
