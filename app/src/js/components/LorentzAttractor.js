/** @jsx React.DOM */

var React = require('react'),
    d3 = require('d3');

var LorentzAttractor = React.createClass({
    render: function() {
        return (
            <svg width="200" height="200" id="lorentz">
            </svg>
        );
    },

    componentDidMount: function() {
        var sigma = 10.0,
            rho = 28.0,
            beta = 8.0/3.0,
            dt = 0.01,
            x = -7.67090294613221,
            y = -12.260044220192905,
            z = 14.4747731087498,
            t = 1.300000000000001,
            i = 0,
            px,
            py;

        var svg = d3.select("#lorentz");

        px = 100 + (x * 3);
        py = 200 + (-z * 3);

        var path = "M" + px + " " + py;
        var dx, dy, dz;

        for (i = 0; i < 950; i++) {
            dx = sigma*(y-x)*dt;
            dy = (x*(rho - z)-y)*dt;
            dz = (x*y - beta*z)*dt;
            x += dx;
            y += dy;
            z += dz;
            t += dt;

            px = 100 + (x * 3);
            py = 200 + (-z * 3);

            path += " L" + px + " " + py;
        }

        svg
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("stroke-width", "2")
            .attr("fill", "none");
    }
});

module.exports = LorentzAttractor;