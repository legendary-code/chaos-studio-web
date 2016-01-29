import { Component } from 'react';

export function join(classes) {
    let result = "";

    // Allow polyfill to inject iterator behaviors
    let args = Array.apply(Array, arguments);

    for (let clazz of args) {
        if (typeof clazz === "string") {
            if (result) {
                result += " ";
            }

            result += clazz;
        }
    }
    return result;
}

export function cx(classes) {
    let result = "";

    for (let clazz in classes) {
        if (classes.hasOwnProperty(clazz) && classes[clazz]) {
            if (result) {
                result += " ";
            }

            result += clazz;
        }
    }

    return result;
}

export class Container extends Component {

}
