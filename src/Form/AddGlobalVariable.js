import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal
} from 'antd'

import { getErrorNum, endErrorsToAntdErrors } from 'Util'
import { formItemLayout, modalInputStyle } from 'Setting'
import ReactJsonForm from "ReactJsonSchema";

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const RadioGroup = Radio.Group

const AntdForm = Form.create()(ReactJsonForm)

export default class AddGlobalVariable extends Component {
    constructor(props) {
        super(props)
    }
    submit = async () => {
        const { submitForm, close } = this.props
        const { getFieldsError, validateFields, getFieldsValue, setFields, getFieldValue } = this.props.form
        validateFields()
        const values = getFieldsValue()
        const errors = getFieldsError()
        if (getErrorNum(errors)) {
            return null
        }
        const result = await submitForm({ ...values, })
        if (result.code === 200) {
            close()
        }
        if (result.code === 1000) {
            let errors = result.errors
            endErrorsToAntdErrors(errors).map(_ => {
                setFields({
                    [_.label]: {
                        errors: _.errors,
                        value: getFieldValue(_.label)
                    }
                })
            })
            return null
        }
    }

    onOk = () => {
        close()
    }

    onSubmit = async (e) => {
        console.log('onSubmit', e)
        const { submitForm, close } = this.props
        const result = await submitForm({ ...e})
        if (result.code === 200) {
            close()
        }
    }

    render() {
        // const { title } = this.props
        // const { getFieldDecorator, getFieldError, isFieldValidating, getFieldsValue } = this.props.form
        // const usageProps = getFieldDecorator('usage', {
        //     rules: [
        //         { required: true, },
        //     ],
        // })

        // const nameProps = getFieldDecorator('key', {
        //     rules: [
        //         { required: true, message: '请填写名称' },
        //     ],
        // })

        // const typeProps = getFieldDecorator('type', {
        //     rules: [
        //         { required: true, whitespace: true, message: '请填写类型' },
        //     ],
        // })

        const schema = {
            "type": "object",
            "title": "新建全局变量",
            "titleLevel": '10',
            "properties": {
                "usage": {
                    "type": "string",
                    "title": "数据源",
                    "enumNames": ["输入变量", "输出变量"],
                    "enum": ["Input", "Output"]
                },
                "key": {
                    "type": "string",
                    "title": "变量名"
                }
                ,
                "type": {
                    "type": "string",
                    "title": "类型",
                    "enumNames": ["字符型", "数值型", "日期型"],
                    "enum": ["String", "Number", "Date"]
                }
            },
            "required": [
                "usage",
                "type",
                "key"
            ]
        }
        return (
            <Modal title={'全局变量'} visible={true} onOk={this.props.close} onCancel={this.props.close} onOk={this.submit} footer={[]}>
                <AntdForm
                    ref="myForm"
                    schema={schema}
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                />
            </Modal>
        )

        // return <Modal title={title || '全局变量'} visible={true} onOk={this.submit} onCancel={this.props.close}>
        //     <FormItem label='数据源' {...formItemLayout} hasFeedback>
        //         {
        //             usageProps(<Select style={modalInputStyle}>
        //                 <Option value="Input">输入变量</Option>
        //                 <Option value="Output">输出变量</Option>
        //             </Select>)
        //         }
        //     </FormItem>
        //     <FormItem label='变量名' {...formItemLayout} hasFeedback>
        //         {
        //             nameProps(<Input placeholder="请输入变量名" style={modalInputStyle} />)
        //         }
        //     </FormItem>
        //     <FormItem label='类型' {...formItemLayout} hasFeedback>
        //         {
        //             typeProps(<Select style={{ width: 200 }} style={modalInputStyle}>
        //                 <Option value="String">字符型</Option>
        //                 <Option value="Number">数值型</Option>
        //                 <Option value="Date">日期型</Option>
        //             </Select>)
        //         }
        //     </FormItem>
        // </Modal>
    }
}
