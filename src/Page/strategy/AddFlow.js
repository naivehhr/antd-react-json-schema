import 'Style/addFlow.scss'
import React, { Component } from 'react'
import {
    Menu, Icon, Breadcrumb, Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal
} from 'antd'
import { Link, hashHistory } from 'react-router'

import Container from 'Page/Container'
import { GoDiagram } from 'Component/GoDiagram'
import { addFlow, getFlow, updateFlow } from 'Ajax'
import { remapPropsToFields, transfrom, endErrorsToAntdErrors } from 'Util'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const RadioGroup = Radio.Group

class AddForm extends React.Component {
    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.onSave(values)
            }
        })
    }
    handleCancel = e => {
        this.props.onCancel()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form layout="inline" onSubmit={this.handleSubmit} className="login-form">
                <FormItem hasFeedback>
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '必填' }],
                    })(
                        <Input placeholder="请输入流程名称" />
                        )}
                </FormItem>
                <FormItem hasFeedback>
                    {getFieldDecorator('description', {
                        rules: [{ required: true, message: '必填' }],
                    })(
                        <Input placeholder="请输入流程描述" />
                        )}
                </FormItem>
                <FormItem>
                    <Button type="default" htmlType="button" className="login-form-button" onClick={this.handleCancel}>
                        取消
                    </Button>
                    <Button type="primary" loading={this.props.loading} htmlType="submit" className="login-form-button">
                        保存
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
const WrappedAddForm = Form.create({ mapPropsToFields: props => remapPropsToFields(props.initialValue) })(AddForm)


export class AddFlow extends Component {
    constructor(props) {
        super(props)
        let id = props.params.id
        this.state = {
            id: props.params.id,
            flowName: '',
            flowDesp: '',
            loading: id ? true : false,
            saveLoading: false
        }
        if (id) {
            this.fetchData()
        }
    }

    async fetchData() {
        var rst = await getFlow({
            id: this.state.id
        })
        let diagramData = rst.data
        this.setState({
            loading: false,
            data: diagramData,
            flowName: diagramData.data.name,
            flowDesp: diagramData.data.description,
        })
    }


    //console.log(this.refs.diagram.getModelJson())
    handleDigramChange = () => {
        alert("change")
    }
    handleSave = async values => {
        let params = this.refs.diagram.getModelJson(),
            saveLoading = this.state.saveLoading
        saveLoading = true
        params = { ...params, ...values }
        this.setState({ saveLoading, flowName: params.name, flowDesp: params.description })//更新值并设置loading
        if (this.props.params.id) {
            //更新
            let rst = await updateFlow({
                id: this.props.params.id,
                data: params
            })
            setTimeout(() => {
                saveLoading = false
                this.setState({ saveLoading })
                if (rst.code == "200") {
                    message.success('更新成功')
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
            }, 500);
        } else {
            //新增
            let rst = await addFlow(params)
            setTimeout(() => {
                saveLoading = false
                this.setState({ saveLoading })
                if (rst.code == "200") {
                    message.success('新建成功')
                    hashHistory.replace(`/strategy/update-flow/${rst.data.id}`);//TODO:跳转到Update
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
            }, 500)
        }
    }
    handleCancel = e => {
        hashHistory.goBack()
    }
    handleNameChange = e => {
        this.setState({
            flowName: e.target.value
        })
    }
    handleDespChange = e => {
        this.setState({
            flowDesp: e.target.value
        })
    }
    render() {
        let { flowName, flowDesp } = this.state
        return <Container {...this.props}>
            {
                this.state.loading ? (
                    <div className="admin-content add-flow">
                        <div className="loading">
                            <Spin />
                        </div>
                    </div>) : (<div className="admin-content add-flow">
                        <Row className='item-title'>
                            <Col span="24">
                                <h1 className="title">{this.props.params.id ? '编辑流程' : '新建流程'}</h1>
                            </Col>
                        </Row>
                        <header className="flow-head">
                            <WrappedAddForm loading={this.state.saveLoading} ref="addForm" onSave={this.handleSave} onCancel={this.handleCancel} initialValue={{ name: flowName, description: flowDesp }} />
                        </header>
                        <section className="draw-box">
                            <GoDiagram ref="diagram" onChange={this.handleDigramChange} defaultData={this.state.data} />
                        </section>
                    </div>)
            }
        </Container>
    }
}