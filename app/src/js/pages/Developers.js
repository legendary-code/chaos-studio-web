let React = require('react'),
    Paper = require('../components/Paper'),
    ScrollableContents = require('../components/ScrollableContents'),
    Markdown = require('../components/Markdown');

class Developers extends React.Component {
    render() {
        return <ScrollableContents>
            <div>
                <Paper className="contents-paper">
                    <Markdown src="/markdown/pages/Developers.html">
                    </Markdown>
                </Paper>
            </div>
        </ScrollableContents>;
    }
}

Developers.pageName = "Developers";

module.exports = Developers;