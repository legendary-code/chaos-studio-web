let React = require('react'),
    cx = require('../../utils/ReactUtils').cx,
    Actions = require('../../actions/Actions'),
    Button = require('../Button');

class ComponentPicker extends React.Component {
    render() {
        let self = this;
        let hasSelection = false;

        let list = this.props.types.map((type) => {
            let selected = !hasSelection && (type === self.props.selected);
            hasSelection |= selected;

            let className = cx({
                "choice-button": true,
                "selected": selected
            });

            let callback = () => {
                Actions.CLOSE_TOPMOST_MODAL.invoke();
                self._onValueChanged(type);
            };

            return (
                <Button className={className} onClick={callback}>
                    <label className="font-caption-medium">{type.displayName}</label>
                </Button>
            );
        });

        return (
            <div className="choice-picker">
                {list}
            </div>
        );
    }

    _onValueChanged(type) {
        this.props.onValueChanged(type);
    }

    static get propTypes() {
        return {
            onValueChanged: React.PropTypes.func.isRequired,
            selected: React.PropTypes.object,
            types: React.PropTypes.array.isRequired
        };
    }
}

module.exports = ComponentPicker;