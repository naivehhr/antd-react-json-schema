import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal
} from 'antd'

import Container from 'Page/Container'

import { getVariableList, addVariable } from 'Ajax'

import AddDerivedVariable from 'Form/AddDerivedVariable'
import { remapPropsToFields, transfrom } from 'Util'
import { VariableTypeMap, pagination } from 'Setting'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const RadioGroup = Radio.Group

const transType = transfrom(VariableTypeMap)

export class DerivedVariable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            mode: 'NORMAL',
            loading: true,
        }
        this.form = null
        this.fetchData()
    }
    fetchData = async () => {
        let loading = false
        let list = (await getVariableList()).data.filter(_ => _.data.usage === 'Derived')
        this.setState({ list, loading })
    }
    del = data => () => {
        let { id, name } = data
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
            loading: false,
        }, this.fetchData)
    }
    addNewDerivedVariableForm = () => {
        // let AddForm = Form.create({ mapPropsToFields: props => remapPropsToFields(props.initialValue) })(AddDerivedVariable)
        let AddForm = AddDerivedVariable
        this.form = <AddForm close={this.hideAddForm} initialValue={{ type: 'Number' }} title='新建衍生变量' submitForm={addVariable} />
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
            width:80,
            dataIndex: 'data.type',
            key: 'type',
            render: transType
        }, {
            title: '长度',
            width:80,
            dataIndex: 'data.length',
            key: 'length',
        }, {
            title: '精度',
            width:80,
            dataIndex: 'data.precision',
            key: 'precision',
        }, {
            title: '公式',
            dataIndex: 'data.expr',
            key: 'expr',
        }]
        const { mode, list, loading } = this.state
        const { form } = this
        return <Container {...this.props}>
            {form}
            <Row className='item-title'>
                <Col span="24">
                    <h1 className="title">衍生变量管理</h1>
                    <div className="btn-box">
                        <Button icon="plus" type="primary" onClick={this.addNewDerivedVariableForm}>新建衍生变量</Button>
                    </div>
                </Col>
            </Row>
            <Table pagination={pagination} columns={classColumns} rowKey={'id'} bordered dataSource={list} loading={loading} />
        </Container>
    }
}
