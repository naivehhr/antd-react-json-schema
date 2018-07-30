/*
 * @Author					: vincent.zhang 
 * @Date					: 2017-08-21 10:59:08 
 * @overview				: 
 * @Last Modified time		: 2017-08-21 10:59:08 
 */
import 'Style/addScoreCard.scss'
import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal
} from 'antd'

import Container from 'Page/Container'
import { listForScenario, getVariableList, addScorecard, getScorecard, updateScorecard } from 'Ajax'
import { remapPropsToFields, transfrom, endErrorsToAntdErrors, promiseConfirm } from 'Util'
import VariableSelect from 'Component/VariableSelect'
import BranchSelect from 'Component/MultiBranchSelect'
import { rulesMap } from 'Setting'

const FormItem = Form.Item
const rulesType = transfrom(rulesMap)

export const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 12 },
}

class AddForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            list: []
        }
    }
    handleSubmit = e => {
        e && e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSave(values)
            }
        })
    }
    handleCancel = e => {
        this.props.onCancel()
    }
    fetchData = async () => {
        const list = (await listForScenario({ objectType: 'ScoreCard' })).data
        this.setState({ list })
    }
    componentDidMount() {
        this.fetchData()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        const { list } = this.state
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                {/* <Row type="flex" justify="start">
                    <Col span="12">
                        <Button type="default" htmlType="button" className="login-form-button" onClick={this.handleCancel}>取消</Button>
                        <Button type="default" loading={this.props.loading} htmlType="submit" className="login-form-button">保存并退出</Button>
                    </Col>
                </Row> */}
                <Row type="flex" justify="start">
                    <Col span={10}>
                        <FormItem {...formItemLayout} label='名称' hasFeedback>
                            {getFieldDecorator('name', {
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Input placeholder="名称" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='描述' hasFeedback>
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <Input placeholder="描述" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='初值' hasFeedback>
                            {getFieldDecorator('initial', {
                                rules: [{ required: true, message: '必填' }, { pattern: rulesType("number"), message: '请输入数值' }],
                            })(
                                <Input placeholder="变量初始值" />
                                )}
                        </FormItem>
                        <FormItem {...formItemLayout} label='变量' hasFeedback required={true}>
                            {getFieldDecorator('outputVariable', {
                                rules: [{ required: true, message: '必填' }],
                            })(
                                <VariableSelect list={list} />
                                )}
                        </FormItem>
                    </Col>
                    <Col span="24" className="branch-select">
                        <FormItem required={true}>
                            {getFieldDecorator('subdivisions', {
                                rules: [{ required: true, message: '请添加细分' }],
                            })(
                                <BranchSelect form={this.props.form} list={list} initialScore={this.props.initialValue.scoreSubdivisions} />
                                )}
                        </FormItem>
                    </Col>
                </Row>
            </Form>
        )
    }
}
const WrappedAddForm = Form.create({ mapPropsToFields: props => remapPropsToFields(props.initialValue) })(AddForm)

export class AddScoreCard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            initialValue: {}
        }
        if (props.params.id) {
            this.state.loading = true
            this.fetchData()
        }
    }
    fetchData = async () => {
        let loading = false
        let rst = (await getScorecard({ id: this.props.params.id }))
        if (rst.code == "200") {
            let initialValue = rst.data.data
            this.setState({ rst, loading, initialValue })
        }
    }
    handleCancel = async () => {
        if (await promiseConfirm({ title: '警告', content: '是否需要放弃编辑？所有编辑无法保存' })) {
            hashHistory.goBack()
        }
    }
    handleSave = async value => {
        let scoreSubdivisions = value.subdivisions.map((item, i) => {
            return {
                results: value.scores[i].segments.map(item => ({ score: item.score, reason: item.desc })),
                subdivision: item.data
            }
        })

        let params = {
            "description": value.description,
            "name": value.name,
            "initial": value.initial,
            "outputVariable": value.outputVariable,
            "type": "ScoreCard",
            "scoreSubdivisions": scoreSubdivisions
        }, rst, id = this.props.params.id

        rst = await (id ? updateScorecard({ id, data: params }) : addScorecard(params))
        if (rst.code == "200") {
            id ? message.success('更新成功') : message.success('新建成功')
            hashHistory.goBack()
        } else if (rst.code == 1000) {
            let errors = rst.errors, form = this.refs.addForm
            endErrorsToAntdErrors(errors).map(_ => {
                form.setFields({
                    [_.label]: {
                        errors: _.errors,
                        value: form.getFieldValue(_.label)
                    }
                })
            })
        }
    }
    sub = () => {
        console.log(this.refs.addForm.validateFields((error, value) => {
            if (!error) {
                this.handleSave(value)
            }
        }))
    }
    render() {
        let { loading, list, initialValue } = this.state
        let panelStyle = {
            padding:"20px 20px 0",
            background:'white'
        }
        return (
            <Container {...this.props}>
                <Row>
                    {
                        this.state.loading ? (<div className="add-flow">
                            <div className="loading">
                                <Spin />
                            </div>
                        </div>) : (
                                <Row className="add-store-card">
                                    <Row className='item-title'>
                                        <Col span="24">
                                            <h1 className="title">{this.props.params.id ? '更新评分卡' : '新建评分卡'}</h1>
                                            <div className="btn-box">
                                                <Button onClick={this.handleCancel}>取消</Button>
                                                <Button type="primary" style={{ marginLeft: 25 }} onClick={this.sub}>保存并退出</Button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <div style={panelStyle}>
                                        <WrappedAddForm loading={this.state.saveLoading} ref="addForm" onSave={this.handleSave} onCancel={this.handleCancel} initialValue={initialValue} />
                                    </div>
                                </Row>
                            )
                    }
                </Row>
            </Container>
        )

    }
}