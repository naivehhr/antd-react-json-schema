import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal,Tooltip
} from 'antd'

import Container from 'Page/Container'

import { getSubdivisionList, delSubdivision } from 'Ajax'
import { VariableTypeMap, pagination } from 'Setting'

export class TwoDimensionSubdivision extends Component {
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
        let list = (await getSubdivisionList()).data.filter(_ => _.data.type === 'TwoDimension')
        this.setState({ list, loading })
    }
    update = ({ id }) => () => {
        hashHistory.push(`/strategy/update-two-dimension-subdivision/${id}`)
    }
    del = data => () => {
        let { id, data: {name} } = data
        Modal.confirm({
            title: '删除二维细分',
            content: `确定删除名为${name}的二维细分吗，删除后不可恢复？`,
            onOk: async () => {
                await delSubdivision({ id })
                this.setState({loading: true}, this.fetchData)
            },
            onCancel: () => {},
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
        return <Container {...this.props}>
            <Row className='item-title'>
                <Col span="24">
                    <h1 className="title">二维细分</h1>
                    <div className="btn-box">
                    <Link to='/strategy/add-two-dimension-subdivision'>
                        <Button icon="plus" type="primary">新建二维细分</Button>
                    </Link>
                    </div>
                </Col>
            </Row>
            <Table pagination={pagination} columns={classColumns} rowKey={'id'} bordered dataSource={list} loading={loading} />
        </Container>
    }
}