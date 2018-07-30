/*
 * @Author: aran.hu 
 * @Date: 2018-01-30 16:32:59 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2018-03-05 14:11:20
 */
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Select, Form, Tooltip, Input } from "antd";
const FormItem = Form.Item;
const Option = Select.Option;
import { Link } from "react-router";
import { connect } from "react-redux";

import { getErrorMsg } from "../antd/utils";
import { formItemLayout } from "../antd/constant";

/**
|--------------------------------------------------
| 异步请求接口，显示接口返回的信息
|--------------------------------------------------
*/
class AsyncTextWidget extends Component {
  state = {
    moreView: null
  };

  _onChange = event => {
    const { onChange, id } = this.props;
    onChange &&
      onChange(event.target.value ? event.target.value : undefined, id);
  };

  _onBlur = async event => {
    const { id, schema, sysconfig } = this.props;
    console.log("schema", schema);
    if (schema.option.source_api) {
      // let arr = id.split('.')
      // arr.pop()
      // arr.push(schema.asyncSourceId)
      // let targetID = arr.join('.')
      // let apiSource = document.getElementById(targetID).value
      // console.log('apiSource', apiSource)
      // if (!apiSource) {
      // 	throw 'apiSource not config'
      // 	return
      // }
      // sysconfig.fetch('www.baidu.com')
      let result = await this.getAsyncText(); // result
      console.log("result", result);
      let v = (
        <div
          style={{
            position: "absolute",
            right: "-35%",
            top: 0,
            lineHeight: "40px",
            color: "red"
          }}
        >
          {result}
        </div>
      );
      this.setState({ moreView: v });
    } else {
      throw "The AsyncTextWidget required a source_api";
    }
  };

  // getAsyncText = async () => {}
  getAsyncText = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("此号码已经注册");
      }, 500);
    });
  };

  render() {
    const { moreView } = this.state;
    const {
      id,
      value,
      schema,
      readonly,
      label,
      help,
      errors,
      required,
      placeholder
    } = this.props;
    let errMsg = getErrorMsg(errors)(id);
    let validateStatus;
    if (errMsg) {
      validateStatus = "error";
    } else if (!errMsg && value) {
      validateStatus = "success";
    } else {
      validateStatus = "success";
    }
    return (
      <FormItem
        colon={false}
        required={required}
        label={label}
        validateStatus={validateStatus}
        help={errMsg || help}
        {...formItemLayout}
        className="form-item"
      >
        <Tooltip title={value}>
          <Input
            id={id}
            onChange={this._onChange}
            onBlur={this._onBlur}
            placeholder={placeholder}
            value={value}
            disabled={readonly}
          />
          {moreView}
        </Tooltip>
      </FormItem>
    );
  }
}
const mapStateToProps = state => {
  return {
    sysconfig: state.sysconfig
  };
};

export default connect(mapStateToProps)(AsyncTextWidget);
