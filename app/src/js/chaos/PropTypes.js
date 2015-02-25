class PropTypes {
    static real(min, max) {
        return {
            type: 'real',
            min: min,
            max: max
        };
    }

    static integer(min, max) {
        return {
            type: 'integer',
            min: min,
            max: max
        };
    }

    static range(min, max) {
        return {
            type: 'range',
            min: min,
            max: max
        };
    }
}

module.exports = PropTypes;