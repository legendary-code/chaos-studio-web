import _ from 'underscore';
import { EventEmitter } from 'events';
import ChaosDispatcher from '../dispatcher/ChaosDispatcher';

export default class Store extends EventEmitter {
    constructor() {
        super();
        ChaosDispatcher.register(this.invoke.bind(this));
        this._state = this.getInitialState();
    }

    invoke(action) {
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
