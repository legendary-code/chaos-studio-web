let React = require('react'),
    Paper = require('../components/Paper'),
    Slider = require('../components/Slider');

class LogisticGraph extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            r: 1.0,
            x0: 0.11111111,
            iterations: 10
        };
    }

    render() {
        return (
            <div>
                <Paper className="logistic-settings">
                    <div className="component-panel logistic-setting">
                        <label className="font-setting-value-label">R</label>
                        <Slider
                            min={2.0}
                            max={4.0}
                            step={0.001}
                            decimalPlaces={3}
                            value={this.state.r}
                            onValueChanged={this._rValueChanged.bind(this)}
                            className="constant"
                        />
                        <div className="binding-value font-caption-medium">{this.state.r.toFixed(3)}</div>
                    </div>
                    <div className="component-panel logistic-setting">
                        <label className="font-setting-value-label" dangerouslySetInnerHTML={{__html: 'X<sub>0</sub>'}} />
                        <Slider
                            min={0.0}
                            max={1.0}
                            step={0.00000001}
                            decimalPlaces={8}
                            value={this.state.x0}
                            onValueChanged={this._x0ValueChanged.bind(this)}
                            className="initial-value"
                        />
                        <div className="binding-value font-caption-medium">{this.state.x0.toFixed(8)}</div>
                    </div>
                    <div className="component-panel logistic-setting">
                        <label className="font-setting-value-label">Iterations</label>
                        <Slider
                            min={1}
                            max={500}
                            step={1}
                            integral={true}
                            value={this.state.iterations}
                            onValueChanged={this._iterationsValueChanged.bind(this)}
                            className="iterations"
                        />
                        <div className="binding-value font-caption-medium">{this.state.iterations}</div>
                    </div>
                    <div className="component-panel logistic-setting">
                        <label className="font-setting-value-label"
                               dangerouslySetInnerHTML={{__html: 'X<sub>0</sub> = ' + this.state.x0.toFixed(8)}} />
                    </div>
                    <div className="component-panel logistic-setting">
                        <label className="font-setting-value-label"
                               dangerouslySetInnerHTML={{__html: 'X<sub>n+1</sub> = ' + this.state.r.toFixed(3) + ' * X<sub>n</sub> * (1 - X<sub>n</sub>)'}} />
                    </div>
                </Paper>
                {this._renderGraph()}
            </div>
        );
    }

    _renderGraph() {
        const verticalTicks = [];
        const horizontalTicks = [];

        for (let i = 0; i <= 100; ++i) {
            const y = (20 + ((i / 100.0) * 60)) + '%';
            if (i % 10 === 0) {
                verticalTicks.push(
                    <line x1="9.5%" x2="10.5%" y1={y} y2={y} stroke="black"/>
                );

                verticalTicks.push(
                    <text x="8.5%" y={y} alignmentBaseline="middle" textAnchor="middle">{((100 - i) / 100.0).toFixed(1)}</text>
                );
            } else {
                verticalTicks.push(
                    <line x1="9.8%" x2="10.2%" y1={y} y2={y} stroke="black"/>
                );
            }
        }

        let value = this.state.x0;

        for (let i = 1; i <= this.state.iterations; ++i) {
            const x = (10 + ((i / this.state.iterations) * 80)) + '%';
            horizontalTicks.push(
                <line x1={x} x2={x} y1="79.5%" y2="80.5%" stroke="black"/>
            );

            const cy = (20 + ((1.0 - value) * 60.0)) + '%';
            horizontalTicks.push(
                <circle cx={x} cy={cy} r="0.3%" fill="blue" />
            );

            value = this.state.r * value * (1 - value);
        }

        return (
            <svg className="graph">
                <line x1="10%" x2="10%" y1="20%" y2="80%" stroke="black" />
                <text x="6.5%" y="50%"
                      alignmentBaseline="middle" textAnchor="middle">X</text>
                {verticalTicks}

                <line x1="10%" x2="90%" y1="80%" y2="80%" stroke="black" />
                <text x="50%" y="83%" alignmentBaseline="middle" textAnchor="middle">Iteration</text>
                {horizontalTicks}
            </svg>
        );
    }

    _rValueChanged(val) {
        this.setState({r: val});
    }

    _x0ValueChanged(val) {
        this.setState({x0: val});
    }

    _iterationsValueChanged(val) {
        this.setState({iterations: val});
    }
}

LogisticGraph.pageName = "Logistic Equation";

module.exports = LogisticGraph;