/* Utility class to help with retrieving and setting a parameter value */
export default class ValueBinding {
    constructor(target, prop) {
        this._target = target;
        this._prop = prop;
    }

    get val() {
        return this._target[this._prop];
    }

    set val(v) {
        this._target[this._prop] = v;
    }

    get target() {
        return this._target;
    }

    get prop() {
        return this._prop;
    }
}
