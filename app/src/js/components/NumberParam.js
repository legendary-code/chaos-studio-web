var React = require('react'),
    mui = require('material-ui'),
    Slider = mui.Slider;

var NumberParam = React.createClass({
    getInitialState() {
        return { value: this.props.component[this.props.name] || 0 };
    },
    render() {
        let param = this.props.type;

        return (
            <div className="param-control">
                <div className="param-label-group">
                    <label className="param-description-label">
                        {param.label}
                    </label>
                    <label className="param-value-label">
                        Value: {this.state.value.toFixed(param.decimals)}
                    </label>
                </div>
                <Slider
                    defaultValue={this.state.value}
                    min={param.min}
                    max={param.max}
                    onChange={this._onChange} />
            </div>
        );
    },
    _onChange(e, value) {
        this.props.component[this.props.name] = value;
        this.setState({value: value});
    }
});

module.exports = NumberParam;