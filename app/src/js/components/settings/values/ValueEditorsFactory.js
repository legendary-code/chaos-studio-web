import React from 'react';
import ValueBinding from './ValueBinding';
import BooleanValueEditor from './BooleanValueEditor';
import NumberValueEditor from './NumberValueEditor';

/* Given a set of component parameters, generates UI controls for editing these parameters */
export default class ValueEditorsFactory {
    static create(component, props) {
        let editors = [];
        let params = component.type.params;

        if (!params) {
            return editors;
        }

        for (let prop in params) {
            if (!params.hasOwnProperty(prop)) {
                continue;
            }

            let param = params[prop];
            let binding = new ValueBinding(component, prop);
            props = props || {};

            switch (param.type) {
                case 'number':
                    editors.push(
                        <NumberValueEditor
                            binding={binding}
                            icon={param.icon}
                            min={param.min}
                            max={param.max}
                            label={param.label}
                            disabled={props.disabled}
                        />
                    );
                    break;

                case 'boolean':
                    editors.push(
                        <BooleanValueEditor
                            binding={binding}
                            label={param.label}
                        />
                    );
                    break;
            }
        }

        return editors;
    }
}
