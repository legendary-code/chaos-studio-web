/* Parameter types for Components */

class Types {
    /* A numeric value */
    static number(label, defaultValue, min, max, decimals) {
        return {
            type: 'number',
            label: label,
            defaultValue: defaultValue,
            min: min,
            max: max,
            decimals: decimals
        };
    }

    static range(label, min, max, decimals) {
        return {
            type: 'range',
            label: label,
            min: min,
            max: max,
            decimals: decimals
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