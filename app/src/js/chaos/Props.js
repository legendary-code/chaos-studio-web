let _ = require('underscore');
/* Parameter types for Components */

/* Used to define component attributes that can be rendered in a settings dialog */
class Props {
    /* A numeric value */
    static number(property, label, min, max, options) {
        return _.extend(
            {},
            {
                type: 'number',
                property: property,
                label: label,
                min: min,
                max: max,
                range: false
            },
            _.pick(options, 'icon', 'integral', 'step', 'decimalPlaces')
        );
    }

    static numberRange(label, propertyMin, propertyMax, min, max, options) {
        return _.extend(
            {},
            {
                type: 'number',
                propertyMin: propertyMin,
                propertyMax: propertyMax,
                label: label,
                min: min,
                max: max,
                range: true
            },
            _.pick(options, 'icon', 'integral', 'step', 'decimalPlaces')
        );
    }

    static boolean(property, label) {
        return {
            type: 'boolean',
            property: property,
            label: label
        };
    }

    static component(property, label, componentType) {
        return {
            type: 'component',
            property: property,
            label: label,
            componentType: componentType
        }
    }

    static componentSet(property, label, componentType) {
        return {
            type: 'componentSet',
            property: property,
            label: label,
            componentType: componentType
        }
    }

    static group(label, ...properties) {
        return {
            type: 'group',
            label: label,
            properties: properties
        }
    }
}

module.exports = Props;