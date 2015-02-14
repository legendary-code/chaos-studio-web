/** @jsx React.DOM */
var React = require('react'),
    Viewport = require('./Viewport'),
    Menu = require('./Menu'),
    Configuration = require('./Configuration'),
    AttractorFinder = require('./AttractorFinder'),
    components = require('./Components');

var App = React.createClass({
    search: function() {
        console.log(components);
        var config = new Configuration(new components.maps[0], new components.rngs[0], components.criteria);
        var finder = new AttractorFinder(config, function(msg) { console.log(msg); }, function(values){ console.log("completed"); });
        finder.find();
    },

    render: function() {
        return (
            <div>
                <div className="title">Chaos Studio - The Art and Beauty of Chaos</div>
                <hr className="divider" />
                <Viewport />
                <Menu />
                <input type="button" onClick={this.search}>Search</input>
                <div className="modal">
                    <div>herp</div>
                </div>
            </div>
        );
    }
});

module.exports = App;