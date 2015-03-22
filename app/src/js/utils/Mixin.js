let _ = require('underscore');

window.mixin = module.exports.Mixin = function() {
    let mixins = arguments;

    let Class = function() {
        let args = arguments;

        for (let i=0; i<mixins.length;i++) {
            let mixin = mixins[i];
            if (mixin instanceof Function) {
                mixin.prototype.constructor.apply(this, args)
            } else if (mixin instanceof Object) {
                _.extend(this, mixin);
            }
        }
    };

    return Class;
};