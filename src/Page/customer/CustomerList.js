/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-01 15:45:02
 */


import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import moment from 'moment'
import './style.scss'

import {
	message, Tabs, Table, Form, Icon, Input, Button, Select, Row, Col, Spin, Tooltip
} from 'antd'

import CollapseForm from 'Component/Schema/CollapseForm'
import { getCreactCustomerSchema, addCustomer } from 'Ajax'
import Container from 'Page/Container'
import QueryTable from 'Component/QueryTable'

class CustomerList extends Component {
	constructor() {
		super()
	}

	componentDidMount() {
		// this.fetchData()
		// message.info("查看用户列表")
	}

	onClick(type, id) {
		let params = { "id": id }
		const { router } = this.props;
		let pathname = ''

		switch (type) {
			case 'info':
				pathname += '/customer/info/'
				break;
			case 'update':
				pathname += '/customer/update/'
				break;
			default:
				break;
		}
		router.push({
			pathname: pathname,
			state: { params }
		})
	}

	render() {
		return (
			<Container  {...this.props}>
				<Row className='item-title'>
					<Col span="24">
						<h1 className="title">客户列表</h1>
						<div className="btn-box">
							<Link to='/customer/create'>
								<Button icon="plus" type="primary">新建客户</Button>
							</Link>
						</div>
					</Col>
				</Row>
				<QueryTable type="coreUserCustomer" opt={{
					title: '操作',
					key: 'action',
					fixed: 'right',
					width:'80',
					render: (text, record) => (
						<span>
							<Tooltip placement="top" title="查看" mouseEnterDelay={0.2}><Icon style={{ cursor: 'pointer',fontSize:'18px'}} type="eye-o" onClick={this.onClick.bind(this, 'info', record.id)}/></Tooltip>
							<span className="ant-divider" />
							<Tooltip placement="top" title="编辑" mouseEnterDelay={0.2}><Icon style={{ cursor: 'pointer',fontSize:'18px'}} type="edit" onClick={this.onClick.bind(this, 'update', record.id)}/></Tooltip>
						</span>
					)
				}} />
			</Container>
		)
	}
}

export default CustomerList