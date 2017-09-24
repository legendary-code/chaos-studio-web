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
    RouterStore = require('../stores/RouterStore'),
    SettingsDialog = require('../components/SettingsDialog'),
    Cookies = require('js-cookie'),
    GA = require('../utils/GoogleAnalytics');

class Explore extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showIntro: !Cookies.get('hideIntro'),
            searching: false,
            currentSnapshotId: null
        };

        this.finder = new AttractorFinder(
            (e) => { this.refs.viewport.updateStatus(e); },
            this._attractorGenerated.bind(this),
            this._searchCancelled.bind(this)
        )
    }

    componentWillUnmount() {
        this.finder.cancel();
    }

    render() {
        let introClassName = cx({
            'intro-paper': true,
            'hidden': !this.state.showIntro
        });

        let searchButtonClassName = cx({
            'search-button': true,
            'cancel': this.state.searching
        });

        let contextLabelClassName = cx({
            'context-label': true,
            'font-caption': true,
            'translate': !this.state.showIntro
        });

        let bottomPaperClassName = cx({
            'bottom-paper': true,
            'translate': !this.state.showIntro
        });

        return (
            <div>
                <Paper className={introClassName} ref="introPaper">
                    <h4>Click to start!</h4>
                    <FloatingActionButton
                        className="search-button"
                        icon="icon-search-light"
                        onClick={this._search.bind(this)}
                    />
                </Paper>

                <Viewport ref="viewport" />

                <Paper className={bottomPaperClassName} ref="bottomPaper">
                    <FloatingActionButton
                        className={searchButtonClassName}
                        icon="icon-search-light"
                        ref="searchButton"
                        onClick={this.state.searching ? this._cancelSearch.bind(this) : this._search.bind(this)}
                        onContextShow={this._showContextText.bind(this)}
                        onContextHide={this._hideContextText.bind(this)}
                        contextText="Search"
                    />

                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-settings-light"
                        mini
                        onClick={this._showSettings.bind(this)}
                        onContextShow={this._showContextText.bind(this)}
                        onContextHide={this._hideContextText.bind(this)}
                        contextText="Settings"
                    />

                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-screenshot"
                        onClick={this._saveImage.bind(this)}
                        onContextShow={this._showContextText.bind(this)}
                        onContextHide={this._hideContextText.bind(this)}
                        contextText="Save as Image"
                        mini
                    />

                    <a
                        id="imageDataLink"
                        target="_blank"
                        href=""
                        download="attractor.png"
                        style={{display: "none"}}>
                    </a>

                </Paper>

                <label ref="contextLabel" className={contextLabelClassName} />
            </div>
        );
    }

    _showSettings() {
        Actions.SHOW_MODAL.invoke(
            <SettingsDialog component={SearchConfigurationStore.configuration}
                            onClose={this._closeSettings.bind(this)}
                            defaultSettingsFactory={SearchConfigurationStore.createDefaultConfiguration}
            />
        );
    }

    _closeSettings(configuration) {
        Actions.SAVE_SEARCH_CONFIGURATION.invoke(configuration);
    }

    _cancelSearch() {
        GA.event("search", "cancel").send();
        this.refs.viewport.hideSearching();
        this.finder.cancel();
    }

    _search() {
        GA.event("search", "start").send();
        Actions.TRANSITION_TO.invoke("explore");

        if (this.state.showIntro) {
            this._hideIntro();
            this._startSearch();
            return;
        }

        this.refs.viewport.showSearching();
        let config = SearchConfigurationStore.state.configuration;
        let viewport = this.refs.viewport.getViewport();

        this.setState({searching: true});
        this.finder.start(config, viewport);
    }

    _attractorGenerated(data) {
        GA.event("search", "finished").send();
        let snapshotId = data.snapshot;
        let link = "#/explore/" + snapshotId;
        this.refs.viewport.hideSearching();
        this.refs.viewport.setRenderData(data.values);
        this.refs.viewport.setStats(data.stats);
        window.history.pushState(null, null, link);
        this.setState({currentSnapshotId: snapshotId, searching: false});
    }

    _searchCancelled() {
        this.setState({searching: false});
    }

    _hideIntro() {
        Cookies.set('hideIntro', true);

        $(React.findDOMNode(this.refs.introPaper)).addClass("fade-out");
        $(React.findDOMNode(this.refs.bottomPaper)).addClass("translate");

        let self = this;

        setTimeout(() => {
            self.setState({showIntro: false});
        }, 500);
    }

    _showContextText(text) {
        $(React.findDOMNode(this.refs.contextLabel)).text(text);
    }

    _hideContextText() {
        $(React.findDOMNode(this.refs.contextLabel)).empty();
    }

    _startSearch() {
        let self = this;

        setTimeout(() => {
            self._search();
        }, 500);
    }

    _saveImage() {
        GA.event("screenshot", "save").send();
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
            if (snapshotId === this.state.currentSnapshotId) {
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
                this._hideIntro();
            }

            GA.event("search", "load").send();

            this.refs.viewport.showSearching();
            let config = SearchConfigurationStore.state.configuration;
            let viewport = this.refs.viewport.getViewport();

            this.setState({
                currentSnapshotId: snapshotId,
                searching: true
            });

            this.finder.start(config, viewport, snapshot);
        }
    }
}

Explore.pageName = "Explore";

module.exports = Explore;