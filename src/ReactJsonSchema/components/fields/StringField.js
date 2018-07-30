import React from "react";
import PropTypes from "prop-types";

import {
  getWidget,
  getUiOptions,
  isSelect,
  optionsList,
  getDefaultRegistry,
  getFieldProps
} from "../../utils";
import { Form, Icon, Input, Button, Select } from 'antd';
const FormItem = Form.Item;
function StringField(props) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    errors,
    onSelect,
    allFormData,
    registry = getDefaultRegistry(),
  } = props;
  const { title, format, type } = schema;
  const { widgets, formContext } = registry;
  const enumOptions = isSelect(schema) && optionsList(schema);
  let defaultWidget
  if (registry.display) {
    defaultWidget = "antdDisplay"
  } else if (type == "integer" || type == "number") {
    defaultWidget = "antdNumberWidget"
  } else if (format) {
    switch (format) {
      case "image":
        defaultWidget = "antdImageWidget" // 展示图片
        break;
      case "date":
        defaultWidget = "antdDateWidget"
        break;
      case "date-time":
        defaultWidget = "antdDateWidget"
        break
      case "data-url":
        defaultWidget = "data-url"
        break
      case "file-upload":
        defaultWidget = "antdFileWidget"
        break
      case "verify-code":
        defaultWidget = "antdVcodeWidget"
        break
      case "group-select":
        defaultWidget = "antdGroupSelectWidget"
        break
      case "relation-select":
        defaultWidget = "antdRelatedSelectWidget"
        break
      case "dy-select":
        defaultWidget = "antdDynamicSelectWidget";
        break
      case "amount":
      case "mobile-num":
      case "bank-card":
        defaultWidget = "antdText"
        break
      default:
        console.log('not matching widget')
        defaultWidget = "antdText"
        break;
    }
  } else if (enumOptions) {
    defaultWidget = "antdSelect"
  } else {
    defaultWidget = "antdText"
  }
  // const defaultWidget = registry.display ? "antdDisplay" :
  //   (format || (enumOptions ? "antdSelect" : "antdText"));
  // console.log('defaultWidget', defaultWidget);
  const { widget = (schema.option && schema.option.widget) || defaultWidget, placeholder = schema.placeholder, ...options } = getUiOptions(
    uiSchema
  );
  const Widget = getWidget(schema, widget, widgets);
  const { label, help } = getFieldProps(uiSchema, schema) || name
  return (
    <Widget
      options={{ ...options, enumOptions }}
      schema={schema}
      id={idSchema && idSchema.$id}
      label={label}
      help={help}
      value={formData ? formData : ''}
      allFormData={allFormData}
      onChange={onChange}
      onSelect={onSelect}
      onBlur={onBlur}
      onFocus={onFocus}
      required={required}
      disabled={disabled}
      readonly={readonly}
      formContext={formContext}
      autofocus={autofocus}
      registry={registry}
      errors={errors}
      placeholder={placeholder}
    />
  );
}

if (process.env.NODE_ENV !== "production") {
  StringField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object.isRequired,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    formData: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    registry: PropTypes.shape({
      widgets: PropTypes.objectOf(
        PropTypes.oneOfType([PropTypes.func, PropTypes.object])
      ).isRequired,
      fields: PropTypes.objectOf(PropTypes.func).isRequired,
      definitions: PropTypes.object.isRequired,
      formContext: PropTypes.object.isRequired,
    }),
    formContext: PropTypes.object.isRequired,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
    autofocus: PropTypes.bool,
  };
}

StringField.defaultProps = {
  uiSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

export default StringField;
