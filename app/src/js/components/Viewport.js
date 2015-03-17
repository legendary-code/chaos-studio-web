let React = require('react'),
    THREE = require('three'),
    ConfigurationStore = require('../stores/SearchConfigurationStore'),
    Rotation = require('../chaos/Rotation'),
    cx = require('react-addons').classSet;

/* Given a renderer, this component renders strange attractors, handles user input
* for rotating attractors, and animates rotating attractors, redrawing only
* when necessary */

let Viewport = React.createClass({
    getInitialState: function() {
        return { searching: false, rotation: new Rotation() };
    },

    render: function() {
        let progressClassName = cx({
            "search-progress-container": true,
            "hidden": !this.state.searching
        });

        return (
            <div
                className="viewport"
                ref="viewport"
                onMouseDown={this._dragStart}
                onMouseUp={this._dragStop}
                onMouseOut={this._dragStop}
                onMouseMove={this._drag}
                onTouchStart={this._dragStart}
                onTouchEnd={this._dragStop}
                onTouchCancel={this._dragStop}
                onTouchLeave={this._dragStop}
                onTouchMove={this._drag}>
                <div className={progressClassName}>
                    <img src="./svg/lorenz.svg" />
                </div>
            </div>
        )
    },

    _dragStart(e) {
        let [screenX, screenY] = this._coords(e);

        this.state.rotation.startDrag(screenX, screenY);
        this._stopAnimation();
    },

    _dragStop(e) {
        let [screenX, screenY] = this._coords(e);

        if (this.state.rotation.stopDrag(screenX, screenY)) {
            this._startAnimation();
        }
    },

    _drag(e) {
        let [screenX, screenY] = this._coords(e);

        if (this.state.rotation.drag(screenX, screenY)) {
            this.renderScene();
        }
    },

    _coords(e) {
        if (e.screenX && e.screenY) {
            return [e.screenX, e.screenY];
        }

        if (e.touches) {
            return [e.touches[0].screenX, e.touches[0].screenY];
        }

        return [0,0];
    },

    handleResize: function() {
        var viewport = this.refs.viewport.getDOMNode();
        var width = viewport.clientWidth;
        var height = viewport.clientHeight;
        var renderer = this.state.renderer;

        if (renderer) {
            renderer.resize(width, height);
            this.renderScene();
        }
    },

    componentDidMount: function() {
        let viewport = this.refs.viewport.getDOMNode();
        let width = viewport.clientWidth;
        let height = viewport.clientHeight;
        let renderer = ConfigurationStore.state.configuration.renderer;
        let surface = renderer.create(width, height);

        viewport.appendChild(surface);

        this.setState({ renderer: renderer });
        window.addEventListener('resize', this.handleResize);
        this._startAnimation();
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
        this.state.renderer.destroy();
    },

    _startAnimation() {
        this._animate();
    },

    _stopAnimation() {
        cancelAnimationFrame(this._animate);
    },

    _animate: function() {
        if (this.renderScene()) {
            // only continue rendering if the scene is changing (i.e. rotation)
            requestAnimationFrame(this._animate);
        }
    },

    renderScene: function() {
        let renderer = this.state.renderer;
        let rotation = this.state.rotation;

        let changed = rotation.update();

        // TODO: Figure out why this is called before renderer is created
        if (renderer) {
            renderer.render(rotation.x, rotation.y);
        }

        return changed;
    },

    setRenderData(points) {
        this.state.renderer.setRenderData(points);
        this.state.rotation.reset();
        this._startAnimation();
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