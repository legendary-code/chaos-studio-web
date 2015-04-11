/* Lightweight, bare-minimum serializer for numbers and strings using a variation of BEncode */

class Base64Serializer {
    constructor() {
        this.reset();
    }

    reset() {
        this._value = "";
    }

    writeString(value) {
        this._value += value.length;
        this._value += ":";
        this._value += value;
    }

    writeNumber(value) {
        this._value += "i";
        this._value += value;
        this._value += "e";
    }

    toString() {
        return btoa(this._value);
    }
}

module.exports = Base64Serializer;