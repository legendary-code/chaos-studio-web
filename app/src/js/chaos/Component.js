class Component {
    static get params() { }
    static get displayName() { }
    get type() { return this.constructor; }
}

module.exports = Component;