/* Defines a single point */
class Point {
    static isValid(point) {
        var sum = point[0] + point[1] + point[2];
        return !isNaN(sum) && isFinite(sum);
    }
}

module.exports = Point;