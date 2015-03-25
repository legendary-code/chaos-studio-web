/* Parameter types for Components */

class Types {
    /* A numeric value */
    static number(label, min, max, icon = 'icon-settings') {
        return {
            type: 'number',
            label: label,
            min: min,
            max: max,
            icon: icon
        };
    }

    static boolean(label) {
        return {
            type: 'boolean',
            label: label
        };
    }
}

module.exports = Types;