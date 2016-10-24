let Component = require('./Component'),
    JSEncoder = require('jsencode');

const TYPES = {};

/**
 * Implements a means of registering implementations of various base component types for use in configuration
 */
class Components {
    static register(baseType, type, isDefault) {
        if (type.checkSupported && !type.checkSupported()) {
            return;
        }

        let types = TYPES[baseType];

        if (!types) {
            types = TYPES[baseType] = [];
        }

        if (isDefault) {
            types.unshift(type);
        } else {
            types.push(type);
        }

        this._setupEncodingMethods(type);
    }

    static findTypes(baseType) {
        let types = TYPES[baseType];
        return types || [];
    }

    static allTypes() {
        let allTypes = [];

        for (let baseType in TYPES) {
            if (!TYPES.hasOwnProperty(baseType)) {
                continue;
            }

            let types = TYPES[baseType];
            allTypes.push(...types);
        }

        return allTypes;
    }

    // We set up encoding methods here to avoid dependency issues
    static _setupEncodingMethods(type) {
        let self = this;

        Object.defineProperty(
            type,
            'decode', {
                value: function (val) {
                    return self._encoder().decode((atob(val)));
                }
            }
        );

        Object.defineProperty(
            type.prototype,
            'encode', {
                value: function () {
                    return btoa(self._encoder().encode(this));
                }
            }
        );
    }

    static _encoder() {
        return new JSEncoder({includePrivateFields: false, types : Components.allTypes()});
    }
}

Components.register(Component, Component, true);
module.exports = Components;

/* Include registered plug-ins automatically */
require('./maps/**/*.js', {glob:true});
