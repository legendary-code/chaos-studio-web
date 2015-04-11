class Component {
    static get params() { return {}; }

    static get displayName() { }

    get type() { return this.constructor; }
    get typeName() { return this.constructor.name; }
}

module.exports = Component;