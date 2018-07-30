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

import VariableSelect from 'Component/VariableSelect'


import { listForScenario, getVariableList, addSubdivision } from 'Ajax'

import CreateComponent from 'Component/CreateComponent'
import ReactJsonForm from "ReactJsonSchema";

import { VariableCategoryMap, VariableTypeMap, pagination } from 'Setting'
import { remapPropsToFields, transfrom } from 'Util'
import _ from 'lodash'


const voidList = { name: '', range: '' }
const transType = transfrom(VariableTypeMap)
const transCategory = transfrom(VariableCategoryMap)
export const formItemLayout = {
    labelCol: { span: 3 }
}

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const RadioGroup = Radio.Group

export class _AddOneDimensionSubdivision extends Component {
    constructor(props) {
        super(props)
        this.state = {
            length: 2,
            list: [],
            uiSchema: {
                "segments": {
                    "ui:options": {
                        "orderable": false,
                        // "removable": false
                        // "addable": false,
                    }
                }
            },
            schema: {
                "type": "object",
                "formTitle": "新建细分",
                "title": "新建一维细分",
                "layout":"ContainerPadding",
                "properties": {
                    "name": {
                        "type": "string",
                        "title": "名称"
                    },
                    "description": {
                        "type": "string",
                        "title": "描述"
                    },
                    "variable": {
                        "type": "string",
                        "title": "变量",
                        "format": "group-select",
                        "selcompFormSchema": {},
                        "selcompFormData": {}
                    },
                    "segments": {
                        "type": "array",
                        "title": "添加分段",
                        "titleLevel": "two",
                        "items": [
                            {
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
                                        "readonly": true,
                                    }
                                },
                                "required": [
                                    "name",
                                    "range",
                                ]

                            }
                        ],
                        "additionalItems": {
                            "title": "",
                            "type": "object",
                            "layout": "Horizontal",
                            "properties": {
                                "name": {
                                    "title": "", //分段名称
                                    "type": "string",
                                    "placeholder": "名称"

                                },
                                "range": {
                                    "title": "", //范围
                                    "type": "string",
                                    "placeholder": "表达式"
                                },
                            },
                            "required": [
                                "name",
                                "range",
                            ]
                        }
                    },
                },
                "required": [
                    "name",
                    "description",
                    "variable",
                ]
            },
            formData: {
                "segments": [
                    { "name": "其他", "range": 'other' }
                ],
            }
        }
    }
    fetchData = async () => {
        const list = (await listForScenario({ objectType: 'Subdivision' })).data
        // console.log(list)
        this.setState({ list }, () => {
            this.props.form.setFieldsValue({
                segments: [
                    voidList,
                    { name: '其他', range: 'other' }
                ]
            })
            let { list } = this.state,
                fmap = {},
                filterOpt = []
            list.map(elem => {
                let { data: { usage } } = elem
                if (!fmap[usage]) {
                    fmap[usage] = true
                    filterOpt.push({
                        tab: transCategory(usage),
                        key: usage
                    })
                }
            })
            // console.log('list', list)
            // console.log('filterOpt', filterOpt)
            this.makeSchema(filterOpt)
        })
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
        if (list.length <= 2) {
            message.error('最少要有2条细分')
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
        const type = 'OneDimension'
        const { getFieldsError, validateFields, getFieldsValue, setFields, getFieldValue } = this.props.form
        validateFields()
        const values = getFieldsValue()
        const errors = getFieldsError()
        if (getErrorNum(errors)) {
            return null
        }
        // console.log(values)
        // return
        const result = await addSubdivision({ ...values, type })
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


    onSubmit = async (e) => {
        const type = 'OneDimension'
        let data = _.cloneDeep(e)
        data.segments.reverse()
        const result = await addSubdivision({ ...data, type })
        if (result.code === 200) {
            this.close()
        }
    }


    onChange = (e) => {
        // 这个e是更新过来的formData
        // console.log('addonedimension onChange', e)
        this.setState({
            formData: e
        })
    }

    onSelect = (e, idStr) => {
        // console.log('onSelect e', e)
        // console.log('onSelect idStr', idStr) // variable.Derived.DerivedLabel

        if (!idStr) {
            console.error('id str error')
            return false
        }
        let idArr = idStr.split('.') // 更新selcompFormData
        idArr.splice(0, 0, 'properties');
        idArr.splice(idArr.length - 2, 0, 'selcompFormData');

        let tArr = idStr.split('.')
        let idArr1 = tArr.slice(0, tArr.length - 2) // 更新defaultActiveKey
        idArr1.splice(0, 0, 'properties');
        idArr1.splice(idArr.length, 0, 'selcompFormSchema.defaultActiveKey');

        let idArr2 = tArr.slice(0, tArr.length - 2) // 清空selcompFormData
        idArr2.splice(0, 0, 'properties');
        idArr2.splice(idArr.length, 0, 'selcompFormData');

        const { formData, schema } = this.state
        let newFormData = _.cloneDeep(formData)
        newFormData.variable = e
        // let tgtItem = list.filter(i => {
        //     return i.data.key == formData.variable
        // })
        // console.log('tgtItem', tgtItem)
        // let defaultActiveKey = _.findIndex(this.filterOpt, (i) => i.key == tgtItem.usage)
        // console.log('schema', schema)
        let newschema = _.cloneDeep(schema)
        _.set(newschema, `${idArr2.join('.')}`, {}) // 清空selcompFormData
        _.set(newschema, `${idArr.join('.')}`, [e]) // 设置selcompFormData
        // _.set(newschema, `${idArr1.join('.')}`, defaultActiveKey.toString())
        // console.log('newschema', newschema)
        // console.log('newFormData', newFormData)
        this.setState({
            schema: newschema,
            formData: newFormData
        })
        return true
    }


    makeSchema = (filterOpt) => {
        const { list } = this.state

        let selcompFormSchema = {
            "type": "object",
            "title": "选择变量",
            "layout": "Tabs",
            "groupsExclude": true,
            "properties": {
            }
        }

        let selcompFormData = {
            "ysbl": {
                "ysblLabel": ['foo'],
            }
        }

        let { schema } = this.state
        let newSchema = _.cloneDeep(schema)//JSON.parse( JSON.stringify(schema) )// 这里不重新定义应该也行


        filterOpt.forEach(i => {
            let enumData = list.filter(item => item.data.usage == i.key)
                .map(item => item.data.key)
            let ob = {}
            let c = i.key + 'Label'
            ob[i.key] = {
                "title": i.tab,
                "type": "object",
                "layout": "Simple",
                "titleLevel": '1',
                "properties": {

                }
            }
            ob[i.key].properties[c] = {
                "type": "array",
                "title": "",
                "itemsExclude": true,
                "column": '2', // 设置显示几列
                "items": {
                    "type": "string",
                    "enum": enumData
                },
            }
            _.set(selcompFormSchema, `properties.${i.key}`, ob[i.key])
            let { schema } = this.state
            let str = `properties.variable.selcompFormSchema`
            _.set(newSchema, str, selcompFormSchema)
        })
        console.log('newSchema', newSchema)
        // _.set(newSchema, 'properties.variable.selcompFormSchema', selcompFormSchema)
        // _.set(newSchema, 'properties.variable.selcompFormData', selcompFormData)
        this.setState({ schema: newSchema })
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
                { required: true, whitespace: true, message: '请选择细分' },
            ],
        })
        const segmentProps = i => key => getFieldDecorator(`segments[${i}][${key}]`, {
            rules: [
                { required: true, whitespace: true, message: `请填写第${i + 1}条分段的${key === 'name' ? '细分' : '取值范围'}` },
            ],
        })
        let btn = <Button onClick={this.onSubmit}>提交</Button>
        // const schema = {}
        // // let formData = {
        // //     "variable": 'foo'
        // // }
        // const uiSchema = {
        //     "listOfStrings": {
        //         "items": {
        //             "ui:emptyValue": ""
        //         }
        //     }
        // }

        const { schema, formData, uiSchema } = this.state

        if (this.state.list.length < 1) return <Container {...this.props} />
        return (
            <Container {...this.props}>
                <AntdForm
                    schema={schema}
                    formData={formData}
                    uiSchema={uiSchema}
                    onSubmit={this.onSubmit}
                    onSelect={this.onSelect}
                    onChange={this.onChange}
                />
            </Container>
        )

        return (<Container {...this.props}>
            <div className="admin-content">
                <Row className='item-title'>
                    <Col span="24">
                        <h1 className="title">新建一维细分</h1>
                        <div className="btn-box">
                            <Button onClick={this.goBack}>取消</Button>
                            <Button type="primary" style={{ marginLeft: 25 }} onClick={this.sub}>保存并退出</Button>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col span="10">
                        <FormItem label="名称" hasFeedback>
                            {
                                nameProps(<Input placeholder="请输入名称" style={modalInputStyle} />)
                            }
                        </FormItem>
                        <FormItem label="描述" hasFeedback>
                            {
                                descriptionProps(<Input placeholder="请输入描述" style={modalInputStyle} />)
                            }
                        </FormItem>
                        <FormItem label="变量" hasFeedback>
                            {
                                variableProps(<VariableSelect list={list} />)
                            }
                        </FormItem>
                    </Col>
                </Row>
                <FormItem label="分段列表" required={true}>
                </FormItem>
                <div>
                    {
                        [...'1'.repeat(length)].map((_, i, arr) => <div key={i}>
                            <div style={{ width: '200', display: 'inline-block', verticalAlign: 'middle' }}>
                                <FormItem hasFeedback>
                                    {
                                        segmentProps(i)('name')(<Input placeholder='请输入分段名称' />)
                                    }
                                </FormItem>
                            </div>
                            <div style={{ width: '200', marginLeft: 8, display: 'inline-block', verticalAlign: 'middle' }}>
                                <FormItem label='' hasFeedback>
                                    {
                                        segmentProps(i)('range')(<Input placeholder='请输入范围' disabled={arr.length - 1 === i} />)
                                    }
                                </FormItem>
                            </div>
                            {
                                arr.length - 1 === i ? [
                                    <Icon key='1'
                                        type="minus-circle-o"
                                        style={{ opacity: 0, verticalAlign: 'middle', margin: '-24px 0 0 8px', fontSize: 24 }}
                                    />,
                                    <Icon key='2'
                                        type="plus-circle-o"
                                        style={{ opacity: 0, verticalAlign: 'middle', margin: '-24px 0 0 8px', fontSize: 24 }}
                                    />
                                ] : [
                                        <Tooltip placement="topLeft" title="删除该分段" mouseEnterDelay={0.2} key='1'>
                                            <Icon
                                                type="minus-circle-o"
                                                style={{ cursor: 'pointer', verticalAlign: 'middle', margin: '-24px 0 0 8px', fontSize: 24 }}
                                                onClick={this.del(i)}
                                            />
                                        </Tooltip>,
                                        <Tooltip placement="topLeft" title="添加新分段" mouseEnterDelay={0.2} key='2'>
                                            <Icon
                                                type="plus-circle-o"
                                                style={{ cursor: 'pointer', verticalAlign: 'middle', margin: '-24px 0 0 8px', fontSize: 24 }}
                                                onClick={this.add(i)}
                                            />
                                        </Tooltip>
                                    ]
                            }
                        </div>)
                    }
                </div>
            </div>
        </Container>)
    }
}

const AntdForm = Form.create()(ReactJsonForm)
// export const AddOneDimensionSubdivision = _AddOneDimensionSubdivision 

export const AddOneDimensionSubdivision = Form.create()(_AddOneDimensionSubdivision)
