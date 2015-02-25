/** @jsx React.DOM */
var React = require('react'),
    mui = require('material-ui'),
    Dialog = mui.Dialog,
    FlatButton = mui.FlatButton,
    DropDownMenu = mui.DropDownMenu,
    Tabs = mui.Tabs,
    Tab = mui.Tab,
    Checkbox = mui.Checkbox,
    Slider = mui.Slider,
    Components = require('../chaos/Components');

var SearchDialog = React.createClass({
    getInitialState: function() {
        return {
            lyapunovExponentEnabled: true,
            fractalDimensionEnabled: true,
            lyapunovExponentMin: 0.05,
            fractalDimensionMin: 1.0
        };
    },
    render: function() {
        var mapMenuItems = Components.maps.map(function(TMap) {
            return { payload: new TMap(), text: map.displayName }
        });

        var actions = [
            <FlatButton label="Cancel" secondary={true} />,
            <FlatButton label="Search" primary={true} onClick={this._onSearchClick} />
        ];

        var lyapunovExponentLabelClass = this.state.lyapunovExponentEnabled ? 'value-label' : 'disabled-value-label';
        var fractalDimensionLabelClass = this.state.fractalDimensionEnabled ? 'value-label' : 'disabled-value-label';

        return (
            <Dialog ref="dialog" title="Find Attractor" actions={actions} className="search-dialog">
                <Tabs tabWidth={80}>
                    <Tab label="Basic">
                        <div>
                            <h3>Map</h3>
                            <DropDownMenu ref="mapDropDownMenu" menuItems={mapMenuItems} />
                        </div>
                    </Tab>
                    <Tab label="Advanced">
                        <h3>Search Criteria</h3>
                        <div>
                            <div className="checkbox-label-group">
                                <Checkbox
                                    label="Lyapunov Exponent"
                                    defaultSwitched={true}
                                    onCheck={this._onSwitchLyapunov} />
                                <label className={lyapunovExponentLabelClass}>
                                    Value: {this.state.lyapunovExponentMin.toFixed(2)}
                                </label>
                            </div>
                            <Slider
                                defaultValue={0.05}
                                min={0.0}
                                max={1.0}
                                disabled={!this.state.lyapunovExponentEnabled}
                                onChange={this._onChangeLyapunovExponentMin} />
                        </div>
                        <div>
                            <div className="checkbox-label-group">
                                <Checkbox
                                    label="Fractal Dimension"
                                    defaultSwitched={true}
                                    onCheck={this._onSwitchFractal} />
                                <label className={fractalDimensionLabelClass}>
                                    Value: {this.state.fractalDimensionMin.toFixed(2)}
                                </label>
                            </div>
                            <Slider
                                defaultValue={1.0}
                                min={0.0}
                                max={3.0}
                                disabled={!this.state.fractalDimensionEnabled}
                                onChange={this._onChangeFractalDimensionMin} />
                        </div>
                    </Tab>
                </Tabs>
            </Dialog>
        );
    },
    show() {
        this.refs.dialog.show();
    },
    _onSwitchLyapunov(e, value) {
        this.setState({lyapunovExponentEnabled: value});
    },
    _onSwitchFractal(e, value) {
        this.setState({fractalDimensionEnabled: value});
    },
    _onChangeLyapunovExponentMin(e, value) {
        this.setState({lyapunovExponentMin: value});
    },
    _onChangeFractalDimensionMin(e, value) {
        this.setState({fractalDimensionMin: value});
    },
    _onSearchClick() {
        if(this.props.onSearchClick) {
            let config = {
                map: this.refs.mapDropDownMenu.getValue(),
                criteria: []
            };

            if (this.state.lyapunovExponentEnabled) {
                let criterion = new LyapunovExponent();
                criterion.min = this.state.lyapunovExponentMin;
                //criterion.max = this.state.lyapunovExponentMax;
                config.criteria.push(criterion);
            }

            // TODO: Fractal

            this.props.onSearchClick(config);
        }
    }
});

module.exports = SearchDialog;