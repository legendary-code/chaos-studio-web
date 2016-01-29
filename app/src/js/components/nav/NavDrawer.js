import $ from 'jquery';
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { cx } from '../../utils/ReactUtils';

class NavDrawer extends Component {
    componentDidMount() {
        document.addEventListener("mousedown", this._clickOutside.bind(this));
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this._clickOutside.bind(this));
    }

    render() {
        let className = cx({
            "nav-drawer": true,
            "hidden": this.props.hidden,
            "preload": false
        });

        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    }

    _clickOutside(e) {
        if (this.props.hidden || !this.props.clickOutside) {
            return;
        }

        let drawer = $(ReactDOM.findDOMNode(this));
        let target = $(e.target);


        if (drawer.is(target)) {
            return;
        }

        if (drawer.find(target).length) {
            return;
        }

        if (this.props.clickOutside) {
            this.props.clickOutside();
        }
    }

    static propTypes = {
        hidden: PropTypes.bool,
        children: PropTypes.arrayOf(PropTypes.element),
        clickOutside: PropTypes.func
    };
}

export default NavDrawer;