import React, { Component } from "react";
import PropTypes from "prop-types";

import { default as DefaultErrorList } from "./ErrorList";
import {
  getDefaultFormState,
  shouldRender,
  toIdSchema,
  setState,
  getDefaultRegistry,
  transformErrors
} from "../utils";
import { formatAmountValue, processRely } from "../../Util";
import "./style.scss";
import validateFormData from "../validate";
import { Form, Input, Button } from "antd";
const FormItem = Form.Item;
class _Form extends Component {
  static defaultProps = {
    uiSchema: {},
    noValidate: false,
    liveValidate: false,
    safeRenderCompletion: false,
    noHtml5Validate: false,
    ErrorList: DefaultErrorList
  };

  constructor(props) {
    super(props);
    this.state = this.getStateFromProps(props);
  }

  componentDidMount() {
    const { schema, formData, originalSchema } = this.state;
    let newSchema = processRely(schema, formData, originalSchema);
    // // 这里要不这么写是不是也行？
    this.setState({ schema: newSchema });
  }

  componentWillReceiveProps(nextProps, nextState) {
    if (nextProps.formData) {
      this.setState({ formData: nextProps.formData });
    }
    if (nextProps.schema) {
      // 为了演示用, 重新生成各层ID
      const idSchema = toIdSchema(nextProps.schema);
      this.setState({ schema: nextProps.schema, idSchema });
    }
    if (nextProps.uiSchema) {
      this.setState({ uiSchema: nextProps.uiSchema });
    }
  }

  // componentDidMount () {
  //   setTimeout(()=>{
  //     this.setState({schema: {}})
  //   }, 2000);
  // }

  getStateFromProps(props) {
    if (!props.schema) return {};
    const state = this.state || {};
    const schema = "schema" in props ? props.schema : this.props.schema;
    const originalSchema = _.cloneDeep(schema);
    const uiSchema = "uiSchema" in props ? props.uiSchema : this.props.uiSchema;
    const edit = typeof props.formData !== "undefined";
    const liveValidate = props.liveValidate || this.props.liveValidate;
    const mustValidate = edit && !props.noValidate && liveValidate;
    const { definitions } = schema;
    const formData = getDefaultFormState(schema, props.formData, definitions);
    const { errors, errorSchema } = mustValidate
      ? this.validate(formData, schema)
      : {
          errors: state.errors || [],
          errorSchema: state.errorSchema || {}
        };
    const idSchema = toIdSchema(
      schema,
      uiSchema["ui:rootFieldId"],
      definitions
    );
    return {
      schema,
      originalSchema,
      uiSchema,
      idSchema,
      formData,
      edit,
      errors,
      errorSchema
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
  }

  validate(formData, schema, idSchema) {
    const { validate } = this.props;
    return validateFormData(
      formData,
      schema,
      idSchema,
      validate,
      transformErrors
    );
  }

  renderErrors() {
    // const { errors, errorSchema, schema, uiSchema } = this.state;
    // const { ErrorList, showErrorList, formContext } = this.props;
    // if (errors.length && showErrorList != false) {
    //   return (
    //     <ErrorList
    //       errors={errors}
    //       errorSchema={errorSchema}
    //       schema={schema}
    //       uiSchema={uiSchema}
    //       formContext={formContext}
    //     />
    //   );
    // }
    // return null;
  }

  // onChange = (formData, options = { validate: false }) => {
  //   // const mustValidate =
  //   //   !this.props.noValidate && (this.props.liveValidate || options.validate);
  //   let state = { formData };
  //   // if (mustValidate) {
  //   //   const { errors, errorSchema } = this.validate(formData);
  //   //   state = { ...state, errors, errorSchema };
  //   // }
  //   setState(this, state, () => {
  //     if (this.props.onChange) {
  //       this.props.onChange(this.state);
  //     }
  //   });
  // };

  /**
   * 在formdata级别运算数据依赖关系.
   * @param {*} rootData
   * @param {*} dependency
   * @param {*} pathArr 查找路径数组
   */
  __parseDependencyData(rootData, dependency, pathArr) {
    //之后也许支付复杂运算的
    if (dependency.type == "equal") {
      let targetkey = dependency.key;
      let valuepaths = targetkey.split(".");
      let str = valuepaths.reduce((c, p) => {
        return `${c}.${p}`;
      });
      let str1 = pathArr.reduce((c, p) => {
        return `${c}.${p}`;
      });
      _.set(rootData, str1, _.get(rootData, str));
    } else if (dependency.type == "date_compare") {
      // 动态更改相关的schema
      let targV = _.get(rootData, dependency.key);
      let _schema = _.cloneDeep(this.state.schema);
      let pathStr = pathArr.reduce((c, p) => {
        if (c != "") {
          return `${c}.properties.${p}`;
        }
        return `properties.${p}`;
      }, "");
      pathStr += `.dependency.value`;
      _.set(_schema, pathStr, targV);
      // 这更新有问题, 不确定外层还有哪有延迟的更新, 所以要尽量只setState一次
      // 应该是外层的formData导致的😂
      setTimeout(() => {
        this.setState({ schema: _schema });
      }, 1000);
    }
  }

  //在formdata级别运算数据.
  _handleDataDependency(root_formData, formData, schema, pathArr = []) {
    if (schema.type == "object") {
      for (var key in schema.properties) {
        let _pathArr = pathArr.slice();
        _pathArr.push(key);
        this._handleDataDependency(
          root_formData,
          formData[key],
          schema.properties[key],
          _pathArr
        );
      }
    } else if (schema.type == "array") {
      //do nothing
    } else {
      if (schema.dependency != null) {
        formData = this.__parseDependencyData(
          root_formData,
          schema.dependency,
          pathArr
        );
      }
    }
    return formData;
  }

  _handleSchemaRelation(formData) {
    const { originalSchema, schema } = this.state;
    let newSchema = processRely(schema, formData, originalSchema);
    // 这里要不这么写是不是也行？
    setTimeout(() => {
      // 这里联动有问题
      this.setState({ schema: newSchema });
    });
  }

  _onChange = (oformData, options = { validate: false }) => {
    let formData = _.cloneDeep(oformData);
    this._handleDataDependency(formData, formData, this.state.schema);
    this._handleSchemaRelation(formData); // 还是要直接返回schema吧
    // 这个地方可以更改下 onChange考虑可不可以不回调
    if (this.props.onChange) {
      this.props.onChange(formData);
    }
  };

  // onBlur = (...args) => {
  //   if (this.props.onBlur) {
  //     this.props.onBlur(...args);
  //   }
  // };

  // onFocus = (...args) => {
  //   if (this.props.onFocus) {
  //     this.props.onFocus(...args);
  //   }
  // };

  onSubmit = event => {
    event.preventDefault();
    const { errors, errorSchema } = this.validate(
      this.state.formData,
      this.props.schema,
      this.state.idSchema
    );
    let _errors = errors;
    let _errorSchema = errorSchema;
    this.setState(
      {
        errors: errors,
        errorSchema: errorSchema
      },
      () => {
        if (Object.keys(_errors).length == 0) {
          const { schema, formData } = this.state;
          formatAmountValue(schema, formData);
          console.log("formData", formData);
          // return
          this.props.onSubmit &&
            this.props.onSubmit(formData, data => {
              // console.log('callback', data)
              // 设置后台返回的errorMsg
              const { formError } = data;
              this.setState({
                errorSchema: formError
              })
            });
        } else {
          console.log("formData", this.state.formData);
          console.error("errorSchema", _errorSchema);
          console.error("errors", _errors);
        }
      }
    );
  };

  getRegistry() {
    // For BC, accept passed SchemaField and TitleField props and pass them to
    // the "fields" registry one.
    const { fields, widgets } = getDefaultRegistry();
    return {
      fields: { ...fields, ...this.props.fields },
      widgets: { ...widgets, ...this.props.widgets },
      ArrayFieldTemplate: this.props.ArrayFieldTemplate,
      FieldTemplate: this.props.FieldTemplate,
      definitions: this.props.schema.definitions || {},
      formContext: this.props.formContext || {},
      display: this.state.uiSchema["ui:display"] || false
    };
  }

  render() {
    const {
      children,
      safeRenderCompletion,
      id,
      className,
      name,
      method,
      target,
      action,
      autocomplete,
      enctype,
      acceptcharset,
      noHtml5Validate
    } = this.props;
    const { schema, uiSchema, formData, errorSchema, idSchema } = this.state;
    if (!schema) return <div />;
    // let titleFormat = "object"
    // if (uiSchema["ui:titleFormat"]) {
    //   titleFormat = uiSchema["ui:titleFormat"]
    // }
    const registry = this.getRegistry();
    const _SchemaField = registry.fields.SchemaField;
    registry.formContext.myFormFun = this.props.form;
    // if(schema.notAntdFormTrusteeship) {
    //   // 取消 AntdForm 托管
    //   registry.formContext.notAntdFormTrusteeship = schema.notAntdFormTrusteeship
    // }
    let title = schema.title;
    // let _schema = Object.assign({}, schema)
    // if (titleFormat != "object") {
    //   delete _schema.title
    // }
    return (
      <div className="schemaform">
        {/* {
          title && (
            <div className="antd-form-title">
              {title}
            </div>
          )
        } */}
        <Form
          ref={this.props.ref || ""}
          className={className ? className : "antd-form"}
          id={id}
          name={name}
          method={method}
          target={target}
          action={action}
          autoComplete={autocomplete}
          encType={enctype}
          acceptCharset={acceptcharset}
          noValidate={noHtml5Validate}
          onSubmit={this.onSubmit}
        >
          {this.renderErrors()}
          <_SchemaField
            schema={schema}
            uiSchema={uiSchema}
            errorSchema={errorSchema}
            idSchema={idSchema}
            formData={formData}
            onChange={this._onChange.bind(this)}
            onBlur={this.onBlur}
            onFocus={this.onFocus}
            registry={registry}
            safeRenderCompletion={safeRenderCompletion}
            onSelect={this.props.onSelect}
          />
          {children ? (
            children
          ) : (
            <div className="antd-form-sub-btn">
              <Button htmlType="submit" type="primary">
                提交
              </Button>
            </div>
          )}
        </Form>
      </div>
    );
  }
}

const WrappedHorizontalLoginForm = Form.create()(_Form);
export default WrappedHorizontalLoginForm;

if (process.env.NODE_ENV !== "production") {
  Form.propTypes = {
    schema: PropTypes.object.isRequired,
    uiSchema: PropTypes.object,
    formData: PropTypes.any,
    widgets: PropTypes.objectOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object])
    ),
    fields: PropTypes.objectOf(PropTypes.func),
    ArrayFieldTemplate: PropTypes.func,
    FieldTemplate: PropTypes.func,
    ErrorList: PropTypes.func,
    onChange: PropTypes.func,
    onError: PropTypes.func,
    showErrorList: PropTypes.bool,
    onSubmit: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    name: PropTypes.string,
    method: PropTypes.string,
    target: PropTypes.string,
    action: PropTypes.string,
    autocomplete: PropTypes.string,
    enctype: PropTypes.string,
    acceptcharset: PropTypes.string,
    noValidate: PropTypes.bool,
    noHtml5Validate: PropTypes.bool,
    liveValidate: PropTypes.bool,
    validate: PropTypes.func,
    transformErrors: PropTypes.func,
    safeRenderCompletion: PropTypes.bool,
    formContext: PropTypes.object
  };
}
