let React = require('react'),
    ScrollableContents = require('../components/ScrollableContents'),
    Paper = require('../components/Paper'),
    Markdown = require('../components/Markdown');

class Links extends React.Component {
    render() {
        return (
            <ScrollableContents>
                <Paper className="contents-paper">
                    <Markdown src="/markdown/pages/Links.md">
                    </Markdown>
                </Paper>
            </ScrollableContents>
        );
    }
}

Links.pageName = "Links";

module.exports = Links;