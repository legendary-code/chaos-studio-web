/* Parameter types for Components */

/* Used to define component attributes that can be rendered in a settings dialog */
export default class Props {
    /* A numeric value */
    static number(property, label, min, max, icon) {
        return {
            type: 'number',
            property: property,
            label: label,
            min: min,
            max: max,
            icon: icon || 'icon-settings'
        };
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
