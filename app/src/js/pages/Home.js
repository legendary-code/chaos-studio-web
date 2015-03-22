let React = require('react'),
    Paper = require('../components/Paper');

class Home extends React.Component {
    render() {
        return (
            <Paper className="contents-paper">
                <h2>Coming soon!</h2>
            </Paper>
        );
    }
}

Home.pageName = "Home";

module.exports = Home;