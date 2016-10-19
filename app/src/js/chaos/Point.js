let _ = require('underscore');

/* Defines a single point */
class Point {
    static isValid(point) {
        var sum = _.reduce(point, function(a,b) { return a + b; }, 0);
        return !isNaN(sum) && isFinite(sum);
    }
}

module.exports = Point;