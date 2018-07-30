/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-14 17:11:03
 */

import React, { Component } from "react";
import { getCreactCustomerSchema, addCustomer } from "Ajax";
import CreateComponent from "Component/CreateComponent";
import Container from "Page/Container";
import ReactJsonForm from "ReactJsonSchema";
import { makeTreeDataBase } from "../Util";
import { message, Form } from "antd";
import _ from "lodash";

export default class Test extends Component {
  constructor() {
    super();
    this.state = {
      formData: null,
      relativeFormData: {},
      relativeSchema: {
        type: "object",
        title: "测试关联Schema",
        titleLevel: "form",
        layout: "ContainerPadding",
        properties: {
          jibenitem: {
            type: "object",
            title: "基本信息",
            titleLevel: "one",
            layout: "Simple",
            properties: {
              is_three_certificate_unit: {
                type: "boolean",
                title: "是否三证合一"
              },
              isUnitInput: {
                type: "string",
                title: "营业执照注册号",
                hidden: false
              },
              isUnitInput1: {
                type: "string",
                title: "营业执照到期日",
                hidden: false
              },
              isUnitInput2: {
                type: "string",
                title: "组织机构代码",
                hidden: false
              },
              unUnitInput: {
                type: "string",
                title: "统一社会信用代码",
                hidden: false
              },
              unUnitInput1: {
                type: "string",
                title: "营业执照到期日",
                hidden: false
              },
              ysblLabel: {
                type: "array",
                title: "array关联测试",
                itemsExclude: true,
                items: {
                  type: "string",
                  enum: ["foo", "bar"]
                }
              },
              aa: {
                type: "string",
                title: "aaaaaaaaaaa",
                hidden: false
              },
              bb: {
                type: "string",
                title: "bbbbbbbbbbb",
                hidden: false
              }
            },
            required: []
          }
        },
        relation: {
          "jibenitem.isUnitInput": {
            rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
            invalidHidden: true
          },
          "jibenitem.isUnitInput1": {
            rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
            invalidHidden: true
          },
          "jibenitem.isUnitInput2": {
            rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
            invalidHidden: true
          },
          "jibenitem.unUnitInput": {
            rely: { "jibenitem.is_three_certificate_unit": [false] },
            invalidHidden: true
          },
          "jibenitem.unUnitInput1": {
            rely: { "jibenitem.is_three_certificate_unit": [false] },
            invalidHidden: true
          },
          "jibenitem.aa": {
            rely: { "jibenitem.ysblLabel": ["foo"] },
            invalidHidden: true
          },
          "jibenitem.bb": {
            rely: { "jibenitem.ysblLabel": ["bar"] },
            invalidHidden: true
          }
        }
      },
      definitions: {
        treeData: {}
      }
    };
  }

  componentWillUpdate(nextProps, nextState) {
    this.processRely(nextState);
  }

  componentDidMount() {
    const { relativeSchema } = this.state;
    let treeData = makeTreeDataBase(relativeSchema);
    _.set(relativeSchema, "definitions.treeData.treeData", treeData);
    this.setState({ relativeSchema });
  }

  processRely = state => {
    const { relativeSchema, relativeFormData } = state || this.state;

    Object.keys(relativeSchema.relation).forEach(key => {
      let sourceObj = _.get(relativeSchema, this.makeIdStrById(key.split("."))); //源对像
      let { rely, invalidHidden } = relativeSchema.relation[key];
      let keys = Object.keys(rely) || []; //被关联的所有key
      let result = true;
      for (let i = 0, len = keys.length; i < len && result; i++) {
        let key = keys[i], //被关联的key
          targetValue = _.get(relativeFormData, key), //被关联的值
          valueArr = rely[key] || []; //关联条件值列表
        //console.log(valueArr, targetValue, valueArr.indexOf(targetValue))
        if (valueArr.indexOf(targetValue) > -1) {
          //有效
        } else {
          //无效
          result = false;
        }
      }
      if (result) {
        //有效
        sourceObj.hidden = false;
      } else {
        //无效
        sourceObj.hidden = true && invalidHidden;
      }
    });
  };

  onChange = (e, id) => {
    this.setState({
      formData: e,
      relativeFormData: e
    });
  };

  makeIdStrById = idArr => {
    return `properties.${idArr.join(".properties.")}`;
  };

  onSubmit = (e, callback) => {
    console.log("submit", callback);
    let formError = {
      jibenitem: {
        customer_name: {
          __errors: [
            {
              customer_name: ["已经注册过了", "123123"]
            }
          ]
        },
        licence_code: {
          __errors: [{ licence_code: "不合适啊" }]
        }
      }
    };
    let data = { formError };
    callback(data);
  };

  onSelect = data => {
    console.log("123", data);
  };
  render() {
    const { formData } = this.state;
    const schema = {
      type: "object",
      title: "注册字段",
      titleLevel: "form",
      relation: {},
      properties: {
        jibenitem: {
          type: "object",
          title: "基本信息",
          titleLevel: "one",
          layout: "Simple",
          properties: {
            id: {
              type: "string",
              title: "客户id",
              readonly: false,
              hidden: true,
              invisible: false,
              disabled: false
            },
            customer_name: {
              type: "string",
              title: "客户名称",
              hidden: false,
              invisible: false,
              disabled: true
            },
            is_thrid_id_unity: {
              type: "boolean",
              title: "是否三证合一",
              readonly: false,
              hidden: false,
              invisible: false,
              disabled: false
            },
            licence_code: {
              type: "string",
              title: "营业执照号码",
              readonly: false,
              hidden: false,
              invisible: false,
              disabled: false,
              help: "help"
            },
            agent_id_type: {
              type: "string",
              title: "代理人证件类型",
              enumNames: [
                "身份证",
                "护照",
                "港澳居民往来大陆通行证",
                "台湾居民往来大陆通行证"
              ],
              readonly: false,
              hidden: false,
              invisible: false,
              disable: false,
              enum: ["ID_CARD", "PASSPORT", "HK_MO_PASS", "TW_PASS"]
            },
            maximum: {
              type: "integer",
              title: "最大值",
              minimum: 42,
              maximum: 100
            }
          },
          required: []
        }
      },
      defineTitle: "注册字段"
    };

    const { relativeFormData, relativeSchema } = this.state;
    // console.log(relativeFormData)
    return (
      <Container>
        <ReactJsonForm
          {...this.props}
          schema={relativeSchema}
          formData={relativeFormData}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          onSelect={this.onSelect}
        />
      </Container>
    );
  }
}

const AntdForm = Form.create()(ReactJsonForm);
