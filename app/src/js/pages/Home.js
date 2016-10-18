let React = require('react'),
    Paper = require('../components/Paper'),
    Markdown = require('../components/Markdown');

class Home extends React.Component {
    render() {
        return (
            <Paper className="contents-paper">
                <Markdown src="/markdown/pages/Home.md">
                </Markdown>
            </Paper>
        );
    }
}

Home.pageName = "Home";

module.exports = Home;
