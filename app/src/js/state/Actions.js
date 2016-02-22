import { routeActions } from 'react-router-redux';

export const TOGGLE_NAV = 'TOGGLE_NAV';
export const HIDE_NAV = 'HIDE_NAV';
export const SET_TITLE = 'SET_TITLE';
export const EDIT_CONFIGURATION = 'EDIT_CONFIGURATION';
export const APPLY_CONFIGURATION = 'APPLY_CONFIGURATION';
export const REJECT_CONFIGURATION = 'REJECT_CONFIGURATION';


export function toggleNav() {
    return {
        type: TOGGLE_NAV
    };
}

export function hideNav() {
    return {
        type: HIDE_NAV
    };
}

export function setTitle(title) {
    return {
        type: SET_TITLE,
        title
    };
}

export function gotoPage(location) {
    return (dispatch) => {
        dispatch(routeActions.push(location));
        dispatch(hideNav());
    };
}

export function editConfiguration() {
    return {
        type: EDIT_CONFIGURATION
    };
}

export function applyConfiguration() {
    return {
        type: APPLY_CONFIGURATION
    };
}

export function rejectConfiguration() {
    return {
        type: REJECT_CONFIGURATION
    };
}