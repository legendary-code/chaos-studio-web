/* Utility class to help with retrieving and setting a parameter value */
class ValueBinding {
    constructor(target, prop) {
        this._target = target;
        this._prop = prop;
    }

    get value() {
        return this._target[this._prop];
    }

    set value(v) {
        this._target[this._prop] = v;
    }
}

module.exports = ValueBinding;