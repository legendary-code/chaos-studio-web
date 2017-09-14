let React = require('react'),
    Paper = require('../components/Paper'),
    Slider = require('../components/Slider');

class LogisticGraph extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            r: 2.0,
            x0: 0.11111111,
            iterations: 10
        };
    }

    render() {
        return (
            <div className="logistic-graph">
                <div className="body">
                    <div className="contents">
                        {this._renderGraph()}
                    </div>
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
                                   dangerouslySetInnerHTML={{__html: 'X<sub>n+1</sub> = R * X<sub>n</sub> * (1 - X<sub>n</sub>)'}} />
                        </div>
                        <div className="component-panel logistic-setting">
                            <label className="font-setting-value-label">{'Period: ' + this._calculatePeriod()}</label>
                        </div>
                    </Paper>
                </div>
            </div>
        );
    }

    _calculatePeriod() {
        const settleIterations = 1000000;
        const cycleIterations = 10000;
        let x = this.state.x0;
        let values = {};

        // settle
        for (let i = 0; i < settleIterations; ++i) {
            x = this.state.r * x * (1-x);
        }

        // look for distinct values
        for (let i = 0; i < cycleIterations; ++i) {
            x = this.state.r * x * (1-x);
            const rx = x.toFixed(10);
            if (values.hasOwnProperty(rx)) {
                break;
            }

            values[rx] = true;
        }

        const cycle = Object.keys(values).length;
        return cycle === cycleIterations ? "Infinite" : cycle;
    }

    _renderGraph() {
        const verticalTicks = [];
        const horizontalTicks = [];

        for (let i = 0; i <= 100; ++i) {
            const y = (20 + ((i / 100.0) * 70)) + '%';
            if (i % 10 === 0) {
                verticalTicks.push(
                    <line x1="19.5%" x2="20.5%" y1={y} y2={y} stroke="black"/>
                );

                verticalTicks.push(
                    <text x="20%" y={y}
                          transform="translate(-20, 0)"
                          alignmentBaseline="middle"
                          textAnchor="middle">{((100 - i) / 100.0).toFixed(1)}</text>
                );
            } else {
                verticalTicks.push(
                    <line x1="19.8%" x2="20.2%" y1={y} y2={y} stroke="black"/>
                );
            }
        }

        let value = this.state.x0;

        for (let i = 1; i <= this.state.iterations; ++i) {
            const x = (20 + ((i / this.state.iterations) * 60)) + '%';
            horizontalTicks.push(
                <line x1={x} x2={x} y1="89.5%" y2="90.5%" stroke="black"/>
            );

            const cy = (20 + ((1.0 - value) * 70.0)) + '%';
            horizontalTicks.push(
                <circle cx={x} cy={cy} r="0.3%" fill="blue" />
            );

            value = this.state.r * value * (1 - value);
        }

        return (
            <svg className="graph">
                <line x1="20%" x2="20%" y1="20%" y2="90%" stroke="black" />
                <text x="20%" y="55%"
                      transform="translate(-55, 0)"
                      alignmentBaseline="middle" textAnchor="middle">X</text>
                {verticalTicks}

                <line x1="20%" x2="80%" y1="90%" y2="90%" stroke="black" />
                <text x="50%" y="90%"
                      transform="translate(0,20)"
                      alignmentBaseline="middle" textAnchor="middle">Iteration</text>
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