import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Row, Col, Form, Icon, Button, Input, Tooltip } from 'antd';
import { getErrorMsg } from './utils'
import { formItemLayout } from './constant'
import { _format } from '../../../../Util'
const FormItem = Form.Item

class AntdDataUrlWidget extends React.Component {
    addNameToDataURL(dataURL, name) {
        return dataURL.replace(";base64", `;name=${name};base64`);
    }

    processFile(file) {
        let promise = new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = event => {
                resolve({
                    dataURL: this.addNameToDataURL(event.target.result, file.name)
                });
            };
            reader.onerror = event => {
                resolve({
                    error: '文件解析错误'
                });
            };
            reader.readAsDataURL(file);
        });
        return promise.then((resp) => {
            return resp;
        });
    }

    onFileChange = async (event) => {
        let file = event.target.files[0];
        if (file == null) return;
        let resp = await this.processFile(file);
        if (resp.error != null) {
            message.error(resp.error);
        }
        this.props.onChange(resp.dataURL, this.props.id);
    }

    render() {
        const {
            id,
            value,
            readonly,
            schema,
            label,
            required,
            errors,
            help,
            placeholder
        } = this.props;

        let validateStatus
        let errMsg = getErrorMsg(errors)(id)
        if (errMsg) {
            validateStatus = 'error'
        } else if (!errMsg && value) {
            validateStatus = 'success'
        } else {
            validateStatus = 'success'
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
                {
                    readonly ?
                    (<font className="">{(value == null || value == "" ? "未上传" : "已上传")}</font>)
                    :
                    (
                        <Button className="fileselector">
                            <input
                                className="fileselectorinput"
                                type="file"
                                onChange={this.onFileChange.bind(this)}
                            />
                            <Icon type="upload" /> 上传
                        </Button>
                    )
                }
                {
                    readonly ?
                    null
                    :
                    (
                        <font className="">{(value == null || value == "" ? "" : "   已选择")}</font>
                    )
                }
            </FormItem>
        )
    }
}

export default AntdDataUrlWidget;
