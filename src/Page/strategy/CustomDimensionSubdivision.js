import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal, Tooltip
} from 'antd'

import Container from 'Page/Container'

import { getSubdivisionList, delSubdivision, addSubdivision, updateSubdivision } from 'Ajax'
import { remapPropsToFields, transfrom } from 'Util'
import { AddCustomDimensionSubdivision } from 'Form/AddCustomDimensionSubdivision'
import { UpdateCustomDimensionSubdivision } from 'Form/UpdateCustomDimensionSubdivision'
import { VariableTypeMap, pagination } from 'Setting'

export class CustomDimensionSubdivision extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            loading: true,
            form: 'NORMAL',
        }
        this.form = null
        this.fetchData()
    }
    fetchData = async () => {
        let loading = false
        let list = (await getSubdivisionList()).data.filter(_ => _.data.type === 'Custom')
        this.setState({ list, loading })
    }
    add = () => {
        let AddForm = Form.create({ mapPropsToFields: props => remapPropsToFields(props.initialValue) })(AddCustomDimensionSubdivision)
        this.form = <AddForm close={this.hideForm} initialValue={{}} title='新建自定义细分' submitForm={addSubdivision} />
        this.setState({
            mode: 'ADD',
        })
    }
    update = ({ id, data }) => () => {
        let { name, expr, description } = data
        let UpdateForm = Form.create({ mapPropsToFields: props => remapPropsToFields(props.initialValue) })(UpdateCustomDimensionSubdivision)
        this.form = <UpdateForm close={this.hideForm} id={id} initialValue={{ name, expr, description }} title='编辑自定义细分' submitForm={updateSubdivision} />
        this.setState({
            mode: 'ADD',
        })
    }
    hideForm = () => {
        this.form = null
        this.setState({
            form: 'NORMAL',
            loading: false,
        }, this.fetchData)
    }
    del = data => () => {
        let { id, data: { name } } = data
        Modal.confirm({
            title: '删除自定义细分',
            content: `确定删除名为${name}的自定义细分吗，删除后不可恢复？`,
            onOk: async () => {
                await delSubdivision({ id })
                this.setState({ loading: true }, this.fetchData)
            },
            onCancel: () => { },
        })
    }
    render() {
        const classColumns = [{
            title: '名称',
            dataIndex: 'data.name',
            key: 'name',
        }, {
            title: '描述',
            dataIndex: 'data.description',
            key: 'description',
            width: '60%'
        }, {
            title: '操作',
            dataIndex: '',
            key: 'method',
            width: '150px',
            render: (data) => <div>
                <Tooltip placement="top" title="删除" mouseEnterDelay={0.2}><Icon onClick={this.del(data)} style={{ cursor: 'pointer', fontSize: '18px' }} type="delete" /></Tooltip>
                <span className="ant-divider" />
                <Tooltip placement="top" title="编辑" mouseEnterDelay={0.2}><Icon onClick={this.update(data)} style={{ cursor: 'pointer', fontSize: '18px' }} type="edit" /></Tooltip>
            </div>
        }]
        let { loading, list } = this.state
        const { form } = this
        return <Container {...this.props}>
            {form}
            <Row className='item-title'>
                <Col span="24">
                    <h1 className="title">自定义细分</h1>
                    <div className="btn-box">
                        <Button icon="plus" type="primary" onClick={this.add}>新建自定义细分</Button>
                    </div>
                </Col>
            </Row>
            <Table pagination={pagination} columns={classColumns} rowKey={'id'} bordered dataSource={list} loading={loading} />
        </Container>
    }
}