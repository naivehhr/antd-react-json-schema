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

import { getSubdivisionList, addSubdivision, converToRangesFrom2D } from 'Ajax'
import ReactJsonForm from "ReactJsonSchema";

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

export class _AddTwoDimensionSubdivision extends Component {
    constructor(props) {
        super(props)
        this.state = {
            length: 1,
            list: [],
            formData: {
                "listData": [
                ],
            },
            schema: {
                "type": "object",
                "title": "新建二维细分",
                "layout":"ContainerPadding",
                "properties": {
                    "name": {
                        "type": "string",
                        "title": "名称"
                    },
                    "description": {
                        "type": "string",
                        "title": "描述"
                    }
                    ,
                    "selectedSub": {
                        "type": "string",
                        "title": "已选细分",
                        "format": "group-select",
                        "selcompFormSchema": {},
                        "selcompFormData": {}
                    },
                    "listData": {
                        "type": "array",
                        "title": "细分列表",
                        "titleLevel": "two",
                        "items": {
                            "type": "object",
                            "title": "",
                            "layout": "Horizontal",
                            "properties": {
                                "name": {
                                    "title": "", //分段名称
                                    "type": "string",
                                },
                                "range": {
                                    "title": "", //范围
                                    "type": "string",
                                    "readonly": true
                                }
                            },
                        }
                    }
                },
                "required": [
                    "name",
                    "description",
                    "selectedSub"
                ]
            },
            uiSchema: {
                "listData": {
                    "ui:options": {
                        "addable": false,
                        "orderable": false,
                        "removable": false
                    }
                }
            }
        }
    }
    fetchData = async () => {
        const list = (await getSubdivisionList()).data.filter(_ => _.data.type === 'OneDimension')
        // console.log(list)
        this.setState({ list }, () => {
            this.makeSchema()
        })
    }

    makeSchema = () => {
        const { list } = this.state
        // console.log(list)
        let enumData = list.map(item => item.data.name)
        let selcompFormSchema = {
            "type": "object",
            "title": "选择细分",
            "titleLevel": '0',
            "properties": {
                "multipleChoicesList": {
                    "type": "array",
                    "title": "",
                    "maxLength": 2,
                    "minLength": 1,
                    "column": '2',
                    "items": {
                        "type": "string",
                        "enum": enumData
                    },
                }
            }
        }
        let { schema } = this.state
        let newSchema = _.cloneDeep(schema)
        let str = 'properties.selectedSub.selcompFormSchema'
        _.set(newSchema, str, selcompFormSchema)
        // console.log('newSchema', newSchema)
        this.setState({ schema: newSchema })
    }

    close = () => {
        message.success('添加成功')
        setTimeout(() => {
            hashHistory.go(-1)
        }, 200)
    }
    goBack = async () => {
        if (await promiseConfirm({ title: '警告', content: '是否需要放弃编辑？所有编辑无法保存' })) {
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
        const { name, description, segments, variable } = getFieldsValue()
        const errors = getFieldsError()
        console.log(variable)
        if (getErrorNum(errors)) {
            return null
        }
        const [v1, v2] = variable
        const variableX = v1.data.variable
        const variableY = v2.data.variable
        
        const result = await addSubdivision({ name, description, segments, type, variableX, variableY, })
        return
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
        const [idX, idY] = e.map(_ => _.id)
        const { data } = await converToRangesFrom2D({ idX, idY })
        this.setState({
            length: data.length
        }, () => {
            this.props.form.setFieldsValue({
                segments: data
            })
        })
    }

    onSubmit = async (e) => {
        console.log(e)
        let selectedSub = e.selectedSub.split(',')
        // console.log('selectedSub', selectedSub)
        const { list } = this.state
        const type = 'TwoDimension'
        const idArr = selectedSub.map(item => {
            return _.findIndex(list, (i) => {
                return i.data.name == item
            })
        })
        const [idX, idY] = idArr.map(i => list[i].id)
        const [x, y] = idArr.map(i => list[i])
        const variableX = x.data.variable
        const variableY = y.data.variable
        let subData = {
            "name": e.name,
            "description": e.description,
            "segments": e.listData,
            "type": type,
            "variableX": variableX,
            "variableY": variableY
        }
        const result = await addSubdivision(subData)
        if (result.code === 200) {
            this.close()
        }
    }

    onChange = (e) => {
        this.setState({
			formData: e
		})
    }
    
    onSelect = async (e, idStr) => {
        // console.log('onSelect e', e)
        // console.log('onSelect idStr', idStr) 
        // if (!idStr) return
        if (!idStr) {
            console.error('id str error')
            return false
        }
        let selectedSub = e.split(',')
        // console.log('selectedSub', selectedSub)
        //自定义校验
        if(!selectedSub || selectedSub.length != 2) {
            message.warning(`请选择2项`)
            return false
        }
        const { list, schema } = this.state
        const _idArr = selectedSub.map(item => {
            return _.findIndex(list, (i) => {
                return i.data.name == item
            })
        })
        const [idX, idY] = _idArr.map(i => list[i].id)
        const { data } = await converToRangesFrom2D({ idX, idY })
        // console.log('data', data)
        const { formData } = this.state
        let newFormData = _.cloneDeep(formData)
        newFormData.selectedSub = e
        newFormData.listData = data
        // console.log('newFormData', newFormData)

        let idArr = idStr.split('.') // 更新selcompFormData
        idArr.splice(0, 0, 'properties');
        idArr.splice(idArr.length - 1, 0, 'selcompFormData');

        let tArr = idStr.split('.')
        // debugger
        let idArr2 = tArr.slice(0, 1) // 清空selcompFormData
        idArr2.splice(0, 0, 'properties');
        idArr2.splice(idArr.length, 0, 'selcompFormData');

        let newschema = _.cloneDeep(schema)
        _.set(newschema, `${idArr2.join('.')}`, {}) // 清空selcompFormData
        _.set(newschema, `${idArr.join('.')}`, e.split(',')) // 设置selcompFormData
        // console.log('newschema', newschema)
        this.setState({formData: newFormData, schema: newschema})
        return true
    }

    dd = async () => {
        let c = [1,2,3,4]
        let ddd = c.map(async (i) => {
            // console.log('fire')
            // let c = await getSubdivisionList()
            // console.log('fire down', c)
            return new Promise((resolve, reject) => {
                let ddds = getSubdivisionList()
                resolve(ddds);
            })
        })

        ddd.map(i => {
            i.then((d)=>{
                console.log('ddd', d)
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
                {
                    validator: (field, value = [], cb) => {
                        if (value.length !== 2) {
                            cb('请选择两个一维细分')
                        } else {
                            cb()
                        }
                    }
                },
                { required: true, message: "必填" },
            ],
        })
        const segmentProps = i => key => getFieldDecorator(`segments[${i}][${key}]`, {
            rules: [
                { required: true, whitespace: true, message: `请填写第${i + 1}条细分的${key === 'name' ? '细分名称' : '取值范围'}` },
            ],
        })
        const { schema, formData, uiSchema } = this.state
        return (
            <Container {...this.props}>
                <AntdForm
                    schema={schema}
                    formData={formData}
                    onSubmit={this.onSubmit}
                    onChange={this.onChange}
                    onSelect={this.onSelect}
                    uiSchema={uiSchema}
                />
            </Container>
        )
        return <Container {...this.props}>
            <div className="admin-content">
                <Row className='item-title'>
                    <Col span="24">
                        <h1 className="title">新建二维细分</h1>
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
                                nameProps(<Input placeholder="请输入名称" style={modalInputStyle} />)
                            }
                        </FormItem>
                        <FormItem label='描述' hasFeedback>
                            {
                                descriptionProps(<Input placeholder="请输入描述" style={modalInputStyle} />)
                            }
                        </FormItem>
                        <FormItem label='已选细分' hasFeedback>
                            {
                                variableProps(<DsSelect list={list} validatorChange={this.validatorChange} />)
                            }
                        </FormItem>
                    </Col>
                </Row>
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
                                        segmentProps(i)('range')(<Input placeholder='请输入范围' disabled />)
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
const AntdForm = Form.create()(ReactJsonForm)


export const AddTwoDimensionSubdivision = Form.create()(_AddTwoDimensionSubdivision)
