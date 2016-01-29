export default class Component {
    static get params() { return []; }

    static get displayName() { }

    get type() { return this.constructor; }
}
