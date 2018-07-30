import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  Button,
  Collapse,
  Input,
  Radio,
  Select,
  DatePicker,
  Checkbox,
  Upload,
  message,
  Modal,
  Form,
} from 'antd'
const Panel = Collapse.Panel
const FormItem = Form.Item
import { formItemLayout } from '../widgets/antd/constant'
import {
  orderProperties,
  retrieveSchema,
  getDefaultRegistry,
  renderByCustomerLaout
} from "../../utils";
import {
  SimpleLayout,
  ContainerPaddingLayout,
  CollapseLayout,
  TabsLayout,
  TransparentLayout,
  BlockLayout,
  HorizontalLayout,
  WholeSchemaLayout,
  TitleChildLayout
} from './Layout'
class ObjectField extends Component {
  static defaultProps = {
    uiSchema: {},
    formData: {},
    errorSchema: {},
    idSchema: {},
    required: false,
    disabled: false,
    readonly: false,
  };
  state = { visible: false }

  isRequired(name) {
    const schema = this.props.schema;
    return (
      Array.isArray(schema.required) && schema.required.indexOf(name) !== -1
    );
  }

  onPropertyChange = name => {
    return (value, options) => {
      const newFormData = { ...this.props.formData, [name]: value };
      this.props.onChange && this.props.onChange(newFormData, options);
    };
  };
  showModal = () => {
    this.setState({ visible: true });
  }
  hideModal = () => {
    this.setState({ visible: false });
    return (value, options) => {
      const newFormData = { ...this.props.formData, [name]: value };
      this.props.onChange && this.props.onChange(newFormData, options);
    };
  }

  render() {
    const {
      uiSchema,
      formData,
      errorSchema,
      idSchema,
      name,
      required,
      disabled,
      readonly,
      onBlur,
      onFocus,
      allFormData,
      registry = getDefaultRegistry(),
    } = this.props;
    if(uiSchema.customer_layout){
      let Com = renderByCustomerLaout(uiSchema.customer_layout)
      return <Com {...this.props} />
    }
    // console.log('ObjectField errorSchema', this.props.errorSchema)
    // console.log('ObjectField errorSchema', this.props.errors)
    const { definitions, fields, formContext } = registry;
    const { SchemaField, TitleField, DescriptionField } = fields;
    const schema = retrieveSchema(this.props.schema, definitions);
    const title = schema.title === undefined ? name : schema.title;
    let orderedProperties;
    try {
      const properties = Object.keys(schema.properties);
      orderedProperties = orderProperties(properties, uiSchema["ui:order"]);
    } catch (err) {
      return (
        <div>
          <p className="config-error" style={{ color: "red" }}>
            Invalid {name || "root"} object field configuration:
            <em>{err.message}</em>
          </p>
          <pre>{JSON.stringify(schema)}</pre>
        </div>
      );
    }
    let _view
    let children = orderedProperties.map((name, index) => {
      // if(schema.properties[name].hidden) return 
      return (
        <SchemaField
          key={index}
          name={name}
          required={this.isRequired(name)}
          schema={schema.properties[name]}
          uiSchema={uiSchema[name]}
          errorSchema={errorSchema[name]}
          errors={this.props.errors}
          idSchema={idSchema[name]}
          formData={formData[name]}
          onChange={this.onPropertyChange(name)}
          onSelect={this.props.onSelect}
          onBlur={onBlur}
          onFocus={onFocus}
          registry={registry}
          disabled={disabled}
          readonly={readonly}
          allFormData={allFormData || formData}
        />
      );
    })
    // CollapseLayout
    let newView
    const _title = uiSchema["ui:title"] || title
    switch (schema.layout) {
      case "Tabs":
        newView = TabsLayout(children, _title, schema)
        break;
      case "Horizontal":
        newView = HorizontalLayout(children, _title, schema)
        break;
      case "Collapse":
        newView = CollapseLayout(children, _title, schema)
        break;
      case "ContainerPadding":
        newView = ContainerPaddingLayout(children, _title, schema)
        break;
      case "Transparent":
        newView = TransparentLayout(children, _title, schema)
        break;
      case "Block":
        newView = BlockLayout(children, _title, schema)
        break;
      case "WholeSchemaLayout":
        newView = WholeSchemaLayout(children, _title, schema)
        break;
      case "TitleChildLayout":
        newView = TitleChildLayout(children, _title, schema)
        break;
      default:
        newView = SimpleLayout(children, _title, schema)
        break;
    }
    if (schema.modal) {
      // const formItemLayout = {
      //   labelCol: { span: 3 },
      //   wrapperCol: { span: 5 }
      // };
      return (
        <div>
          <Modal
            title={_title}
            visible={this.state.visible}
            onOk={this.hideModal}
            onCancel={this.hideModal}
          >
            {newView}
          </Modal>
          <FormItem colon={false} label={_title} {...formItemLayout} className="form-item">
            <Button onClick={this.showModal}>{"设置"}</Button>
          </FormItem>
        </div>
      )
    }
    return newView
  }
}

if (process.env.NODE_ENV !== "production") {
  ObjectField.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    errorSchema: PropTypes.object,
    idSchema: PropTypes.object,
    onChange: PropTypes.func.isRequired,
    formData: PropTypes.object,
    required: PropTypes.bool,
    disabled: PropTypes.bool,
    readonly: PropTypes.bool,
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

export default ObjectField;
