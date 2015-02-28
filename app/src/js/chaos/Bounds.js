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
            (point[0] - this._min[0]) / (this._max[0] - this._min[0]),
            (point[1] - this._min[1]) / (this._max[1] - this._min[1]),
            (point[2] - this._min[2]) / (this._max[2] - this._min[2])
        ];
    }

    isValid() {
        Point.isValid(this._min) && Point.isValid(this._max);
    }
}

module.exports = Bounds;