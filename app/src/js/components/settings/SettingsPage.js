let $ = require('jquery'),
    _ = require('underscore'),
    React = require('react'),
    Modals = require('../Modals'),
    Actions = require('../../actions/Actions'),
    Header = require('./Header'),
    ValueBinding = require('./values/ValueBinding'),
    NumberValueEditor = require('./values/NumberValueEditor'),
    BooleanValueEditor = require('./values/BooleanValueEditor'),
    ComponentPanel = require('./ComponentPanel'),
    AddComponentPanel = require('./AddComponentPanel'),
    Components = require('../../chaos/Components'),
    ComponentPicker = require('./ComponentPicker');

class SettingsPage extends React.Component {
    render() {
        let component = this.props.component;
        let controls = [];

        if (component && component.type.params) {
            for (let param of component.type.params) {
                controls.push(...this._createControls(component, param));
            }
        }

        return (
            <div className={this.props.className} key={this.props.key}>
                {controls}
            </div>
        );
    }

    _createControls(component, params) {
        let binding = new ValueBinding(component, params.property);

        let items;
        let hasSubProps;

        switch (params.type) {
            case 'number':
                return [
                    <NumberValueEditor
                        target={component}
                        {...params}
                    />
                ];

            case 'boolean':
                return [
                    <BooleanValueEditor
                        binding={binding}
                        label={params.label}
                        />
                ];

            case 'group':
                items = [];
                items.push(<Header label={params.label} />);
                for (let prop of params.properties) {
                    items.push(...this._createControls(component, prop));
                }
                return items;

            case 'component':
                hasSubProps = !!binding.val.type.params;

                return [
                    <Header label={params.label} />,
                    <ComponentPanel
                        binding={binding}
                        componentType={params.componentType}
                        showArrow={hasSubProps}
                        icon="icon-more-horiz"
                        onIconClick={this._changeComponent.bind(this)}
                        onPanelClick={this._editComponent.bind(this)}
                        />
                ];

            case 'componentSet':
                let controls = [ <Header label={params.label} /> ];
                items = binding.val || [];

                for (let index in items) {
                    let componentBinding = new ValueBinding(items, index);
                    hasSubProps = !!componentBinding.val.type.params;
                    controls.push(
                        <ComponentPanel
                            onIconClick={this._removeComponent.bind(this)}
                            onPanelClick={this._editComponent.bind(this)}
                            binding={componentBinding}
                            componentType={params.componentType}
                            showArrow={hasSubProps}
                            icon="icon-delete"
                            />
                    );
                }

                let supportedTypes = Components.findTypes(params.componentType);
                if (items.length < supportedTypes.length) {
                    controls.push(
                        <AddComponentPanel
                            binding={binding}
                            componentType={params.componentType}
                            onClick={this._addComponent.bind(this)}
                            />
                    );
                }

                return controls;
        }

        return [];
    }

    _removeComponent(binding) {
        binding.target.splice(binding.prop, 1);
        this.forceUpdate();
    }

    _addComponent(binding, componentType) {
        let items = binding.val || [];
        let supportedTypes = _.without(Components.findTypes(componentType), items);
        let self = this;

        let valueChanged = TComponent => {
            items.push(new TComponent());
            binding.val = items;
            self.forceUpdate();
        };

        Actions.SHOW_MODAL.invoke(
            <ComponentPicker
                types={supportedTypes}
                onValueChanged={valueChanged}
                />
        );
    }

    _changeComponent(binding, componentType) {
        let supportedTypes = Components.findTypes(componentType);
        let self = this;

        let valueChanged = TComponent => {
            binding.val = new TComponent();
            self.forceUpdate();
        };

        Actions.SHOW_MODAL.invoke(
            <ComponentPicker
                selected={binding.val}
                types={supportedTypes}
                onValueChanged={valueChanged}
                />
        );
    }

    _editComponent(binding) {
        this.props.onEditComponent(binding.val);
    }

    static get propTypes() {
        return {
            onEditComponent: React.PropTypes.func.isRequired,
            component: React.PropTypes.object.isRequired,
            className: React.PropTypes.string,
            key: React.PropTypes.string
        }
    }
}

module.exports = SettingsPage;