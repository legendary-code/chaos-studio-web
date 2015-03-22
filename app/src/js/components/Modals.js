let _ = require('underscore'),
    $ = require('jquery'),
    React = require('react'),
    ModalStore = require('../stores/ModalStore')

class Modals extends React.Component {
    constructor(props) {
        super.constructor(props);
        this.state = { modals: [] };
    }

    componentDidMount() {
        ModalStore.addListener(this._updateModals.bind(this));
    }

    componentWillUnmount() {
        ModalStore.removeListener(this._updateModals.bind(this));
    }

    _updateModals() {
        this.setState({modals: ModalStore.state.modals});
    }

    render() {
        return (
            <div>
                {this.state.modals}
            </div>
        );
    }
}

module.exports = Modals;