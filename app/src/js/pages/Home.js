let React = require('react'),
    Paper = require('../components/Paper');

let Home = React.createClass({
    render: function() {
        return (
            <Paper className="contents-paper">
                <h2>Coming soon!</h2>
            </Paper>
        );
    }
});

Home.pageName = "Home";

module.exports = Home;