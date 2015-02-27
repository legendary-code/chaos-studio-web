var EventEmitter = require('events').EventEmitter,
    ChaosDispatcher = require('../dispatcher/ChaosDispatcher');

class Store extends EventEmitter {
    constructor() {
        ChaosDispatcher.register(this._invokeWithEmit);
    }

    _invokeWithEmit(action) {
        if (_invoke(action)) {
            _emit();
        }
    }

    _invoke(action) { }

    addListener(callback) {
        this.on('change', callback);
    }

    removeListener(callback) {
        super.removeListener('change', callback);
    }

    _emit() {
        super.emit('change');
    }
}

module.exports = Store;