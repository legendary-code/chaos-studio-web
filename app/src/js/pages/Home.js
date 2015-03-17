let React = require('react'),
    Paper = require('../components/Paper'),
    IconButton = require('../components/IconButton');

let Home = React.createClass({
    render: function() {
        return (
            <Paper className="contents-paper">
                <h2>Coming soon!</h2>
                <IconButton icon="icon-github" label="GitHub" left/>
            </Paper>
        );
    }
});

Home.pageName = "Home";

module.exports = Home;