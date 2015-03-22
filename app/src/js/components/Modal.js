let React = require('react'),
    Actions = require('../actions/Actions');

class Modal extends React.Component {
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

module.exports = Modal;