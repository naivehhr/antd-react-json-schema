import React from "react";
import PropTypes from "prop-types";

import {
  getWidget,
  getUiOptions,
  optionsList,
  getDefaultRegistry,
  getFieldProps
} from "../../utils";
import { Form, Icon, Input, Button, Select, Radio } from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
function BooleanField(props) {
  const {
    schema,
    name,
    uiSchema,
    idSchema,
    formData,
    registry = getDefaultRegistry(),
    required,
    disabled,
    readonly,
    autofocus,
    onChange,
    errors,
    allFormData
  } = props;
  const { title } = schema;
  const { widgets, formContext } = registry;
  const defaultWidget = registry.display ? "antdDisplay" : "antdRadio"
  const { widget = (schema.option && schema.option.widget) || defaultWidget, ...options } = getUiOptions(uiSchema);
  const Widget = getWidget(schema, widget, widgets);
  const enumOptions = optionsList({
    enum: schema.enum || [true, false],
    enumNames: schema.enumNames || ["是", "否"],
  });
  // const enumOptions = optionsList({
  //   enum: [true, false],
  //   enumNames: schema.enumNames || ["是", "否"],
  // });
  return (
    <Widget
      options={{ ...options, enumOptions }}
      schema={schema}
      id={idSchema && idSchema.$id}
      onChange={onChange}
      label={title === undefined ? name : title}
      value={formData}
      allFormData={allFormData}
      required={required}
      disabled={disabled}
      readonly={readonly}
      registry={registry}
      errors={errors}
      formContext={formContext}
      autofocus={autofocus}
    />
  );
}

if (process.env.NODE_ENV !== "production") {
  BooleanField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.bool,
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

BooleanField.defaultProps = {
  uiSchema: {},
  disabled: false,
  readonly: false,
  autofocus: false,
};

export default BooleanField;
