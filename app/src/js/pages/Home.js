let React = require('react');

let Home = React.createClass({
    render: function() {
        return (
            <div>
                Home!
            </div>
        );
    }
});

Home.pageName = "Home";

module.exports = Home;