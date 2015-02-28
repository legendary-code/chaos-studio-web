var React = require('react'),
    Viewport = require('./Viewport'),
    Menu = require('./Menu'),
    Configuration = require('../chaos/Configuration'),
    AttractorFinder = require('../chaos/AttractorFinder'),
    components = require('../chaos/Components');

var App = React.createClass({
    search: function() {
        console.log(components);
        var config = new Configuration(components.maps[0], components.rngs[0], components.criteria);
        var finder = new AttractorFinder(
            config,
            function(msg) {
                console.log(msg);
            },
            function(points){
                console.log("Found attractor");
                this.refs.viewport.setRenderData(points);
            }.bind(this)
        );

        finder.find();
    },

    render: function() {
        return (
            <div>
                <div className="title">Chaos Studio - The Art and Beauty of Chaos</div>
                <hr className="divider" />
                <Viewport ref="viewport" />
                <Menu />
                <input type="button" onClick={this.search}>Search</input>
            </div>
        );
    }
});

module.exports = App;