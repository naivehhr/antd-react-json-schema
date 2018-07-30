import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal, Tooltip
} from 'antd'

import Container from 'Page/Container'

import { getErrorNum, endErrorsToAntdErrors, promiseConfirm } from 'Util'
import { modalInputStyle } from 'Setting'

import DsSelect from 'Component/DsSelect'

import { getSubdivisionList, updateSubdivision, converToRangesFrom2D, getSubdivision } from 'Ajax'

const voidList = { name: '', range: '' }

export const formItemLayout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 10 },
}

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const RadioGroup = Radio.Group

export class _UpdateTwoDimensionSubdivision extends Component {
    constructor(props) {
        super(props)
        this.id = props.routeParams.id
        this.state = {
            length: 1
        }
    }
    fetchData = async () => {
        const {data: {name, description, variableX, variableY, segments}} = (await getSubdivision({id: this.id})).data
        this.variableX = variableX
        this.variableY = variableY
        this.setState({
            length: segments.length,
        }, () => {
            this.props.form.setFieldsValue({
                name,
                description,
                segments,
            })
        })
    }
    close = () => {
        message.success('修改成功')
        setTimeout(() => {
            hashHistory.go(-1)
        }, 200)
    }
    goBack = async () => {
        if (await promiseConfirm({title: '警告', content: '是否需要放弃编辑？所有编辑无法保存'})) {
            hashHistory.go(-1)
        }
    }
    componentDidMount() {
        this.props.form.setFieldsValue({
            variable: []
        })
        this.fetchData()
    }
    add = i => () => {
        let { length } = this.state
        let list = this.props.form.getFieldValue('segments').concat([])
        list.splice(i + 1, 0, voidList)
        this.setState({
            length: length + 1
        }, () => {
            this.props.form.setFieldsValue({
                segments: list
            })
        })
    }
    del = i => () => {
        console.log(i, 'del')
        let { length } = this.state
        let list = this.props.form.getFieldValue('segments')
        if (list.length <= 1) {
            message.error('最少要有一条细分')
            return null
        }
        list.splice(i, 1)
        this.props.form.setFieldsValue({
            segments: list
        })
        this.setState({
            length: length - 1
        })
    }
    sub = async () => {
        const type = 'TwoDimension'
        const { getFieldsError, validateFields, getFieldsValue, setFields, getFieldValue } = this.props.form
        validateFields()
        const { name, description, segments, } = getFieldsValue()
        const { id, variableX, variableY } = this
        const result = await updateSubdivision({id, data: {name, description, segments, type, variableX, variableY}})
        if (result.code === 200) {
            this.close()
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
    validatorChange = async e => {
        if (e.length !== 2) {
            return null
        }
        const  [idX, idY] = e.map(_ => _.id)
        const { data } = await converToRangesFrom2D({idX, idY})
        this.setState({
            length: data.length
        }, () => {
            this.props.form.setFieldsValue({
                segments: data.map(range => ({name: '', range}))
            })
        })
    }
    render() {
        const { title } = this.props
        const { length, list } = this.state
        const { getFieldDecorator, getFieldError, isFieldValidating, getFieldsValue } = this.props.form
        const nameProps = getFieldDecorator('name', {
            rules: [
                { required: true, whitespace: true, message: '请输入细分名称' },
            ],
        })
        const descriptionProps = getFieldDecorator('description', {
            rules: [
                { required: true, whitespace: true, message: '请输入描述' },
            ],
        })
        const variableProps = getFieldDecorator('variable', {
            rules: [
                { validator: (field, value = [], cb) => {
                    if (value.length !== 2) {
                        cb('请选择两个一维细分')
                    } else {
                        cb()
                    }
                }},
                { required: true },
            ],
        })
        const segmentProps = i => key => getFieldDecorator(`segments[${i}][${key}]`, {
            rules: [
                { required: true, whitespace: true, message: `请填写第${i + 1}条细分的${key === 'name' ? '细分名称' : '取值范围'}` },
            ],
        })
        return <Container {...this.props}>
            <div className="admin-content">
                <Row className='item-title'>
                    <Col span="24">
                        <h1 className="title">修改二维细分</h1>
                        <div className="btn-box">
                            <Button onClick={this.goBack}>取消</Button>
                            <Button type="primary" style={{ marginLeft: 25 }} onClick={this.sub}>保存并退出</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span="10">
                        <FormItem label='名称' hasFeedback>
                            {
                                nameProps(<Input placeholder="" style={modalInputStyle} />)
                            }
                        </FormItem>
                        <FormItem label='描述' hasFeedback>
                            {
                                descriptionProps(<Input placeholder="" style={modalInputStyle} />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                
                {/* <FormItem label='已选细分' hasFeedback>
                    {
                        variableProps(<DsSelect list={list} validatorChange={this.validatorChange} buttonView={false} />)
                    }
                </FormItem> */}
                <FormItem label='细分列表' required={true}>
                </FormItem>
                <div>
                    {
                        [...'1'.repeat(length)].map((_, i) => <div key={i}>
                            <div style={{ width: '200', display: 'inline-block', verticalAlign: 'middle' }}>
                                <FormItem hasFeedback>
                                    {
                                        segmentProps(i)('name')(<Input placeholder='请输入名称' />)
                                    }
                                </FormItem>
                            </div>
                            <div style={{ width: '200', marginLeft: 8, display: 'inline-block', verticalAlign: 'middle' }}>
                                <FormItem label='' hasFeedback>
                                    {
                                        segmentProps(i)('range')(<Input disabled placeholder='请输入范围' />)
                                    }
                                </FormItem>
                            </div>
                        </div>)
                    }
                </div>
            </div>
        </Container>
    }
}


export const UpdateTwoDimensionSubdivision = Form.create()(_UpdateTwoDimensionSubdivision)
