/*
 * @Author: aran.hu 
 * @Date: 2017-08-22 13:26:47 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-13 17:39:47
 */
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import moment from 'moment'
import './style.scss';
import { customSchema } from 'Ajax'
import _ from 'lodash';
import { makeTreeDataRef, makeTreeDataBase } from '../../Util'
import CacheTreeView from '../../ReactJsonSchema/components/widgets/antd/CacheTreeView'

import {
  Layout,
  Menu,
  Icon,
  Breadcrumb,
  Button,
  Collapse,
  Input,
  Radio,
  Modal,
  Checkbox,
  Form,
  message,
  Row,
  Col
} from 'antd'
const CheckboxGroup = Checkbox.Group;
const { Header, Content, Sider, Item, Footer } = Layout;
const { SubMenu } = Menu
const Panel = Collapse.Panel
import JsonForm from "ReactJsonSchema";
import BaseInput from "react-jsonschema-form/lib/components/widgets/BaseInput"
import { getCreactCustomerSchema, addCustomer } from 'Ajax'
import CollapseForm from 'Component/Schema/CollapseForm'
import NomalForm from 'Component/Schema/NomalForm'
import DisplayForm from 'Component/Schema/DisplayForm'
import Container from 'Page/Container'

const plainOptions = ['Apple', 'Pear', 'Orange'];
class CustomerFieldConfig extends Component {

  constructor() {
    super()
    this.state = {
      formData: null,
      schema: null,
      _genVisible: false,
      _genSchema: null,
      _genUiSchema: null,
    }
    this.shouldSubmit = true
  }

  componentDidMount() {
    const { state } = this.props.location
    if (state && state.params) {
      this.setState({ formData: state.params.formData })
    } else if (this.props.formData) {
      this.setState({ formData: this.props.formData })
    }
    this.fetchData()
  }

  fetchData = async () => {
    let loading = false
    let result = await customSchema.customer.get()
    let { formData, jsonSchemaCreator } = result.value
    this.setState({
      formData: formData,
      schema: jsonSchemaCreator
    }, async () => {
      // 获得treeData数据
      const { schema, formData } = this.state
      let form = {
        "customSchema": formData,
        "scenario": "all",
        "schemaType": "USER_ADD",
      }
      let result = await customSchema.customer.preview(form)
      new CacheTreeView(result.value.jsonSchema) //en ....尴尬
      _.set(schema, 'definitions.tree_data.treeData', result.value.jsonSchema)
      this.setState({ schema })
    })
  }

  callback = () => { }

  onSelect = (data) => {
    const { formData } = this.state
    const { rely, formDataID, invalidHidden } = data
    let relObject = {}
    let tarID = formDataID.split('.')
    tarID.shift()
    tarID = tarID.join('.')
    
    relObject['rely'] = rely
    relObject['invalidHidden'] = invalidHidden
    // console.log('relObject', relObject);
    _.set(formData, tarID, relObject)
    this.setState({ formData })
  }

  onChange = (data) => {
    const { schema } = this.state
    // console.log('before', schema)
    // _.set(schema, 'definitions.db_field_item.required', '');
    // console.log('after', schema)
    this.setState({
      formData: data
    })
  }

  showModal = () => {
    this.setState({ _genVisible: true });
  }
  hideModal = () => {
    this.setState({ _genVisible: false });
    return (value, options) => {
      const newFormData = { ...this.props.formData, [name]: value };
      this.props.onChange && this.props.onChange(newFormData, options);
    };
  }

  submit = async (formData) => {
    // console.log(formData)
    let form = {
      "customSchema": formData,
      "scenario": "create",
      "schemaType": "USER_ADD",
    }
    if (this.shouldSubmit) {
      // message.success("submit")
      delete form.scenario
      let result = await customSchema.customer.save(form)
      let { code } = result
      // console.log("result", result)
      if (code == 200) {
        message.success("submit")
      }
    } else {
      let result = await customSchema.customer.preview(form)
      let { code } = result
      // console.log("result", result)
      let { jsonSchema, uiSchema } = result.value
      console.log('jsonSchema', jsonSchema)
      this.setState({
        _genSchema: jsonSchema,
        _genUiSchema: JSON.parse(uiSchema)
      })
      this.showModal()
    }
  }

  setShouldPreview = () => {
    this.shouldSubmit = false
  }

  setShouldSubmit = () => {
    this.shouldSubmit = true
  }

  render() {
    const { formData, schema, _genSchema, _genUiSchema } = this.state
    if (!schema) return <Container  {...this.props} />
    const uiSchema = {
    }
    const button = (
      <div className="antd-form-sub-btn">
        <Button htmlType="submit" onClick={this.setShouldPreview} type="primary">预览</Button>
        <Button style={{ marginLeft: 10 }} htmlType="submit" onClick={this.setShouldSubmit} type="primary">提交</Button>
      </div>
    )
    // const s = {
    //   "definitions": {
    //     "title": {
    //       "type": "object",
    //       "required": [
    //         "default"
    //       ],
    //       "properties": {
    //         "scenario": {
    //           "type": "object",
    //           "title": "场景标题",
    //           "titleLevel": "10",
    //           "modal": true,
    //           "required": [],
    //           "properties": {
    //             "create": {
    //               "type": "string",
    //               "title": "新建",
    //               "hidden": false,
    //               "readonly": false
    //             },
    //             "update": {
    //               "type": "string",
    //               "title": "更新",
    //               "hidden": false,
    //               "readonly": false
    //             },
    //             "view": {
    //               "type": "string",
    //               "title": "查看",
    //               "hidden": false,
    //               "readonly": false
    //             }
    //           }
    //         },
    //         "title_level": {
    //           "type": "string",
    //           "title": "标题级别",
    //           "hidden": false,
    //           "readonly": false,
    //           "default": "form"
    //         },
    //         "default": {
    //           "type": "string",
    //           "title": "默认标题",
    //           "hidden": false,
    //           "readonly": false
    //         }
    //       }
    //     },
    //     "group_item": {
    //       "type": "object",
    //       "title": "分组",
    //       "titleLevel": "0",
    //       "layout": "Collapse",
    //       "required": [
    //         "group_id",
    //         "group_title"
    //       ],
    //       "properties": {
    //         "group_id": {
    //           "type": "string",
    //           "title": "分组ID",
    //           "hidden": true,
    //           "readonly": false
    //         },
    //         "group_title": {
    //           "type": "string",
    //           "title": "分组标题",
    //           "hidden": false,
    //           "readonly": false
    //         },
    //         "title_level": {
    //           "type": "string",
    //           "title": "标题级别",
    //           "enumNames": [
    //             "一级标题",
    //             "二级标题",
    //             "5px",
    //             "10px",
    //             "15px"
    //           ],
    //           "hidden": false,
    //           "readonly": false,
    //           "default": "one",
    //           "enum": [
    //             "one",
    //             "two",
    //             "5",
    //             "10",
    //             "15"
    //           ]
    //         },
    //         "group_modal": {
    //           "type": "boolean",
    //           "title": "是否弹窗",
    //           "default": false
    //         },
    //         "group_layout": {
    //           "type": "string",
    //           "title": "分组布局",
    //           "enumNames": [
    //             "默认",
    //             "标签",
    //             "水平",
    //             "折叠"
    //           ],
    //           "hidden": false,
    //           "readonly": false,
    //           "default": "Simple",
    //           "enum": [
    //             "Simple",
    //             "Tabs",
    //             "Horizontal",
    //             "Collapse"
    //           ]
    //         },
    //         "fields": {
    //           "type": "array",
    //           "title": "自定义字段",
    //           "items": {
    //             "$ref": "#/definitions/field_item"
    //           }
    //         },
    //         "groups": {
    //           "type": "array",
    //           "title": "自定义分组",
    //           "items": {
    //             "$ref": "#/definitions/group_item"
    //           }
    //         }
    //       }
    //     },
    //     "field_item": {
    //       "type": "object",
    //       "title": "字段1字段12字段12字段12字段122",
    //       "titleLevel": "two-hasbtn",
    //       "layout": "Horizontal",
    //       "required": [
    //         "field_id",
    //         "field_title"
    //       ],
    //       "properties": {
    //         "field_id": {
    //           "type": "string",
    //           "title": "字段ID",
    //           "hidden": false,
    //           "readonly": false
    //         },
    //         "field_title": {
    //           "type": "string",
    //           "title": "字段标题",
    //           "hidden": false,
    //           "readonly": false
    //         },
    //         "attribute": {
    //           "type": "object",
    //           "title": "字段属性",
    //           "titleLevel": 10,
    //           "required": [],
    //           "modal": true,
    //           "layout": "Tabs",
    //           "properties": {
    //             "baseattr": {
    //               "type": "object",
    //               "title": "基本属性",
    //               "titleLevel": 5,
    //               "required": [
    //                 "field_type",
    //                 "data_type",
    //                 "disabled"
    //               ],
    //               "properties": {
    //                 "field_type": {
    //                   "type": "string",
    //                   "title": "输入类型",
    //                   "enumNames": [
    //                     "单选",
    //                     "多选",
    //                     "文本",
    //                     "下拉列表"
    //                   ],
    //                   "hidden": false,
    //                   "readonly": false,
    //                   "default": "blank",
    //                   "enum": [
    //                     "single",
    //                     "multi",
    //                     "blank",
    //                     "select"
    //                   ]
    //                 },
    //                 "option_group": {
    //                   "type": "string",
    //                   "title": "下拉选项",
    //                   "hidden": false,
    //                   "readonly": false
    //                 },
    //                 "data_type": {
    //                   "type": "string",
    //                   "title": "数据类型",
    //                   "enumNames": [
    //                     "字符型",
    //                     "日期型",
    //                     "整数型",
    //                     "数值型",
    //                     "布尔型",
    //                     "附件型"
    //                   ],
    //                   "hidden": false,
    //                   "readonly": false,
    //                   "default": "string",
    //                   "enum": [
    //                     "string",
    //                     "date",
    //                     "integer",
    //                     "number",
    //                     "boolean",
    //                     "file"
    //                   ]
    //                 },
    //                 "is_required": {
    //                   "title": "必填场景",
    //                   "$ref": "#/definitions/scenarios",
    //                   "uniqueItems": true
    //                 },
    //                 "invisible": {
    //                   "title": "是否可见",
    //                   "$ref": "#/definitions/scenarios",
    //                   "uniqueItems": true
    //                 },
    //                 "hidden": {
    //                   "title": "是否隐藏",
    //                   "$ref": "#/definitions/scenarios",
    //                   "uniqueItems": true
    //                 },
    //                 "readonly": {
    //                   "title": "是否只读",
    //                   "$ref": "#/definitions/scenarios",
    //                   "uniqueItems": true
    //                 },
    //                 "disabled": {
    //                   "type": "boolean",
    //                   "title": "是否停用",
    //                   "default": false
    //                 }
    //               }
    //             },
    //             "validate": {
    //               "type": "object",
    //               "title": "字段校验规则",
    //               "titleLevel": 5,
    //               "required": [],
    //               "properties": {
    //                 "maximum": {
    //                   "type": "integer",
    //                   "title": "最大值",
    //                   "default": 1000000
    //                 },
    //                 "minimum": {
    //                   "type": "integer",
    //                   "title": "最小值",
    //                   "default": 0
    //                 },
    //                 "pattern": {
    //                   "type": "string",
    //                   "title": "正则表达式",
    //                   "hidden": false,
    //                   "readonly": false,
    //                   "default": ""
    //                 },
    //                 "format": {
    //                   "type": "string",
    //                   "title": "时间格式",
    //                   "enumNames": [
    //                     "年/月/日 时:分",
    //                     "年/月/日"
    //                   ],
    //                   "hidden": false,
    //                   "readonly": false,
    //                   "default": "date-time",
    //                   "enum": [
    //                     "date-time",
    //                     "date"
    //                   ]
    //                 },
    //                 "maxLength": {
    //                   "type": "integer",
    //                   "title": "最大长度",
    //                   "default": 1000000
    //                 },
    //                 "minLength": {
    //                   "type": "integer",
    //                   "title": "最小长度",
    //                   "default": 1
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "db_field_item": {
    //       "type": "object",
    //       "title": "字段",
    //       "titleLevel": "two",
    //       "required": [
    //         "field_id",
    //         "field_title"
    //       ],
    //       "properties": {
    //         "field_id": {
    //           "type": "string",
    //           "title": "ID",
    //           "hidden": false,
    //           "readonly": true
    //         },
    //         "field_title": {
    //           "type": "string",
    //           "title": "标题",
    //           "hidden": false,
    //           "readonly": false
    //         },
    //         "attribute": {
    //           "type": "object",
    //           "title": "属性设置",
    //           "titleLevel": 10,
    //           "required": [],
    //           "modal": true,
    //           "layout": "Tabs",
    //           "properties": {
    //             "baseattr": {
    //               "type": "object",
    //               "title": "基本属性",
    //               "titleLevel": 5,
    //               "required": [
    //                 "field_type",
    //                 "data_type",
    //                 "disabled"
    //               ],
    //               "properties": {
    //                 "field_type": {
    //                   "type": "string",
    //                   "title": "输入类型",
    //                   "enumNames": [
    //                     "单选",
    //                     "多选",
    //                     "文本"
    //                   ],
    //                   "hidden": false,
    //                   "readonly": false,
    //                   "default": "blank",
    //                   "enum": [
    //                     "single",
    //                     "multi",
    //                     "blank"
    //                   ]
    //                 },
    //                 "option_group": {
    //                   "type": "string",
    //                   "title": "下拉选项",
    //                   "hidden": false,
    //                   "readonly": false
    //                 },
    //                 "data_type": {
    //                   "type": "string",
    //                   "title": "数据类型",
    //                   "enumNames": [
    //                     "字符型",
    //                     "日期型",
    //                     "整数型",
    //                     "数值型",
    //                     "布尔型",
    //                     "附件型"
    //                   ],
    //                   "hidden": false,
    //                   "readonly": true,
    //                   "enum": [
    //                     "string",
    //                     "date",
    //                     "integer",
    //                     "number",
    //                     "boolean",
    //                     "file"
    //                   ]
    //                 },
    //                 "is_required": {
    //                   "title": "必填场景",
    //                   "$ref": "#/definitions/scenarios",
    //                   "uniqueItems": true
    //                 },
    //                 "invisible": {
    //                   "title": "是否可见",
    //                   "$ref": "#/definitions/scenarios",
    //                   "uniqueItems": true
    //                 },
    //                 "hidden": {
    //                   "title": "是否隐藏",
    //                   "$ref": "#/definitions/scenarios",
    //                   "uniqueItems": true
    //                 },
    //                 "readonly": {
    //                   "title": "是否只读",
    //                   "$ref": "#/definitions/scenarios",
    //                   "uniqueItems": true
    //                 },
    //                 "disabled": {
    //                   "type": "boolean",
    //                   "title": "是否停用",
    //                   "default": false
    //                 }
    //               }
    //             },
    //             "validate": {
    //               "type": "object",
    //               "title": "校验规则",
    //               "titleLevel": 5,
    //               "required": [],
    //               "properties": {
    //                 "maximum": {
    //                   "type": "integer",
    //                   "title": "最大值",
    //                   "default": 1000000
    //                 },
    //                 "minimum": {
    //                   "type": "integer",
    //                   "title": "最小值",
    //                   "default": 0
    //                 },
    //                 "pattern": {
    //                   "type": "string",
    //                   "title": "正则表达式",
    //                   "hidden": false,
    //                   "readonly": false,
    //                   "default": ""
    //                 },
    //                 "format": {
    //                   "type": "string",
    //                   "title": "时间格式",
    //                   "enumNames": [
    //                     "年/月/日 时:分",
    //                     "年/月/日"
    //                   ],
    //                   "hidden": false,
    //                   "readonly": false,
    //                   "default": "date-time",
    //                   "enum": [
    //                     "date-time",
    //                     "date"
    //                   ]
    //                 },
    //                 "maxLength": {
    //                   "type": "integer",
    //                   "title": "最大长度",
    //                   "default": 1000000
    //                 },
    //                 "minLength": {
    //                   "type": "integer",
    //                   "title": "最小长度",
    //                   "default": 1
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     },
    //     "layout": {
    //       "type": "object",
    //       "properties": {
    //         "layout": {
    //           "type": "string",
    //           "title": "分组布局",
    //           "enumNames": [
    //             "默认",
    //             "标签",
    //             "水平",
    //             "折叠"
    //           ],
    //           "hidden": false,
    //           "readonly": false,
    //           "default": "Simple",
    //           "enum": [
    //             "Simple",
    //             "Tabs",
    //             "Horizontal",
    //             "Collapse"
    //           ]
    //         }
    //       }
    //     },
    //     "scenarios": {
    //       "type": "array",
    //       "items": {
    //         "type": "string",
    //         "enumNames": [
    //           "创建",
    //           "更新",
    //           "查看",
    //           "列表"
    //         ],
    //         "hidden": false,
    //         "readonly": false,
    //         "enum": [
    //           "create",
    //           "update",
    //           "view",
    //           "list"
    //         ]
    //       }
    //     }
    //   },
    //   "type": "object",
    //   "title": "自定义表单",
    //   "titleLevel": "form",
    //   "layout": "Tabs",
    //   "properties": {
    //     "form": {
    //       "type": "object",
    //       "title": "表单设置",
    //       "titleLevel": 10,
    //       "required": [],
    //       "layout": "Simple",
    //       "properties": {
    //         "form_title": {
    //           "title": "表单标题",
    //           "$ref": "#/definitions/title"
    //         },
    //         "form_layout": {
    //           "title": "表单布局",
    //           "$ref": "#/definitions/layout"
    //         }
    //       }
    //     },
    //     "db_fields": {
    //       "type": "array",
    //       "title": "保留字段",
    //       "items": [
    //         {
    //           "$ref": "#/definitions/db_field_item"
    //         },
    //         {
    //           "$ref": "#/definitions/db_field_item"
    //         },
    //         {
    //           "$ref": "#/definitions/db_field_item"
    //         },
    //         {
    //           "$ref": "#/definitions/db_field_item"
    //         },
    //         {
    //           "$ref": "#/definitions/db_field_item"
    //         },
    //         {
    //           "$ref": "#/definitions/db_field_item"
    //         }
    //       ]
    //     },
    //     "fields": {
    //       "type": "array",
    //       "title": "自定义字段",
    //       "items": {
    //         "$ref": "#/definitions/field_item"
    //       }
    //     },
    //     "groups": {
    //       "type": "array",
    //       "title": "自定义分组",
    //       "items": {
    //         "$ref": "#/definitions/group_item"
    //       }
    //     }
    //   }
    // }

    return (
      <div>
        <Container {...this.props}>
          <Row className="item-title">
            <Col span="24">
              <h1 className="title">设置自定义表单</h1>
            </Col>
          </Row>
          <div style={{ padding: 20, background: 'white' }}>
            <AntdForm
              formData={formData}
              schema={schema}
              onChange={this.onChange}
              onSubmit={this.submit}
              onSelect={this.onSelect}
              children={button} />
          </div>
          <Modal
            title={"表单预览"}
            visible={this.state._genVisible}
            onOk={this.hideModal}
            onCancel={this.hideModal}
          >
            <AntdForm2 schema={_genSchema} uiSchema={_genUiSchema} />
          </Modal>
        </Container>
      </div>
    )
  }
}


const AntdForm = Form.create()(JsonForm)
const AntdForm2 = Form.create()(JsonForm)

export default CustomerFieldConfig
