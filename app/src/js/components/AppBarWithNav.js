var React = require('react'),
    mui = require('material-ui'),
    AppBar = mui.AppBar,
    AppLeftNav = require('./AppLeftNav');

var AppBarWithNav = React.createClass({
    render: function() {
        return (
            <div>
                <AppBar
                    className="mui-dark-theme"
                    onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap}
                    title={this.props.title}
                    zDepth={0}>
                    {this.props.children}
                </AppBar>

                <AppLeftNav ref="leftNav" />
            </div>
        );
    },
    _onMenuIconButtonTouchTap: function() {
        this.refs.leftNav.toggle();
    }
});

module.exports = AppBarWithNav;