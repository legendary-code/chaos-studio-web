let $ = require('jquery'),
    React = require('react'),
    cx = require('../utils/ReactUtils').cx,
    Paper = require('../components/Paper'),
    FloatingActionButton = require('../components/FloatingActionButton'),
    IconButton = require('../components/IconButton'),
    Viewport = require('../components/Viewport'),
    AttractorFinder = require('../chaos/AttractorFinder'),
    SearchConfigurationStore = require('../stores/SearchConfigurationStore');

class Explore extends React.Component {

    constructor(props) {
        super.constructor(props);

        this.state = {
            showIntro: true,
            showTray: false
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
                    <FloatingActionButton className="mini-button" icon="icon-colorizer" mini/>
                    <FloatingActionButton className="mini-button" icon="icon-renderer" mini/>
                    <FloatingActionButton className="mini-button" icon="icon-rng" mini/>
                    <FloatingActionButton className="mini-button" icon="icon-search-criteria" mini/>
                    <FloatingActionButton className="mini-button" icon="icon-map" mini/>
                </div>

                <Paper className="bottom-paper" ref="bottomPaper">
                    <FloatingActionButton
                        className="mini-button"
                        icon="icon-settings-light"
                        mini
                        onClick={this._toggleTray.bind(this)}
                    />
                    <FloatingActionButton className="mini-button" icon="icon-screenshot" mini/>
                    <FloatingActionButton className="mini-button" icon="icon-link" mini/>
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
        if (this.state.showIntro) {
            this._hideIntro();
            return;
        }

        this.refs.viewport.showSearching();
        let self = this;
        let config = SearchConfigurationStore.state.configuration;
        let viewportSize = this.refs.viewport.getViewportSize();
        config.totalIterations = viewportSize.width * viewportSize.height;

        let finder = new AttractorFinder(
            config,
            () => {},
            (data) => {
                self.refs.viewport.hideSearching();
                self.refs.viewport.setRenderData(data);
            }
        );

        finder.find();
    }

    _hideIntro() {
        let self = this;

        $(React.findDOMNode(this.refs.introPaper)).addClass("fade-out");
        $(React.findDOMNode(this.refs.searchButton)).addClass("translate");
        $(React.findDOMNode(this.refs.bottomPaper)).addClass("translate");

        setTimeout(() => {
            self.setState({showIntro: false});
            self._search();
        }, 500);
    }
}

Explore.pageName = "Explore";

module.exports = Explore;