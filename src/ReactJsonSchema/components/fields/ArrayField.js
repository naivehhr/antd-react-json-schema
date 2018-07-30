import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Button } from 'antd'
import UnsupportedField from "./UnsupportedField";
import {
  getWidget,
  getDefaultFormState,
  getUiOptions,
  isMultiSelect,
  isFilesArray,
  isFixedItems,
  allowAdditionalItems,
  optionsList,
  retrieveSchema,
  toIdSchema,
  getDefaultRegistry,
  isGroupCheckbox
} from "../../utils";
import _ from 'lodash';
import './style.scss'
function ArrayFieldTitle({ TitleField, idSchema, title, required, titleLevel }) {
  if (!title) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  const id = `${idSchema.$id}__title`;
  return <TitleField id={id} title={title} required={required} titleLevel={titleLevel} />;
}

function ArrayFieldDescription({ DescriptionField, idSchema, description }) {
  if (!description) {
    // See #312: Ensure compatibility with old versions of React.
    return <div />;
  }
  const id = `${idSchema.$id}__description`;
  return <DescriptionField id={id} description={description} />;
}

function IconBtn(props) {
  const { type = "default", icon, className, onClick, ...otherProps } = props;
  return (
    <Button
      icon={icon}
      onClick={onClick}
      className={className}
      {...otherProps}
    >
    </Button>
  );
}

// Used in the two templates
function DefaultArrayItem(props) {
  const btnStyle = {
    flex: 1,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: "bold",
  };
  let toolbarView
  if (props.hasMoveUp || props.hasMoveDown) {
    toolbarView = (
      <div style={{ position: 'relative' }}>
        <div className="toolbar" >
          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconBtn
              icon="arrow-up"
              className="array-item-move-up"
              tabIndex="-1"
              style={btnStyle}
              disabled={props.disabled || props.readonly || !props.hasMoveUp}
              onClick={props.onReorderClick(props.index, props.index - 1)}
            />
          )}

          {(props.hasMoveUp || props.hasMoveDown) && (
            <IconBtn
              icon="arrow-down"
              className="array-item-move-down"
              tabIndex="-1"
              style={btnStyle}
              disabled={
                props.disabled || props.readonly || !props.hasMoveDown
              }
              onClick={props.onReorderClick(props.index, props.index + 1)}
            />
          )}

          {/* {props.hasRemove && (
          <Button onClick={props.onDropIndexClick(props.index)}>删除</Button>
        )} */}
        </div>
      </div>
    )
  }
  return (
    <div key={props.index} className={props.className}>
      <div className={props.hasToolbar ? "col-xs-9" : "col-xs-12"}>
        <div>
          {props.children}
        </div>
        {/* {props.hasToolbar && (
          <div className="del-btn">
            <div >
              {props.hasRemove && (
                <Button onClick={props.onDropIndexClick(props.index)}>删除</Button>
              )}
            </div>
          </div>
        )} */}
      </div>
      {toolbarView}
    </div>
  );
}


// function HorizontalArrayItem(props) {
//   return (
//     <div key={props.index} className="ccc">
//         {props.children}
//     </div>
//   );
// }

function DefaultFixedArrayFieldTemplate(props) {
  return (
    <div >
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema["ui:title"] || props.title}
        required={props.required}
        titleLevel={props.schema.titleLevel}
      />

      {(props.uiSchema["ui:description"] || props.schema.description) && (
        <div
          className="field-description"
          key={`field-description-${props.idSchema.$id}`}>
          {props.uiSchema["ui:description"] || props.schema.description}
        </div>
      )}
      <div style={{ margin: '5px 0 10px 20px' }}>
        {props.canAdd && (
          <AddButton
            onClick={props.onAddClick}
            disabled={props.disabled || props.readonly}
          />
        )}
      </div>

      <div
        className="row array-item-list"
        key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map(DefaultArrayItem)}
      </div>

    </div>
  );
}

// function HorizontalArrayFieldTemplate(props) {
//   // console.log(props)
//   return (
//     <div className="aaa" >
//       <div className="bbb">
//         {props.items && props.items.map(p => HorizontalArrayItem(p))}
//       </div>
//       {props.canAdd && (
//         <AddButton
//           onClick={props.onAddClick}
//           disabled={props.disabled || props.readonly}
//         />
//       )}
//     </div>
//   );
// }


function DefaultNormalArrayFieldTemplate(props) {
  // console.log(props)
  return (
    <fieldset className={props.className}>
      <ArrayFieldTitle
        key={`array-field-title-${props.idSchema.$id}`}
        TitleField={props.TitleField}
        idSchema={props.idSchema}
        title={props.uiSchema["ui:title"] || props.title}
        required={props.required}
        titleLevel={props.schema.titleLevel}
      />

      {(props.uiSchema["ui:description"] || props.schema.description) && (
        <ArrayFieldDescription
          key={`array-field-description-${props.idSchema.$id}`}
          DescriptionField={props.DescriptionField}
          idSchema={props.idSchema}
          description={
            props.uiSchema["ui:description"] || props.schema.description
          }
        />
      )}

      <div
        className="row array-item-list"
        key={`array-item-list-${props.idSchema.$id}`}>
        {props.items && props.items.map(p => DefaultArrayItem(p))}
      </div>

      <div style={{ margin: '10px 0 10px 0' }}>
        {props.canAdd && (
          <AddButton
            onClick={props.onAddClick}
            disabled={props.disabled || props.readonly}
          />
        )}
      </div>
    </fieldset>
  );
}

class ArrayField extends Component {
  static defaultProps = {
    uiSchema: {},
    formData: [],
    idSchema: {},
    required: false,
    disabled: false,
    readonly: false,
    autofocus: false,
  };

  constructor() {
    super()
    this.keys = []
    this.uuid = 0
  }

  componentWillMount() {
    const {
      schema,
      uiSchema,
      formData,
      idSchema,
      registry
    } = this.props;
    const { definitions } = registry;
    let items = formData
    if (this.keys.length == 0) {
      if (isFixedItems(schema)) {
        if (!items || items.length < schema.items.length) {
          items = formData.concat(new Array(schema.items.length - items.length));
        }
      }
      this.keys = items.map((_) => (this.uuid++));
    }
  }


  get itemTitle() {
    const { schema } = this.props;
    return schema.items.title || schema.items.description || "Item";
  }

  isItemRequired(itemSchema) {
    if (Array.isArray(itemSchema.type)) {
      // While we don't yet support composite/nullable jsonschema types, it's
      // future-proof to check for requirement against these.
      return !itemSchema.type.includes("null");
    }
    // All non-null array item types are inherently required by design
    return itemSchema.type !== "null";
  }

  canAddItem(formItems) {
    const { schema, uiSchema } = this.props;
    let { addable } = getUiOptions(uiSchema);
    if (addable !== false) {
      // if ui:options.addable was not explicitly set to false, we can add
      // another item if we have not exceeded maxItems yet
      if (schema.maxItems !== undefined) {
        addable = formItems.length < schema.maxItems;
      } else {
        addable = true;
      }
    }
    return addable;
  }

  getKey = (index) => {
    let key = this.keys[index]
    return key
  }

  onAddClick = event => {
    event.preventDefault();
    const { schema, formData, registry = getDefaultRegistry() } = this.props;
    const { definitions } = registry;
    let itemSchema = schema.items;
    if (isFixedItems(schema) && allowAdditionalItems(schema)) {
      itemSchema = schema.additionalItems;
    }
    this.props.onChange(
      [...formData, getDefaultFormState(itemSchema, undefined, definitions)],
      { validate: false }
    );
    this.keys[formData.length] = this.uuid++
  };

  onDropIndexClick = index => {
    return event => {
      if (event) {
        event.preventDefault();
      }
      const { formData, onChange } = this.props;
      // refs #195: revalidate to ensure properly reindexing errors
      onChange(formData.filter((_, i) => i !== index), { validate: true });
      this.keys = this.keys.filter((k, idx) => idx != index)
    };
  };


  onReorderClick = (index, newIndex) => {
    return event => {
      if (event) {
        event.preventDefault();
        event.target.blur();
      }
      const { formData, onChange } = this.props;
      const tmpKeys = Array.from(this.keys)
      this.keys = tmpKeys.map((k, i) => {
        if (i === newIndex) {
          return tmpKeys[index];
        } else if (i === index) {
          return tmpKeys[newIndex];
        } else {
          return k;
        }
      })
      onChange(
        formData.map((item, i) => {
          if (i === newIndex) {
            return formData[index];
          } else if (i === index) {
            return formData[newIndex];
          } else {
            return item;
          }
        }),
        { validate: true }
      );
    };
  };

  onChangeForIndex = index => {
    return value => {
      const { formData, onChange } = this.props;
      const newFormData = formData.map((item, i) => {
        // We need to treat undefined items as nulls to have validation.
        // See https://github.com/tdegrunt/jsonschema/issues/206
        const jsonValue = typeof value === "undefined" ? null : value;
        return index === i ? jsonValue : item;
      });
      onChange(newFormData, { validate: false });
    };
  };

  onSelectChange = (value, id) => {
    this.props.onChange(value, id);
  };

  render() {
    const {
      schema,
      uiSchema,
      idSchema,
      registry = getDefaultRegistry(),
    } = this.props;

    const { definitions } = registry;
    if (!schema.hasOwnProperty("items")) {
      return (
        <UnsupportedField
          schema={schema}
          idSchema={idSchema}
          reason="Missing items definition"
        />
      );
    }
    if (isFixedItems(schema)) {
      return this.renderFixedArray();
    }
    if (isFilesArray(schema, uiSchema, definitions)) {
      // return this.renderFiles();
    }
    if (isGroupCheckbox(schema, definitions)) {
      return this.renderGroupCheckbox()
    }

    if (isMultiSelect(schema, definitions)) {
      //这个判断得重新定义了
      // console.log('array isMultiSelect');
      return this.renderMultiSelect();
    }
    return this.renderNormalArray();
  }

  renderNormalArray() {
    const {
      schema,
      uiSchema,
      formData,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      autofocus,
      registry = getDefaultRegistry(),
      formContext,
      onBlur,
      onFocus,
      onSelect
    } = this.props;
    const title = schema.title === undefined ? name : schema.title;
    const { ArrayFieldTemplate, definitions, fields } = registry;
    const { TitleField, DescriptionField } = fields;
    const itemsSchema = retrieveSchema(schema.items, definitions);
    const arrayProps = {
      canAdd: this.canAddItem(formData),
      items: formData.map((item, index) => {
        const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;
        const itemIdPrefix = idSchema.$id + "." + this.getKey(index);
        const itemIdSchema = toIdSchema(itemsSchema, itemIdPrefix, definitions);
        return this.renderArrayFieldItem({
          index,
          canMoveUp: index > 0,
          canMoveDown: index < formData.length - 1,
          itemSchema: itemsSchema,
          itemIdSchema,
          itemErrorSchema,
          itemData: formData[index],
          itemUiSchema: uiSchema.items,
          autofocus: autofocus && index === 0,
          onBlur,
          onFocus,
          onSelect
        });
      }),
      className: '',
      DescriptionField,
      disabled,
      idSchema,
      uiSchema,
      onAddClick: this.onAddClick,
      readonly,
      required,
      schema,
      title,
      TitleField,
      formContext,
      formData
    };

    // Check if a custom render function was passed in
    const Component = ArrayFieldTemplate || DefaultNormalArrayFieldTemplate  //;HorizontalArrayFieldTemplate
    return <Component {...arrayProps} />;
  }


  renderGroupCheckbox() {
    const {
      schema,
      idSchema,
      uiSchema,
      disabled,
      readonly,
      autofocus,
      onBlur,
      required,
      onFocus,
      registry = getDefaultRegistry(),
    } = this.props;
    const items = this.props.formData;
    const { widgets, definitions, formContext } = registry;
    const itemsSchema = retrieveSchema(schema.items, definitions);
    const enumOptions = optionsList(itemsSchema);
    let defaultWidget
    if (registry.display) {
      defaultWidget = "antdDisplay"
    } else {
      defaultWidget = "antdCheckboxes"
    }
    const { widget = defaultWidget || "select", ...options } = {
      ...getUiOptions(uiSchema),
      enumOptions,
    };
    const Widget = getWidget(schema, widget, widgets);
    return (
      <Widget
        id={idSchema && idSchema.$id}
        multiple
        onChange={this.onSelectChange}
        onBlur={onBlur}
        label={schema.title || name}
        onFocus={onFocus}
        options={options}
        schema={schema}
        required={required}
        value={items}
        disabled={disabled}
        readonly={readonly}
        formContext={formContext}
        autofocus={autofocus}
      />
    );
  }

  renderMultiSelect() {
    const {
      schema,
      idSchema,
      uiSchema,
      disabled,
      readonly,
      autofocus,
      onBlur,
      onFocus,
      onSelect,
      registry = getDefaultRegistry(),
    } = this.props;
    const items = this.props.formData;
    const { widgets, definitions, formContext } = registry;
    const itemsSchema = retrieveSchema(schema.items, definitions);
    const enumOptions = optionsList(itemsSchema);
    const { widget = "select", ...options } = {
      ...getUiOptions(uiSchema),
      enumOptions,
    };
    const Widget = getWidget(schema, widget, widgets);
    return (
      <Widget
        id={idSchema && idSchema.$id}
        multiple
        onChange={this.onSelectChange}
        onSelect={onSelect}
        onBlur={onBlur}
        onFocus={onFocus}
        options={options}
        schema={schema}
        value={items}
        disabled={disabled}
        readonly={readonly}
        formContext={formContext}
        autofocus={autofocus}
      />
    );
  }

  renderFiles() {
    const {
      schema,
      uiSchema,
      idSchema,
      name,
      disabled,
      readonly,
      autofocus,
      onBlur,
      onFocus,
      registry = getDefaultRegistry(),
    } = this.props;
    const title = schema.title || name;
    const items = this.props.formData;
    const { widgets, formContext } = registry;
    const { widget = "files", ...options } = getUiOptions(uiSchema);
    const Widget = getWidget(schema, widget, widgets);
    return (
      <Widget
        options={options}
        id={idSchema && idSchema.$id}
        multiple
        onChange={this.onSelectChange}
        onBlur={onBlur}
        onFocus={onFocus}
        schema={schema}
        title={title}
        value={items}
        disabled={disabled}
        readonly={readonly}
        formContext={formContext}
        autofocus={autofocus}
      />
    );
  }

  renderFixedArray() {
    const {
      schema,
      uiSchema,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      autofocus,
      registry = getDefaultRegistry(),
      onBlur,
      onFocus,
    } = this.props;
    const title = schema.title || name;
    let items = this.props.formData;
    const { ArrayFieldTemplate, definitions, fields } = registry;
    const { TitleField } = fields;
    const itemSchemas = schema.items.map(item =>
      retrieveSchema(item, definitions)
    );
    const additionalSchema = allowAdditionalItems(schema)
      ? retrieveSchema(schema.additionalItems, definitions)
      : null;

    if (!items || items.length < itemSchemas.length) {
      // to make sure at least all fixed items are generated
      items = items || [];
      items = items.concat(new Array(itemSchemas.length - items.length));
    }

    // These are the props passed into the render function
    const arrayProps = {
      canAdd: this.canAddItem(items) && additionalSchema,
      className: "field field-array field-array-fixed-items",
      disabled,
      idSchema,
      items: items.map((item, index) => {
        const additional = index >= itemSchemas.length;
        const itemSchema = additional ? additionalSchema : itemSchemas[index];
        const itemIdPrefix = idSchema.$id + "." + index; //uuid
        const itemIdSchema = toIdSchema(itemSchema, itemIdPrefix, definitions);
        const itemUiSchema = additional
          ? uiSchema.additionalItems || {}
          : Array.isArray(uiSchema.items)
            ? uiSchema.items[index]
            : uiSchema.items || {};
        const itemErrorSchema = errorSchema ? errorSchema[index] : undefined;

        return this.renderArrayFieldItem({
          index,
          canRemove: additional,
          canMoveUp: index >= itemSchemas.length + 1,
          canMoveDown: additional && index < items.length - 1,
          itemSchema,
          itemData: item,
          itemUiSchema,
          itemIdSchema,
          itemErrorSchema,
          autofocus: autofocus && index === 0,
          onBlur,
          onFocus,
        });
      }),
      onAddClick: this.onAddClick,
      readonly,
      required,
      schema,
      uiSchema,
      title,
      TitleField,
    };

    // Check if a custom template template was passed in
    const Template = ArrayFieldTemplate || DefaultFixedArrayFieldTemplate;
    return <Template {...arrayProps} />;
  }

  renderArrayFieldItem(props) {
    const {
      index,
      canRemove = true,
      canMoveUp = true,
      canMoveDown = true,
      itemSchema,
      itemData,
      itemUiSchema,
      itemIdSchema,
      itemErrorSchema,
      autofocus,
      onBlur,
      onFocus,
      onSelect
    } = props;
    const {
      disabled,
      readonly,
      uiSchema,
      registry = getDefaultRegistry(),
    } = this.props;
    const { fields: { SchemaField } } = registry;
    const { orderable, removable } = {
      orderable: true,
      removable: true,
      ...uiSchema["ui:options"],
    };
    const has = {
      moveUp: orderable && canMoveUp,
      moveDown: orderable && canMoveDown,
      remove: removable && canRemove,
    };
    has.toolbar = Object.keys(has).some(key => has[key]);
    return {
      children: (
        <div>
          <SchemaField
            schema={itemSchema}
            uiSchema={itemUiSchema}
            formData={itemData}
            errorSchema={itemErrorSchema}
            idSchema={itemIdSchema}
            required={this.isItemRequired(itemSchema)}
            onChange={this.onChangeForIndex(index)}
            onSelect={onSelect}
            onBlur={onBlur}
            onFocus={onFocus}
            registry={this.props.registry}
            disabled={this.props.disabled}
            readonly={this.props.readonly}
            autofocus={autofocus}
            classNames={"schema-field"}
          />
          <div className="del-btn">
            {has.remove && (
              <Button onClick={this.onDropIndexClick(index)}>删除</Button>
            )}
          </div>
        </div>
      ),
      className: "array-item",
      disabled,
      hasToolbar: has.toolbar,
      hasMoveUp: has.moveUp,
      hasMoveDown: has.moveDown,
      hasRemove: has.remove,
      index,
      onDropIndexClick: this.onDropIndexClick,
      onReorderClick: this.onReorderClick,
      readonly,
    };
  }
}

function AddButton({ onClick, disabled }) {
  const formItemLayout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  };
  return (
    <Button onClick={onClick}>添加</Button>
  );
}

if (process.env.NODE_ENV !== "production") {
  ArrayField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.shape({
      "ui:options": PropTypes.shape({
        addable: PropTypes.bool,
        orderable: PropTypes.bool,
        removable: PropTypes.bool,
      }),
    }),
    idSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    formData: PropTypes.array,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
  };
}

export default ArrayField;
