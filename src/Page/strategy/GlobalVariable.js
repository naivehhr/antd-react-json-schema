import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal, Tabs,
} from 'antd'

import Container from 'Page/Container'

import { getVariableList, addVariable } from 'Ajax'

import AddGlobalVariable from 'Form/AddGlobalVariable'
import { remapPropsToFields, transfrom } from 'Util'
import { VariableTypeMap, pagination } from 'Setting'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane

const transType = transfrom(VariableTypeMap)

export class GlobalVariable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            inputList: [],
            outputList: [],
            mode: 'NORMAL',
            loading: true,
        }
        this.form = null
        this.fetchData()
    }
    fetchData = async () => {
        const loading = false
        const list = await getVariableList()
        const inputList = list.data.filter(_ => _.data.usage === 'Input')
        const outputList = list.data.filter(_ => _.data.usage === 'Output')
        this.setState({ inputList, outputList, loading })
    }
    update = ({ id }) => () => {
        this.props.history.push(`/update-flow/${id}`)
    }
    del = data => () => {
        const { id, name } = data
        Modal.confirm({
            title: '删除流程',
            content: `确定删除名为${name}的变量吗？`,
            onOk: async () => {
                await delFlow({ id })
                await this.fetchData()
            },
            onCancel: () => { },
        })
    }
    hideAddForm = () => {
        this.form = null
        this.setState({
            form: 'NORMAL',
            loading: true,
        }, this.fetchData)
    }
    addNewGlobalVariableForm = () => {
        // let AddForm = Form.create({ mapPropsToFields: props => remapPropsToFields(props.initialValue) })(AddGlobalVariable)
        let AddForm = AddGlobalVariable
        this.form = <AddForm close={this.hideAddForm} initialValue={{ type: 'Number', usage: 'Input' }} title='新建全局变量' submitForm={addVariable} />
        this.setState({
            mode: 'ADD',
        })
    }
    render() {
        const classColumns = [{
            title: '名称',
            dataIndex: 'data.key',
            key: 'key',
        }, {
            title: '类型',
            dataIndex: 'data.type',
            key: 'type',
            render: transType
        }, {
            title: '长度',
            dataIndex: 'data.length',
            key: 'length',
        }, {
            title: '精度',
            dataIndex: 'data.precision',
            key: 'precision',
        },]
        const { mode, inputList, outputList, loading } = this.state
        const { form } = this
        return <Container {...this.props}>
            {form}
            <Row className='item-title'>
                <Col span="24">
                    <h1 className="title">全局变量管理</h1>
                    <div className="btn-box">
                        <Button icon="plus" type="primary" onClick={this.addNewGlobalVariableForm}>新建全局变量</Button>
                    </div>
                </Col>
            </Row>
            <div style={{padding:'15px',background:'white'}}>
                <Tabs defaultActiveKey="input">
                    <TabPane tab="输入变量" key="input">
                        <Table pagination={pagination} columns={classColumns} rowKey={'id'} bordered dataSource={inputList} loading={loading} />
                    </TabPane>
                    <TabPane tab="输出变量" key="output">
                        <Table pagination={pagination} columns={classColumns} rowKey={'id'} bordered dataSource={outputList} loading={loading} />
                    </TabPane>
                </Tabs>
            </div>
        </Container>
    }
}
