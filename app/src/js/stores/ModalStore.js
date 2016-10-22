let _ = require('underscore'),
    Store = require('./Store'),
    Actions = require('../actions/Actions'),
    React = require('react'),
    Modal = require('../components/Modal');

class ModalStore extends Store {
    getInitialState() {
        return {
            modals: []
        };
    }

    invoke(action) {
        let modals = this.state.modals;

        switch (action.type) {
            case Actions.SHOW_MODAL.id:
                modals.push(<Modal>{action.data}</Modal>);
                this.setState({modals: modals});
                break;

            case Actions.CLOSE_TOPMOST_MODAL.id:
                modals = _.take(modals, modals.length - 1);
                this.setState({modals: modals});
                break;
        }
    }
}

module.exports = new ModalStore();