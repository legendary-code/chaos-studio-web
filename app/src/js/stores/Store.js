let _ = require('underscore'),
    EventEmitter = require('events').EventEmitter,
    ChaosDispatcher = require('../dispatcher/ChaosDispatcher');

class Store extends EventEmitter {
    constructor() {
        ChaosDispatcher.register(this.invoke.bind(this));
        this._state = this.getInitialState();
    }

    getInitialState() {
        return {};
    }

    addListener(callback) {
        this.on('change', callback);
    }

    removeListener(callback) {
        super.removeListener('change', callback);
    }

    setState(newState) {
        this._state = _.extend(this._state, newState);
        this._emit();
    }

    get state() {
        return this._state;
    }

    _emit() {
        super.emit('change');
    }
}

module.exports = Store;