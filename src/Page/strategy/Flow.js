import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal, Tooltip
} from 'antd'
import Container from 'Page/Container'
import { getFlowList, delFlow } from 'Ajax'

export class Flow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: [],
            loading: true,
        }
        this.fetchData()
    }
    fetchData = async () => {
        let loading = false
        let list = (await getFlowList()).data
        this.setState({ list, loading })
    }
    update = ({ id }) => () => {
        hashHistory.push(`/strategy/update-flow/${id}`)
    }
    del = data => () => {
        let { id, name } = data
        Modal.confirm({
            title: '删除流程',
            content: `确定删除名为${name}的流程吗？`,
            onOk: async () => {
                await delFlow({ id })
                this.setState({ loading: true }, this.fetchData)
            },
            onCancel: () => { },
        })
    }
    render() {
        const classColumns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
            width: '60%'
        }, {
            title: '操作',
            dataIndex: '',
            key: 'method',
            width: '150px',
            render: data => <div>
                <Tooltip placement="top" title="删除" mouseEnterDelay={0.2}><Icon onClick={this.del(data)} style={{ cursor: 'pointer', fontSize: '18px' }} type="delete" /></Tooltip>
                <span className="ant-divider" />
                <Tooltip placement="top" title="编辑" mouseEnterDelay={0.2}><Icon onClick={this.update(data)} style={{ cursor: 'pointer', fontSize: '18px' }} type="edit" /></Tooltip>
            </div>
        }]
        let { loading, list } = this.state
        return (
            <Container  {...this.props}>
                <Row className='item-title'>
                    <Col span="24">
                        <h1 className="title">流程管理</h1>
                        <div className="btn-box">
                            <Link to='/strategy/add-flow'>
                                <Button icon="plus" type="primary">新建流程</Button>
                            </Link>
                        </div>
                    </Col>
                </Row>
                <Table columns={classColumns} rowKey={'id'} bordered dataSource={list} loading={loading} />
            </Container>
        )

    }
}