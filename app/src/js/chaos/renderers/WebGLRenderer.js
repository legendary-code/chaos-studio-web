let Renderer = require('../Renderer'),
    Three = require('three');

class WebGLRenderer extends Renderer {
    static get displayName() { return "WebGL Renderer"; }

    static checkSupported() {
        try {
            var canvas = document.createElement( 'canvas' );
            return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    }

    create(width, height) {
        this._camera = new Three.OrthographicCamera(-1.5, 1.5, -1.5, 1.5, 0.0001, 1000);
        this._scene = new Three.Scene();
        this._renderer = new Three.WebGLRenderer({alpha: true, preserveDrawingBuffer: true });

        this._camera.position.z = 2;
        this._renderer.setSize(width, height);
        this._renderer.setClearColor(0xe0e0e0, 1);
        return this._renderer.domElement;
    }

    setRenderData(points) {
        if (this._geometry) {
            this._scene.remove(this._cloud);
            this._geometry.dispose();
        }

        this._geometry = new Three.Geometry();
        this._geometry.vertices = points.map(function(point) {
            return new Three.Vector3(point[0], point[1], point[2]);
        });

        var material = new Three.PointCloudMaterial({
            color: 0x444444,
            size: 0.005,
            opacity: 0.1,
            blendEquation: Three.SubtractEquation,
            transparent: true
        });

        this._cloud = new Three.PointCloud(this._geometry, material);
        this._cloud.position.x = 0;
        this._cloud.position.y = 0;
        this._cloud.position.z = 0;

        this._scene.add(this._cloud);
    }

    destroy() {
        if (this._geometry) {
            this._scene.remove(this._cloud);
            this._geometry.dispose();
        }
    }

    resize(width, height) {
        this._renderer.setSize(width, height);
    }

    render(rotationX, rotationY) {
        if (this._cloud) {
            this._cloud.rotation.x = rotationY;
            this._cloud.rotation.y = -rotationX;
            this._renderer.render(this._scene, this._camera);
        }
    }
}

module.exports = WebGLRenderer;