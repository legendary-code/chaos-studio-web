let Point = require('./Point');

class Bounds {
    constructor(dimensions) {
        this._dimensions = dimensions;
        this._min = [];
        this._max = [];

        for (let i = 0; i < this._dimensions; ++i) {
            this._min.push(Infinity);
            this._max.push(-Infinity);
        }
    }

    update(point) {
        for (let i = 0; i < this._dimensions; ++i) {
            if (point[i] < this._min[i])
                this._min[i] = point[i];
            if (point[i] > this._max[i])
                this._max[i] = point[i];
        }
    }

    normalize(point) {
        let normalized = [];
        for (let i=0; i<this._dimensions; ++i) {
            normalized.push((2 * (point[i] - this._min[i]) / (this._max[i] - this._min[i])) - 1);
        }

        return normalized;
    }

    isValid() {
        let extents = this.extents();

        if (!Point.isValid(this._min) || Point.isValid(this._max)) {
            return false;
        }

        for (let i = 0; i < this._dimensions; i++) {
            if (extents[i] <= Bounds.MIN_EXTENT) {
                return false;
            }
        }
    }

    extents() {
        let e = [];

        for (let i=0; i<this._dimensions; ++i) {
            let d = this._max[i] - this._min[i];
            e.push(Math.sqrt(d*d));
        }

        return e;
    }
}

Bounds.MIN_EXTENT = 0.00000001;

module.exports = Bounds;