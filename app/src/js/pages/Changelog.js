let React = require('react'),
    ScrollableContents = require('../components/ScrollableContents'),
    Paper = require('../components/Paper'),
    Markdown = require('../components/Markdown');

class Changelog extends React.Component {
    render() {
        return (
            <ScrollableContents>
                <Paper className="contents-paper">
                    <Markdown src="/markdown/pages/Changelog.html">
                    </Markdown>
                </Paper>
            </ScrollableContents>
        );
    }
}

Changelog.pageName = "Changelog";

module.exports = Changelog;