let $ = require('jquery'),
    React = require('react'),
    cx = require('react-addons').classSet,
    NavigationDrawerStore = require('../stores/NavigationDrawerStore'),
    Actions = require('../actions/Actions');

let NavDrawer = React.createClass({
    getInitialState() {
        return {
            hidden: NavigationDrawerStore.state.hidden,
            preload: true
        };
    },

    componentDidMount() {
        document.addEventListener("click", this._clickOutside, true);
        NavigationDrawerStore.addListener(this._toggle);
    },

    componentWillUnmount() {
        document.removeEventListener("click", this._clickOutside, true);
        NavigationDrawerStore.removeListener(this._toggle);
    },

    render() {
        let className = cx({
            "nav-drawer": true,
            "hidden": this.state.hidden,
            "preload": this.state.preload
        });

        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    },

    _toggle() {
        this.setState({
                hidden: NavigationDrawerStore.state.hidden,
                preload: false
        });
    },

    _clickOutside(e) {
        if (this.state.hidden) {
            return;
        }

        let drawer = $(this.getDOMNode());
        let target = $(e.target);


        if (drawer.is(target)) {
            return;
        }

        if (drawer.find(target).length) {
            return;
        }

        Actions.HIDE_NAV_DRAWER.invoke();
        console.log("closed");
    }
});

module.exports = NavDrawer;