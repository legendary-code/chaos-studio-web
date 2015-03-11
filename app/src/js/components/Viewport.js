let React = require('react'),
    THREE = require('three'),
    ConfigurationStore = require('../stores/SearchConfigurationStore'),
    cx = require('react-addons').classSet;

let Viewport = React.createClass({
    getInitialState: function() {
        return { searching: false, rotation: 0 };
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

        if (renderer) {
            renderer.resize(width, height);
            this.renderScene();
        }
    },

    componentDidMount: function() {
        var viewport = this.refs.viewport.getDOMNode();
        var width = viewport.clientWidth;
        var height = viewport.clientHeight;
        var renderer = ConfigurationStore.state.configuration.renderer;
        var surface = renderer.create(width, height);

        viewport.appendChild(surface);

        this.setState({ renderer: renderer });
        window.addEventListener('resize', this.handleResize);
        this.animate();
    },

    componentWillUnmount: function() {
        window.removeEventListener('resize', this.handleResize);
        cancelAnimationFrame(this.animate);
        this.state.renderer.destroy();
    },

    animate: function() {
        requestAnimationFrame(this.animate);
        this.renderScene();
    },

    renderScene: function() {
        var renderer = this.state.renderer;
        this.state.rotation += 0.005;

        // TODO: Figure out why this is called before renderer is created
        if (renderer) {
            renderer.render(0, this.state.rotation);
        }
    },

    setRenderData(points) {
        this.state.renderer.setRenderData(points);
        this.renderScene();
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