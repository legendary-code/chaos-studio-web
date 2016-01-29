import React from 'react';
import Actions from '../actions/Actions';

export default class Modal extends React.Component {
    render() {
        return (
            <div className="modal">
                <div className="modal-background" onClick={this._close}>
                </div>
                {this.props.children}
            </div>
        );
    }

    _close() {
        Actions.CLOSE_TOPMOST_MODAL.invoke();
    }
}
