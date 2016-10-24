class Component {
    static checkSupported() {
        return true;
    }

    static get params() { return []; }

    static get displayName() { }

    static get description() { }

    get type() { return this.constructor; }
}

module.exports = Component;