let $ = require('jquery'),
    React = require('react'),
    cx = require('react-addons').classSet,
    Paper = require('../components/Paper'),
    FloatingActionButton = require('../components/FloatingActionButton'),
    Viewport = require('../components/Viewport'),
    AttractorFinder = require('../chaos/AttractorFinder'),
    SearchConfigurationStore = require('../stores/SearchConfigurationStore');

let Explore = React.createClass({

    getInitialState() {
        return {
            showIntro: true
        }
    },

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

        return (
            <div>
                <Paper className={introClassName} ref="introPaper">
                    <h4>Look at all this empty space!</h4>
                    <span className="font-caption">Let's generate your very own unique attractor!</span>
                </Paper>

                <Viewport ref="viewport" />

                <Paper className="bottom-paper" ref="bottomPaper">
                </Paper>

                <FloatingActionButton
                    className={searchButtonClassName}
                    icon="icon-search light"
                    ref="searchButton"
                    onClick={this._search}
                />
            </div>
        );
    },

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
    },

    _hideIntro() {
        let self = this;

        $(this.refs.introPaper.getDOMNode()).addClass("fade-out");
        $(this.refs.searchButton.getDOMNode()).addClass("translate");
        $(this.refs.bottomPaper.getDOMNode()).addClass("translate");

        setTimeout(() => {
            self.setState({showIntro: false});
            self._search();
        }, 500);
    }
});

Explore.pageName = "Explore";

module.exports = Explore;