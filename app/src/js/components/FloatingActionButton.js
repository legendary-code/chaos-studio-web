import React from 'react';
import Icon from '../components/Icon';
import Button from '../components/Button';
import { cx, join } from '../utils/ReactUtils';

export default class FloatingActionButton extends React.Component {
    render() {
        let className = cx({
            "floating-action-button": true,
            "mini": this.props.mini
        });

        className = join(className, this.props.className);

        return (
            <Button
                ref="button"
                className={className}
                onClick={this.props.onClick}
                onContextShow={this.props.onContextShow}
                onContextHide={this.props.onContextHide}
                contextText={this.props.contextText}
                raised={!this.props.flat}>
                <Icon icon={this.props.icon} />
            </Button>
        );
    }

    doRipple(clickEvent) {
        this.refs.button.doRipple(clickEvent);
    }
}

FloatingActionButton.propTypes = {
    mini: React.PropTypes.bool,
    flat: React.PropTypes.bool,
    icon: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    onClick: React.PropTypes.func,
    contextText: React.PropTypes.string,
    onContextShow: React.PropTypes.func,
    onContextHide: React.PropTypes.func
};
