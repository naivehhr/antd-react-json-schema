/*
 * @Author					: vincent.zhang 
 * @Date					: 2017-08-21 10:59:08 
 * @overview				: 
 * @Last Modified time		: 2017-08-21 10:59:08 
 */
import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal,Tooltip
} from 'antd'

import Container from 'Page/Container'

import { getScorecardList, delScorecard } from 'Ajax'

export class ScoreCard extends Component {
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
        let list = (await getScorecardList()).data
        this.setState({ list, loading })
    }
    update = ({ id }) => () => {
        hashHistory.push(`/strategy/update-scorecard/${id}`)
    }
    del = data => () => {
        let { id, data: { name } } = data
        Modal.confirm({
            title: '删除评分卡',
            content: `确定删除名为${name}的评分卡吗？`,
            onOk: async () => {
                await delScorecard({ id })
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
            render: data => <div>
                <Tooltip placement="top" title="删除" mouseEnterDelay={0.2}><Icon onClick={this.del(data)} style={{ cursor: 'pointer', fontSize: '18px' }} type="delete" /></Tooltip>
                <span className="ant-divider" />
                <Tooltip placement="top" title="编辑" mouseEnterDelay={0.2}><Icon onClick={this.update(data)} style={{ cursor: 'pointer', fontSize: '18px' }} type="edit" /></Tooltip>
            </div>
        }]
        let { loading, list } = this.state
        return (<Container {...this.props}>
            <Row className='item-title'>
                <Col span="24">
                    <h1 className="title">评分卡</h1>
                    <div className="btn-box">
                        <Link to='/strategy/add-scorecard'>
                            <Button icon="plus" type="primary">新建评分卡</Button>
                        </Link>
                    </div>
                </Col>
            </Row>
            <Table columns={classColumns} rowKey={'id'} bordered dataSource={list} loading={loading} />
        </Container>)
    }
}