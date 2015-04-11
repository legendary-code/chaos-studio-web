/* Lightweight, bare-minimum deserializer for numbers and strings using a variation of BEncode */

class Base64Deserializer {
    constructor(value) {
        this.reset(value);
    }

    reset(value) {
        this._value = atob(value);
    }

    next() {
        this._current = this._value.substr(0, 1);
        this._value = this._value.substr(1);
        return this._current;
    }

    hasNext() {
        return this._value.length > 0;
    }

    current() {
        return this._current;
    }

    read(n) {
        this._current = this._value.substr(0, n);
        this._value = this._value.substr(n);
        return this._current;
    }

    readString() {
        let length = this.next();

        if (length == "n") {
            return null;
        }

        while (this.hasNext() && this.next() != ":") {
            length += this.current();
        }

        length = parseInt(length);
        return this.read(length);
    }

    readNumber() {
        let start = this.next();

        if (start != "i") {
            return null;
        }

        let value = "";

        while (this.hasNext() && this.next() != "e") {
            value += this.current();
        }

        return parseInt(value);
    }
}

module.exports = Base64Deserializer;