let React = require('react'),
    Showdown = require('showdown'),
    hljs = require('highlight.js'),
    $ = require('jquery');

class Markdown extends React.Component {
    constructor(props) {
        if (props.src) {
            let self = this;

            // load from src
            $.get(props.src, function(markdown) {
                self.setState({
                    markup: {
                        __html: self._renderMarkdown(markdown)
                    }
                });
            }).error(function(e) {
                self.setState({
                    markup: {
                        __html: self._renderMarkdown('##Failed to load contents! :(\n#####' + e.responseText)
                    }
                });
            });

            this.state = {
                markup: {
                    __html: ''
                }
            };
        } else if (props.children && !Array.isArray(props.children)) {
            // check children
            this.state = {
                markup: {
                    __html: this._renderMarkdown(props.children)
                }
            }
        }
    }

    _renderMarkdown(markdown) {
        let converter = new Showdown.Converter();
        let markup = $($.parseHTML(converter.makeHtml(markdown)));

        // make all non-relative links open in new tab
        markup.find('a').each(function(i, link) {
            if (link.host !== window.location.host) {
                link.target = '_blank';
            }
        });

        // syntax highlight
        markup.find('code.language-js').each(function(i, block) {
            hljs.highlightBlock(block);
        });

        return $('<div>').append(markup).html();
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