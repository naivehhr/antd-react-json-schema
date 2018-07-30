import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal
} from 'antd'

import { getErrorNum, endErrorsToAntdErrors } from 'Util'

import { formItemLayout, modalInputStyle, customerDefaultSegments } from 'Setting'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const RadioGroup = Radio.Group

export class UpdateCustomDimensionSubdivision extends Component {
    constructor(props) {
        super(props)
    }
    submit = async () => {
        const type = 'Custom'
        const { submitForm, close } = this.props
        const { getFieldsError, validateFields, getFieldsValue, setFields, getFieldValue } = this.props.form
        validateFields()
        const values = getFieldsValue()
        const errors = getFieldsError()
        const id = this.props.id
        if (getErrorNum(errors)) {
            return null
        }
        const result = await submitForm({data:{ ...values, ...customerDefaultSegments, type},id})
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
    render() {
        const { title } = this.props
        const { getFieldDecorator, getFieldError, isFieldValidating, getFieldsValue } = this.props.form
        const keyProps = getFieldDecorator('name', {
            rules: [
                { required: true, message: '请填写名称' },
            ],
        });

        const descriptionProps = getFieldDecorator('description', {
            rules: [
                { required: true, whitespace: true, message: '请填写描述' },
            ],
        })

        const exprProps = getFieldDecorator('expr', {
            rules: [
                { required: true, whitespace: true, message: '请填写表达式' },
            ],
        })
        return <Modal title={title || '衍生变量'} visible={true} onOk={this.submit} onCancel={this.props.close}>
            <FormItem label='名称' {...formItemLayout} hasFeedback>
                {
                    keyProps(<Input placeholder="名称" style={modalInputStyle} />)
                }
            </FormItem>
            <FormItem label='描述' {...formItemLayout} hasFeedback>
                {
                    descriptionProps(<Input placeholder="描述" style={modalInputStyle} />)
                }
            </FormItem>
            <FormItem label='表达式' {...formItemLayout} hasFeedback>
                {
                    exprProps(<Input placeholder="表达式" style={modalInputStyle} />)
                }
            </FormItem>
        </Modal>
    }
}

