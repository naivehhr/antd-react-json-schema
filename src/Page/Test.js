/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-14 17:11:03
 */

import React, { Component } from "react"
import { getCreactCustomerSchema, addCustomer } from "Ajax"
import CreateComponent from "Component/CreateComponent"
import Container from "Page/Container"
import ReactJsonForm from "ReactJsonSchema"
import { makeTreeDataBase } from "../Util"
import { message, Form } from "antd"
import _ from "lodash"
import {
  defaultSchema,
  relativeSchema,
  arraySchema,
  errorSchema,
  asyncErrorSchema
} from "./SchemaConfig"

export default class Test extends Component {
  constructor() {
    super()
    this.state = {
      schema: defaultSchema,
      formData: {},
      uiSchema: {}
    }
  }

  componentWillUpdate(nextProps, nextState) {
    this.processRely(nextState)
  }

  componentDidMount() {
    const { schema } = this.state
    let treeData = makeTreeDataBase(schema)
    _.set(schema, "definitions.treeData.treeData", treeData)
    this.setState({ schema })
  }

  processRely = state => {
    const { schema, formData } = state || this.state
    Object.keys(schema.relation).forEach(key => {
      let sourceObj = _.get(schema, this.makeIdStrById(key.split("."))) //源对像
      let { rely, invalidHidden } = schema.relation[key]
      let keys = Object.keys(rely) || [] //被关联的所有key
      let result = true
      for (let i = 0, len = keys.length; i < len && result; i++) {
        let key = keys[i], //被关联的key
          targetValue = _.get(relativeFormData, key), //被关联的值
          valueArr = rely[key] || [] //关联条件值列表
        //console.log(valueArr, targetValue, valueArr.indexOf(targetValue))
        if (valueArr.indexOf(targetValue) > -1) {
          //有效
        } else {
          //无效
          result = false
        }
      }
      if (result) {
        //有效
        sourceObj.hidden = false
      } else {
        //无效
        sourceObj.hidden = true && invalidHidden
      }
    })
  }

  onChange = (e, id) => {
    this.setState({
      formData: e,
      relativeFormData: e
    })
  }

  makeIdStrById = idArr => {
    return `properties.${idArr.join(".properties.")}`
  }

  onSubmit = (e, callback) => {
    // console.log("submit", callback);
    let formError = {
      jibenitem: {
        hy: {
          __errors: [
            {
              hy: ["错误信息1", "错误信息2"]
            }
          ]
        },
        hz: {
          __errors: [{ hz: "韧性最强的男人" }]
        },
        pkq: {
          __errors: [{ pkq: "我不叫皮卡丘" }]
        }
      }
    }
    let data = { formError }
    callback(data)
  }

  onSelect = data => {
    console.log("123", data)
  }
  render() {
    const { formData, schema } = this.state
    return (
      <Container>
        <ReactJsonForm
          {...this.props}
          schema={schema}
          formData={formData}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          onSelect={this.onSelect}
        />
      </Container>
    )
  }
}
