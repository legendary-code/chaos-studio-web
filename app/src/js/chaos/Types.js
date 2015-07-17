/* Parameter types for Components */

/* Used to define component attributes that can be rendered in a settings dialog */
class Types {
    /* A numeric value */
    static number(label, min, max, icon) {
        return {
            type: 'number',
            label: label,
            min: min,
            max: max,
            icon: icon || 'icon-settings'
        };
    }

    static boolean(label) {
        return {
            type: 'boolean',
            label: label
        };
    }

    static component(label, componentType) {
        return {
            type: 'component',
            label: label,
            componentType: componentType
        }
    }

    static componentSet(label, componentType) {
        return {
            type: 'componentSet',
            label: label,
            componentType: componentType
        }
    }
}

module.exports = Types;