let Renderer = require('../Renderer'),
    Three = require('three'),
    RenderFilter = require('./webgl/RenderFilter'),
    PencilSketchFilter = require('./webgl/PencilSketchFilter'),
    Components = require('../Components'),
    Props = require('../Props');

class WebGLRenderer extends Renderer {
    static get displayName() { return "WebGL Renderer"; }

    static get description() {
        return "Uses WebGL to render graphics";
    }

    static checkSupported() {
        try {
            var canvas = document.createElement( 'canvas' );
            return !! (window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch(e) {
            return false;
        }
    }

    static get params() {
        return [
            Props.component("renderFilter", "Render Filter", RenderFilter)
        ];
    }

    constructor() {
        this._renderFilter = new PencilSketchFilter();
    }

    get renderFilter() {
        return this._renderFilter;
    }

    set renderFilter(val) {
        this._renderFilter = val;
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

        this._geometry = this._renderFilter.createGeometry(points);
        let material = this._renderFilter.createMaterial();
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

Components.register(Renderer, WebGLRenderer, true);
module.exports = WebGLRenderer;