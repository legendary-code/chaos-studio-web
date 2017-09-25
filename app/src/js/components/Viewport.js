let React = require('react'),
    ConfigurationStore = require('../stores/SearchConfigurationStore'),
    Rotation = require('../chaos/Rotation'),
    cx = require('../utils/ReactUtils').cx;

/* Given a renderer, this component renders strange attractors, handles user input
* for rotating attractors, and animates rotating attractors, redrawing only
* when necessary */

class Viewport extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            searching: false,
            statusMessage: '',
            rotation: new Rotation()
        };
    }

    render() {
        let progressClassName = cx({
            "search-progress-container": true,
            "hidden": !this.state.searching
        });

        return (
            <div
                className="viewport"
                ref="viewport"
                onMouseDown={this._dragStart.bind(this)}
                onMouseUp={this._dragStop.bind(this)}
                onMouseOut={this._dragStop.bind(this)}
                onMouseMove={this._drag.bind(this)}
                onTouchStart={this._dragStart.bind(this)}
                onTouchEnd={this._dragStop.bind(this)}
                onTouchCancel={this._dragStop.bind(this)}
                onTouchLeave={this._dragStop.bind(this)}
                onTouchMove={this._drag.bind(this)}>
                <label className="attractor-stats font-caption-medium">{this.state.stats}</label>
                <div className={progressClassName}>
                    <img src="./svg/lorenz.svg" />
                    <label className="font-subhead">{this.state.statusMessage}</label>
                </div>
            </div>
        )
    }

    _dragStart(e) {
        let [screenX, screenY] = this._coords(e);

        this.state.rotation.startDrag(screenX, screenY);
        this._stopAnimation();
    }

    _dragStop(e) {
        let [screenX, screenY] = this._coords(e);

        if (this.state.rotation.stopDrag(screenX, screenY)) {
            this._startAnimation();
        }
    }

    _drag(e) {
        let [screenX, screenY] = this._coords(e);

        if (this.state.rotation.drag(screenX, screenY)) {
            this.renderScene();
        }
    }

    _coords(e) {
        if (e.screenX && e.screenY) {
            return [e.screenX, e.screenY];
        }

        if (e.touches && e.touches.hasOwnProperty(0) && e.touches[0].screenX && e.touches[0].screenY) {
            return [e.touches[0].screenX, e.touches[0].screenY];
        }

        return [0,0];
    }

    _handleResize() {
        if (!this.refs.viewport) {
            return;
        }

        const viewport = this.getViewport();
        const renderer = this.state.renderer;

        if (renderer) {
            renderer.resize(viewport);
            this.renderScene();
        }
    }

    componentDidMount() {
        const viewport = this.getViewport();
        let renderer = ConfigurationStore.state.configuration.renderer;
        let surface = renderer.create(viewport);

        React.findDOMNode(this.refs.viewport).appendChild(surface);
        this.setState({ renderer: renderer, surface: surface });

        window.addEventListener('resize', this._handleResize.bind(this));
        this._startAnimation();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._handleResize.bind(this));
        this.state.renderer.destroy();
    }

    _startAnimation() {
        this._animate();
    }

    _stopAnimation() {
        cancelAnimationFrame(this._animate.bind(this));
    }

    _animate() {
        if (this.renderScene()) {
            // only continue rendering if the scene is changing (i.e. rotation)
            requestAnimationFrame(this._animate.bind(this));
        }
    }

    updateStatus(statusMessage) {
        this.setState({statusMessage: statusMessage});
    }

    renderScene() {
        let renderer = this.state.renderer;
        let rotation = this.state.rotation;

        let changed = rotation.update();

        // TODO: Figure out why this is called before renderer is created
        if (renderer) {
            renderer.render(rotation.x, rotation.y);
        }

        return changed;
    }

    setRenderData(points) {
        this.state.renderer.setRenderData(this.getViewport(), points);
        this.state.rotation.reset();
        this._startAnimation();
    }

    setStats(stats) {
        this.setState({stats: stats.join(', ')});
    }

    getViewport() {
        const viewport = React.findDOMNode(this.refs.viewport);
        return {
            width: viewport.clientWidth,
            height: viewport.clientHeight,
            devicePixelRatio: window.devicePixelRatio || 1.0
        };
    }

    showSearching() {
        this.setState({searching: true});
    }

    hideSearching() {
        this.setState({searching: false});
    }

    getCanvas() {
        return this.state.surface;
    }
}

module.exports = Viewport;