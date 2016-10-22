/**
 * Implements a means of registering implementations of various base component types for use in configuration
 */
class Components {
    static register(baseType, type, isDefault) {
        let types = Components.TYPES[baseType];

        if (!types) {
            types = Components.TYPES[baseType] = [];
        }

        if (isDefault) {
            types.unshift(type);
        } else {
            types.push(type);
        }
    }

    static findTypes(baseType) {
        let types = Components.TYPES[baseType];
        return types || [];
    }

    static allTypes() {
        let allTypes = [];

        for (let baseType in Components.TYPES) {
            if (!Components.TYPES.hasOwnProperty(baseType)) {
                continue;
            }

            let types = Components.TYPES[baseType];
            allTypes.push(...types);
        }

        return allTypes;
    }
}

Components.TYPES = {};

module.exports = Components;

/* Include registered plug-ins automatically */
require('./maps/**/*.js', {glob:true});
