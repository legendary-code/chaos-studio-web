var Point = require('./Point');

class Bounds {
    constructor() {
        this._min = [Infinity, Infinity, Infinity];
        this._max = [-Infinity, -Infinity, -Infinity];
    }

    update(point) {
        for (let i = 0; i < 3; i++) {
            if (point[i] < this._min[i])
                this._min[i] = point[i];
            if (point[i] > this._max[i])
                this._max[i] = point[i];
        }
    }

    normalize(point) {
        return [
            (2 * (point[0] - this._min[0]) / (this._max[0] - this._min[0])) - 1,
            (2 * (point[1] - this._min[1]) / (this._max[1] - this._min[1])) - 1,
            (2 * (point[2] - this._min[2]) / (this._max[2] - this._min[2])) - 1
        ];
    }

    isValid() {
        Point.isValid(this._min) && Point.isValid(this._max);
    }
}

module.exports = Bounds;