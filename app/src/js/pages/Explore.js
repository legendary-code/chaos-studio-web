let $ = require('jquery'),
    React = require('react'),
    cx = require('../utils/ReactUtils').cx,
    Paper = require('../components/Paper'),
    FloatingActionButton = require('../components/FloatingActionButton'),
    IconButton = require('../components/IconButton'),
    Viewport = require('../components/Viewport'),
    Actions = require('../actions/Actions'),
    AttractorFinder = require('../chaos/AttractorFinder'),
    AttractorSnapshot = require('../chaos/AttractorSnapshot'),
    SearchConfigurationStore = require('../stores/SearchConfigurationStore'),
    RouterStore = require('../stores/RouterStore');

class Explore extends React.Component {

    constructor(props) {
        super.constructor(props);

        this.state = {
            showIntro: true,
            showTray: false,
            currentSnapshotId: null
        };
    }

    render() {
        let introClassName = cx({
            "intro-paper": true,
            "hidden": !this.state.showIntro
        });

        let searchButtonClassName = cx({
            "search-button": true,
            "animated": this.state.showIntro,
            "translate": !this.state.showIntro
        });

        let trayClassName = cx({
            "settings-buttons-tray": true,
            "open": this.state.showTray,
            "closed": !this.state.showTray
        });

        return (
            <div>
                <Paper className={introClassName} ref="introPaper">
                    <h4>Look at all this empty space!</h4>
                    <span className="font-caption">Let's generate your very own unique attractor!</span>
                </Paper>

                <Viewport ref="viewport" />

                <div className={trayClassName} >
                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-renderer"
                        mini
                    />

                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-colorizer"
                        mini
                    />

                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-colorizer"
                        mini
                    />

                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-rng"
                        mini
                    />

                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-search-criteria"
                        mini
                    />

                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-map"
                        mini
                    />
                </div>

                <Paper className="bottom-paper" ref="bottomPaper">
                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-settings-light"
                        mini
                        onClick={this._toggleTray.bind(this)}
                    />
                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-screenshot"
                        onClick={this._saveImage.bind(this)}
                        mini />

                    <a
                        id="imageDataLink"
                        target="_blank"
                        href=""
                        download="attractor.png"
                        style={{display: "none"}}>
                    </a>
                </Paper>

                <FloatingActionButton
                    className={searchButtonClassName}
                    icon="icon-search light"
                    ref="searchButton"
                    onClick={this._search.bind(this)}
                />
            </div>
        );
    }

    _toggleTray() {
        this.setState({showTray: !this.state.showTray});
    }

    _search() {
        Actions.TRANSITION_TO.invoke("explore");

        if (this.state.showIntro) {
            this._hideIntro();
            this._startSearch();
            return;
        }

        this.refs.viewport.showSearching();
        let config = SearchConfigurationStore.state.configuration;
        let viewportSize = this.refs.viewport.getViewportSize();
        config.totalIterations = viewportSize.width * viewportSize.height;

        let finder = new AttractorFinder(
            config,
            (e) => { console.log(e); },
            this._attractorGenerated.bind(this)
        );

        finder.find();
    }

    _attractorGenerated(data) {
        let snapshotId = data.snapshot.encode();
        let link = "#/explore/" + snapshotId;
        this.refs.viewport.hideSearching();
        this.refs.viewport.setRenderData(data.values);
        window.history.pushState(null, null, link);
        this.setState({currentSnapshotId: snapshotId});
    }

    _hideIntro() {
        $(React.findDOMNode(this.refs.introPaper)).addClass("fade-out");
        $(React.findDOMNode(this.refs.searchButton)).addClass("translate");
        $(React.findDOMNode(this.refs.bottomPaper)).addClass("translate");

        let self = this;

        setTimeout(() => {
            self.setState({showIntro: false});
        }, 500);
    }

    _startSearch() {
        let self = this;

        setTimeout(() => {
            self._search();
        }, 500);
    }

    _saveImage() {
        let canvas = this.refs.viewport.getCanvas();

        if (!canvas) {
            return;
        }

        let imageData = canvas.toDataURL("image/png").replace("image/png", "application/octet-stream");
        $("#imageDataLink").prop("href", imageData)[0].click();
    }

    componentDidUpdate() {
        requestAnimationFrame(this._checkRouteParams.bind(this));
    }

    componentDidMount() {
        requestAnimationFrame(this._checkRouteParams.bind(this));
    }

    _checkRouteParams() {
        let routeParams = RouterStore.getCurrentParams();

        if (routeParams.hasOwnProperty("snapshotId")) {
            let snapshotId = routeParams.snapshotId;

            // are we still looking at the same attractor?
            if (snapshotId == this.state.currentSnapshotId) {
                return;
            }

            let snapshot = AttractorSnapshot.decode(snapshotId);

            if (!snapshot.map) {
                console.log("Could not find map");
                return;
            }

            if (!snapshot.rng) {
                console.log("Could not find rng");
                return;
            }

            if (this.state.showIntro) {
                console.log("!");
                this._hideIntro();
            }

            this.refs.viewport.showSearching();

            let config = SearchConfigurationStore.state.configuration;
            let viewportSize = this.refs.viewport.getViewportSize();
            config.totalIterations = viewportSize.width * viewportSize.height;

            let generator = new AttractorFinder(
                snapshot,
                config,
                () => {},
                this._attractorGenerated.bind(this)
            );

            generator.find();
        }
    }
}

Explore.pageName = "Explore";

module.exports = Explore;