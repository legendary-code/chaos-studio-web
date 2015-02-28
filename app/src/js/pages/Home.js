var React = require('react'),
    AppBarWithNav = require('../components/AppBarWithNav'),
    mui = require('material-ui'),
    IconButton = mui.IconButton;


var Home = React.createClass({
    render: function() {
        var githubButton = (
            <IconButton
                className="icon-button"
                iconClassName="icon-github4"
                href="https://github.com/eternal0/chaos-studio-web"
                linkButton={true} />
        );

        return (
            <div>
                <AppBarWithNav title="Home">
                    {githubButton}
                </AppBarWithNav>
                <div className="mui-app-content-canvas">
                    <div className="home-page-hero full-width-section">
                        <div className="home-page-hero-content">
                            <div className="tagline">
                                <h1 className="brand-name">Chaos Studio</h1>
                                <h2>An Exploration in the Beauty of Chaos</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = Home;