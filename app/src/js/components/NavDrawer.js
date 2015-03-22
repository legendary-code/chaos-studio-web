let $ = require('jquery'),
    React = require('react'),
    cx = require('../utils/ReactUtils').cx,
    NavigationDrawerStore = require('../stores/NavigationDrawerStore'),
    Actions = require('../actions/Actions');

class NavDrawer extends React.Component {
    constructor(props) {
        super.constructor(props);

        this.state = {
            hidden: NavigationDrawerStore.state.hidden,
            preload: true
        };
    }

    componentDidMount() {
        document.addEventListener("mousedown", this._clickOutside.bind(this));
        NavigationDrawerStore.addListener(this._toggle.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this._clickOutside.bind(this));
        NavigationDrawerStore.removeListener(this._toggle.bind(this));
    }

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
    }

    _toggle() {
        this.setState({
                hidden: NavigationDrawerStore.state.hidden,
                preload: false
        });
    }

    _clickOutside(e) {
        if (this.state.hidden) {
            return;
        }

        let drawer = $(React.findDOMNode(this));
        let target = $(e.target);


        if (drawer.is(target)) {
            return;
        }

        if (drawer.find(target).length) {
            return;
        }

        Actions.HIDE_NAV_DRAWER.invoke();
    }
}

module.exports = NavDrawer;