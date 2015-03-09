let React = require('react'),
    Paper = require('../components/Paper'),
    FloatingActionButton = require('../components/FloatingActionButton');

let Home = React.createClass({
    render: function() {
        return (
            <Paper container>
                <h2>Coming soon!</h2>
                <FloatingActionButton icon="icon-search light" />
            </Paper>
        );
    }
});

Home.pageName = "Home";

module.exports = Home;