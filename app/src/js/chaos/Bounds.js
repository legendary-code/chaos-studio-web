import Point from './Point';

export default class Bounds {
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
        let extents = this.extents();
        return Point.isValid(this._min) &&
               Point.isValid(this._max) &&
               extents[0] > Bounds.MIN_EXTENT &&
               extents[1] > Bounds.MIN_EXTENT &&
               extents[2] > Bounds.MIN_EXTENT;
    }

    extents() {
        let d = [ this._max[0] - this._min[0], this._max[1] - this._min[1], this._max[2] - this._min[2] ];
        return [ Math.sqrt(d[0] * d[0]), Math.sqrt(d[1] * d[1]), Math.sqrt(d[2] * d[2]) ]
    }
}

Bounds.MIN_EXTENT = 0.00000001;
