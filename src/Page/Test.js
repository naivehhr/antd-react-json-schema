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
import { makeTreeDataBase, processRely } from "../Util"
import { message, Form, Radio } from "antd"
import _ from "lodash"
import ReactJson from "react-json-view"

import {
  defaultSchema,
  relativeSchema,
  arraySchema,
  errorSchema,
  asyncErrorSchema,
  tabsLayoutSchema
} from "./SchemaConfig"
const RadioGroup = Radio.Group

const SCHEMA = {
  1: defaultSchema,
  2: relativeSchema,
  3: arraySchema,
  4: errorSchema,
  5: asyncErrorSchema,
  6: tabsLayoutSchema
}
export default class Test extends Component {
  constructor() {
    super()
    this.state = {
      schema: asyncErrorSchema,
      formData: {},
      uiSchema: {},
      value: 1
    }
  }

  componentWillUpdate(nextProps, nextState) {
    processRely(nextState)
  }

  componentDidMount() {
    const { schema } = this.state
    let treeData = makeTreeDataBase(schema)
    _.set(schema, "definitions.treeData.treeData", treeData)
    this.setState({ schema })
  }

  // processRely = state => {
  //   const { schema, formData } = state || this.state
  //   Object.keys(schema.relation).forEach(key => {
  //     let sourceObj = _.get(schema, this.makeIdStrById(key.split("."))) //源对像
  //     let { rely, invalidHidden } = schema.relation[key]
  //     let keys = Object.keys(rely) || [] //被关联的所有key
  //     let result = true
  //     for (let i = 0, len = keys.length; i < len && result; i++) {
  //       let key = keys[i], //被关联的key
  //         targetValue = _.get(relativeFormData, key), //被关联的值
  //         valueArr = rely[key] || [] //关联条件值列表
  //       //console.log(valueArr, targetValue, valueArr.indexOf(targetValue))
  //       if (valueArr.indexOf(targetValue) > -1) {
  //         //有效
  //       } else {
  //         //无效
  //         result = false
  //       }
  //     }
  //     if (result) {
  //       //有效
  //       sourceObj.hidden = false
  //     } else {
  //       //无效
  //       sourceObj.hidden = true && invalidHidden
  //     }
  //   })
  // }

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

  handleChange = ({ updated_src }) => this.setState({ schema: updated_src })

  handleRadioChange = e =>
    this.setState({ schema: SCHEMA[e.target.value], value: e.target.value })

  render() {
    const { formData, schema } = this.state
    console.log("formData", formData)
    return (
      <Container>
        <div
          style={{
            display: "flex",
            width: 1000,
            justifyContent: "center",
            marginBottom: 50
          }}
        >
          <RadioGroup
            onChange={this.handleRadioChange}
            value={this.state.value}
          >
            <Radio value={1}>defaultSchema</Radio>
            <Radio value={2}>ArraySchema</Radio>
            <Radio value={3}>RelativeSchema</Radio>
            <Radio value={4}>ErrorSchema</Radio>
            <Radio value={5}>AsyncErrorSchema</Radio>
            <Radio value={6}>TabsLayoutSchema</Radio>
          </RadioGroup>
        </div>
        <div
          style={{
            display: "flex",
            width: 1000,
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              minWidth: 400,
              marginRight: 50
            }}
          >
            <p style={{fontSize: 20, marginBottom: 10}}>Schema</p>
            <ReactJson
              src={schema}
              theme="bright:inverted"
              displayDataTypes={false}
              onEdit={this.handleChange}
              onAdd={this.handleChange}
              onDelete={this.handleChange}
            />
          </div>
          <div>
            <ReactJsonForm
              {...this.props}
              schema={schema}
              formData={formData}
              onChange={this.onChange}
              onSubmit={this.onSubmit}
              onSelect={this.onSelect}
            />
          </div>
        </div>
      </Container>
    )
  }
}
