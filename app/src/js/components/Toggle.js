import React from 'react';
import { cx } from '../utils/ReactUtils';
import Button from './Button';
import Paper from './Paper';

export default class Toggle extends React.Component {
    constructor(props) {
        super(props);
        this.state = { toggled: !!this.props.toggled };
    }

    render() {

        let trackClass = cx({
            "track": true,
            "toggled": this.state.toggled
        });

        let thumbClass = cx({
            "thumb": true,
            "toggled": this.state.toggled
        });

        return (
            <Button className="toggle" onClick={this._toggle.bind(this)} disabled={this.props.disabled} noOverlay>
                <div className={trackClass}>
                </div>
                <Paper className={thumbClass} />
            </Button>
        );
    }

    _toggle() {
        if (!!this.props.disabled) {
            return;
        }

        let newValue = !this.state.toggled;

        if (this.props.onValueChanged) {
            this.props.onValueChanged(newValue)
        }

        this.setState({toggled: newValue});
    }
}

Toggle.propTypes = {
    "toggled": React.PropTypes.boolean,
    "disabled": React.PropTypes.boolean,
    "onValueChanged": React.PropTypes.func
};
