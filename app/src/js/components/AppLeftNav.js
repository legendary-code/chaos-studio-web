/** @jsx React.DOM */

var React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),

    menuItems = [
        { route: 'home', text: 'Home' },
        { route: 'explore', text: 'Explore' },
        { type: mui.MenuItem.Types.SUBHEADER, text: 'Links' },
        {
            type: mui.MenuItem.Types.LINK,
            payload: 'http://sprott.physics.wisc.edu/sa.htm',
            text: 'Strange Attractors e-book'
        }
    ];

var AppLeftNav = React.createClass({

    mixins: [Router.Navigation, Router.State],

    getInitialState: function() {
        return {
            selectedIndex: null
        };
    },

    render: function() {
        var header = <div onClick={this._onHeaderClick}>Chaos Studio</div>;

        return (
            <mui.LeftNav
                ref="leftNav"
                docked={false}
                isInitiallyOpen={false}
                header={header}
                menuItems={menuItems}
                selectedIndex={this._getSelectedIndex()}
                onChange={this._onLeftNavChange} />
        );
    },

    toggle: function() {
        this.refs.leftNav.toggle();
    },

    _getSelectedIndex: function() {
        var currentItem;

        for (var i = menuItems.length - 1; i >= 0; i--) {
            currentItem = menuItems[i];
            if (currentItem.route && this.isActive(currentItem.route)) return i;
        }
    },

    _onLeftNavChange: function(e, key, payload) {
        this.transitionTo(payload.route);
    },

    _onHeaderClick: function() {
        this.transitionTo('root');
        this.refs.leftNav.close();
    }

});

module.exports = AppLeftNav;