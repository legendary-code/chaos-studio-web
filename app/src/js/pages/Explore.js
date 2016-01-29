import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';
import { cx } from '../utils/ReactUtils';
import Paper from '../components/Paper';
import FloatingActionButton from '../components/FloatingActionButton';
import IconButton from '../components/IconButton';
import Viewport from '../components/Viewport';
import Actions from '../actions/Actions';
import AttractorFinder from '../chaos/AttractorFinder';
import AttractorSnapshot from '../chaos/AttractorSnapshot';
import SearchConfigurationStore from '../stores/SearchConfigurationStore';
import SettingsDialog from '../components/SettingsDialog';

class Explore extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            showIntro: true,
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

        let contextLabelClassName = cx({
            "context-label": true,
            "font-caption": true,
            "translate": !this.state.showIntro
        });

        return (
            <div>
                <Paper className={introClassName} ref="introPaper">
                    <h4>Look at all this empty space!</h4>
                    <span className="font-caption">Let's generate your very own unique attractor!</span>
                </Paper>

                <Viewport ref="viewport" />

                <Paper className="bottom-paper" ref="bottomPaper">
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

                <FloatingActionButton
                    className={searchButtonClassName}
                    icon="icon-search-light"
                    ref="searchButton"
                    onClick={this._search.bind(this)}
                    onContextShow={this._showContextText.bind(this)}
                    onContextHide={this._hideContextText.bind(this)}
                    contextText="Search"
                />

                <label ref="contextLabel" className={contextLabelClassName} />
            </div>
        );
    }

    _showSettings() {
        Actions.SHOW_MODAL.invoke(<SettingsDialog component={SearchConfigurationStore.configuration} />);
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
        $(ReactDOM.findDOMNode(this.refs.introPaper)).addClass("fade-out");
        $(ReactDOM.findDOMNode(this.refs.searchButton)).addClass("translate");
        $(ReactDOM.findDOMNode(this.refs.bottomPaper)).addClass("translate");

        let self = this;

        setTimeout(() => {
            self.setState({showIntro: false});
        }, 500);
    }

    _showContextText(text) {
        $(ReactDOM.findDOMNode(this.refs.contextLabel)).text(text);
    }

    _hideContextText() {
        $(ReactDOM.findDOMNode(this.refs.contextLabel)).empty();
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
        let routeParams = {};//RouterStore.getCurrentParams();

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
                config,
                (e) => { console.log(e); },
                this._attractorGenerated.bind(this),
                snapshot
            );

            generator.find();
        }
    }
}

Explore.pageName = "Explore";
export default Explore;