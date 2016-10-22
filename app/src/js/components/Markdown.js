let React = require('react'),
    $ = require('jquery');

/* Embeds pre-rendered markdown content */
class Markdown extends React.Component {
    constructor(props) {
        if (props.src) {
            let self = this;

            // load from src
            $.get(props.src, function(html) {
                self.setState({
                    markup: {
                        __html: html
                    }
                });
            }).error(function(e) {
                self.setState({
                    markup: {
                        __html: '##Failed to load contents! :(\n#####' + e.responseText
                    }
                });
            });

            this.state = {
                markup: {
                    __html: ''
                }
            };
        }
    }

    render() {
        return (
            <div className="markdown" dangerouslySetInnerHTML={this.state.markup}>
            </div>
        );
    }
}

Markdown.propTypes = {
    src: React.PropTypes.string
};

module.exports = Markdown;