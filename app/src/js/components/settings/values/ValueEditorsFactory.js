let React = require('react'),
    ValueBinding = require('./ValueBinding'),
    BooleanValueEditor = require('./BooleanValueEditor'),
    NumberValueEditor = require('./NumberValueEditor');

/* Given a set of component parameters, generates UI controls for editing these parameters */
class ValueEditorsFactory {
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
                    editors.push(new BooleanValueEditor(binding, param));
                    break;
            }
        }

        return editors;
    }
}

module.exports = ValueEditorsFactory;