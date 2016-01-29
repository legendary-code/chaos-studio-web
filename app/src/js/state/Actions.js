export const TOGGLE_NAV = 'TOGGLE_NAV';
export const HIDE_NAV = 'HIDE_NAV';
export const SET_TITLE = 'SET_TITLE';

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