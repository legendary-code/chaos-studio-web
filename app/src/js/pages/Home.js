let React = require('react'),
    ScrollableContents = require('../components/ScrollableContents'),
    Paper = require('../components/Paper'),
    Markdown = require('../components/Markdown');

class Home extends React.Component {
    render() {
        return (
            <ScrollableContents>
                <Paper className="contents-paper">
                    <Markdown src="/markdown/pages/Home.html">
                    </Markdown>
                </Paper>
            </ScrollableContents>
        );
    }
}

Home.pageName = "Home";

module.exports = Home;
