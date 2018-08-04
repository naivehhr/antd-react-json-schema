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
import { makeTreeDataBase, processRely } from "../Util";
import { message, Form, Radio } from "antd";
import _ from "lodash";
import ReactJson from "react-json-view";

import {
  defaultSchema,
  relativeSchema,
  arraySchema,
  errorSchema,
  asyncErrorSchema,
  tabsLayoutSchema,
  modalsSchema
} from "./SchemaConfig";
const RadioGroup = Radio.Group;

const SCHEMA = {
  1: defaultSchema,
  2: arraySchema,
  3: relativeSchema,
  4: errorSchema,
  5: asyncErrorSchema,
  6: tabsLayoutSchema,
  7: modalsSchema
};
export default class Test extends Component {
  constructor(props) {
    super(props);
    const value = 4;
    const schema = SCHEMA[value];
    this.state = {
      schema: schema,
      formData: schema.formData,
      uiSchema: {},
      value
    };
  }

  componentWillUpdate(nextProps, nextState) {
    processRely(nextState);
  }

  componentDidMount() {
    const { schema } = this.state;
    let treeData = makeTreeDataBase(schema);
    _.set(schema, "definitions.treeData.treeData", treeData);
    this.setState({ schema });
  }

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
    // console.log("submit", callback);
    let formError = {
      jibenitem1: {
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
    };
    let data = { formError };
    callback(data);
  };

  onSelect = data => {
    console.log("123", data);
  };

  handleChange = ({ updated_src }) => this.setState({ schema: updated_src });

  handleRadioChange = e => {
    const { value } = e.target;
    this.setState({
      schema: SCHEMA[value],
      formData: SCHEMA[value].formData,
      value
    });
  };

  render() {
    const { formData, schema } = this.state;
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
            <Radio value={1}>default</Radio>
            <Radio value={2}>Array</Radio>
            <Radio value={3}>Relative</Radio>
            <Radio value={4}>Error</Radio>
            <Radio value={5}>AsyncError</Radio>
            <Radio value={6}>TabsLayout</Radio>
            <Radio value={7}>Modal</Radio>
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
            <p style={{ fontSize: 20, marginBottom: 10 }}>Schema</p>
            <ReactJson
              src={schema}
              theme="bright:inverted"
              displayDataTypes={false}
              onEdit={this.handleChange}
              onAdd={this.handleChange}
              onDelete={this.handleChange}
            />
          </div>
          <div
            style={{
              minWidth: 400,
              marginRight: 50
            }}
          >
            <p style={{ fontSize: 20, marginBottom: 10 }}>FormData</p>
            <ReactJson
              src={formData}
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
    );
  }
}
