let _ = require('underscore');

/* Defines a single point */
class Point {
    static isValid(point) {
        var sum = _.reduce(point, function(a,b) { return a + b; }, 0);
        return !isNaN(sum) && isFinite(sum);
    }

    static distanceSquared(p1, p2) {
        let d2 = 0;

        if (p1.length !== p2.length) {
            return NaN;
        }

        for (let i = 0; i < p1.length; ++i) {
            const dv = p1[i] - p2[i];
            d2 += dv*dv;
        }

        return d2;
    }

    static distance(p1, p2) {
        return Math.sqrt(Point.distanceSquared(p1, p2));
    }
}

module.exports = Point;