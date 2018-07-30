import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Input, Tooltip, Modal } from "antd";
import { getErrorMsg } from "./utils";
import { formItemLayout } from "./constant";
import "./style.scss";

const FormItem = Form.Item;
class AntdImageWidget extends Component {
  state = {
    visible: false,
    modelSrc: null
  };

  showModal(src) {
    this.setState({ modelSrc: src, visible: true });
  }

  render() {
    const {
      id,
      value,
      readonly,
      disabled,
      autofocus,
      onBlur,
      onFocus,
      options,
      schema,
      formContext,
      registry,
      label,
      required,
      onChange,
      errors,
      help,
      placeholder,
      ...inputProps
    } = this.props;
    let validateStatus;
    const imgSrc = "http://img.tuku.cn/file_thumb/201708/m2017082223494495.jpg";
    return (
      <FormItem
        colon={false}
        required={required}
        label={label}
        validateStatus={validateStatus}
        {...formItemLayout}
        className="form-item"
        style={{ display: "flex", alignItems: "flex-start" }}
      >
        <div style={{ paddingTop: "13px", position: "relative" }}>
          <img
            style={{ width: 115, height: 84, cursor: "pointer" }}
            src={imgSrc}
            className="list-img-display"
          />
          <div
            className="list-img-display-mask"
            onClick={this.showModal.bind(this, imgSrc)}
          >
            点击查看
          </div>
        </div>
        <Modal
          className="photo-modal"
          title={label}
          visible={this.state.visible}
          onCancel={() => {
            this.setState({ visible: false });
          }}
          cancelText="取消"
        >
          <img src={this.state.modelSrc} />
        </Modal>
      </FormItem>
    );
  }
}
export default AntdImageWidget;
