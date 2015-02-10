/** @jsx React.DOM */
var React = require('react'),
    Viewport = require('./Viewport'),
    Menu = require('./Menu');

var App = React.createClass({
    render: function() {
        return (
            <div>
                <div className="title">Chaos Studio - The Art and Beauty of Chaos</div>
                <hr className="divider" />
                <Viewport />
                <Menu />
                <div className="modal">
                    <div>herp</div>
                </div>
            </div>
        );
    }
});

module.exports = App;