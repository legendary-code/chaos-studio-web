const _ = require('underscore');

/* Defines a single point */
class Point {
    static isValid(point) {
        const sum = _.reduce(point, function(a,b) { return a + b; }, 0);
        return !isNaN(sum) && isFinite(sum);
    }

    static distanceSquared(p1, p2) {
        let d2 = 0;

        if (p1 && p2 && p1.length !== p2.length) {
            return NaN;
        }

        for (let i = 0; i < p1.length; ++i) {
            const dv = p1[i] - (p2 && p2[i] || 0);
            d2 += dv*dv;
        }

        return d2;
    }

    static distance(p1, p2) {
        return Math.sqrt(Point.distanceSquared(p1, p2));
    }

    static unit(dimensions) {
        const point = [];
        for (let i = 0; i<dimensions; ++i) {
            point.push(1.0);
        }
        return point;
    }

    static unitDistance(dimensions) {
        return Math.sqrt(dimensions);
    }

    static distanceNormalized(p1, p2) {
        return Math.sqrt(Point.distanceSquared(p1, p2)) / Point.unitDistance(p1.length);
    }
}

module.exports = Point;