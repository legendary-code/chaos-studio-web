class Component {
    static get params() { return {}; }

    static get displayName() { }

    get type() { return this.constructor; }

    clone() {
        let TComponent = this.constructor;
        let instance = new TComponent();

        for (let key in TComponent.params) {
            if (this.hasOwnProperty(key)) {
                instance[key] = this[key];
            }
        }

        return instance;
    }
}

module.exports = Component;