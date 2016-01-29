import _ from 'underscore';
import Time from './Time';

/* Implements 2-axis inertial rotation */
export default class Rotation {
    constructor() {
        this.reset();
    }

    reset() {
        this._x = 0;
        this._y = 0;
        this._dx = 0.005;
        this._dy = 0;
        this._dragging = false;
    }

    get x() { return this._x; }
    get y() { return this._y; }

    startDrag(x, y) {
        this._sx = x;
        this._sy = y;
        this._px = this._x;
        this._py = this._y;
        this._dragging = true;
        this._mx = 0;
        this._my = 0;
        this._points = [];
        this._dx = 0;
        this._dy = 0;
    }

    drag(x, y) {
        if(!this._dragging) {
            return false;
        }

        this._x = this._px + ((x - this._sx) / 100);
        this._y = this._py + ((y - this._sy) / 100);

        let t = Time.now();
        this._points = _.filter(this._points, (p) => { return t - p.t < 100; });
        this._points.push({x: x, y: y, t: t});
        return true;
    }

    stopDrag() {
        if (!this._dragging) {
            return false;
        }

        this._dragging = false;

        // compute average slope
        let sx = 0;
        let sy = 0;

        for (let i=0; i<this._points.length-1; i++) {
            let p1 = this._points[i];
            let p2 = this._points[i+1];
            let dt = (p2.t - p1.t);
            let dx = (p2.x - p1.x) / dt;
            let dy = (p2.y - p1.y) / dt;
            sx += dx;
            sy += dy;
        }

        this._mx = sx / (this._points.length - 1) / 20;
        this._my = sy / (this._points.length - 1) / 20;

        if (this._mx > 0.001 || this._my > 0.001) {
            this._dx = this._mx;
            this._dy = this._my;
        }

        return true;
    }

    update() {
        this._x += this._dx;
        this._y += this._dy;

        return this._dx > 0 || this._dy > 0;
    }
}
