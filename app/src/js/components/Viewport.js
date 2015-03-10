let React = require('react'),
    THREE = require('three'),
    cx = require('react-addons').classSet;

let Viewport = React.createClass({
    getInitialState: function() {
        return { searching: false };
    },

    render: function() {
        let progressClassName = cx({
            "search-progress-container": true,
            "hidden": !this.state.searching
        });

        return (
            <div className="viewport" ref="viewport">
                <div className={progressClassName}>
                    <img src="./svg/lorentz.svg" />
                </div>
            </div>
        )
    },

    handleResize: function() {
        var viewport = this.refs.viewport.getDOMNode();
        var width = viewport.clientWidth;
        var height = viewport.clientHeight;
        var renderer = this.state.renderer;

        renderer.setSize(width, height);

        this.setState({renderer: renderer});
    },

    componentDidMount: function() {
        var viewport = this.refs.viewport.getDOMNode();
        var width = viewport.clientWidth;
        var height = viewport.clientHeight;

        var camera = new THREE.OrthographicCamera(-1.5, 1.5, -1.5, 1.5, 0.0001, 1000);
        var scene = new THREE.Scene();
        var renderer = new THREE.WebGLRenderer({alpha: true});

        camera.position.z = 2;
        renderer.setSize(width, height);
        renderer.setClearColor(0xe0e0e0, 1);
        viewport.appendChild(renderer.domElement);

        this.setState({ camera: camera, renderer: renderer, scene: scene });
        window.addEventListener('resize', this.handleResize);

        this.animate();
    },
    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
        cancelAnimationFrame(this.animate);
    },
    animate: function() {
        requestAnimationFrame(this.animate);
        this.renderScene();
    },
    renderScene: function() {
        var camera = this.state.camera;
        var scene = this.state.scene;
        var renderer = this.state.renderer;
        var cloud = this.state.cloud;

        if (cloud) {
            cloud.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
    },
    normalize: function(value) {
        return (value * 2.0) - 1.0;
    },

    setRenderData: function(points) {
        var prevGeom = this.state.geometry;
        var prevCloud = this.state.cloud;
        var scene = this.state.scene;

        if (prevGeom) {
            scene.remove(prevCloud);
            prevGeom.dispose();
        }

        var geometry = new THREE.Geometry();
        geometry.vertices = points.map(function(point) {
            return new THREE.Vector3(
                this.normalize(point[0]),
                this.normalize(point[1]),
                this.normalize(point[2])
            );
        }.bind(this));

        var material = new THREE.PointCloudMaterial({
            color: 0x444444,
            size: 0.005,
            opacity: 0.1,
            //blending: THREE.SubtractiveBlending,
            blendEquation: THREE.SubtractEquation,
            transparent: true
        });

        var cloud = new THREE.PointCloud(geometry, material);
        cloud.position.x = 0;
        cloud.position.y = 0;
        cloud.position.z = 0;

        scene.add(cloud);

        this.setState({geometry: geometry, cloud: cloud, scene: scene});
    },

    getViewportSize() {
        var viewport = this.refs.viewport.getDOMNode();
        return { width: viewport.clientWidth, height: viewport.clientHeight };
    },

    showSearching() {
        this.setState({searching: true});
    },

    hideSearching() {
        this.setState({searching: false});
    }
});

module.exports = Viewport;