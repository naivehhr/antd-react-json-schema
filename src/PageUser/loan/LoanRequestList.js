/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-08-30 13:07:27
 */
import './style.scss';
import React, { Component } from 'react'
import moment from 'moment'

import { Link, hashHistory } from 'react-router'

import {
	message, Tabs, Table, Form, Icon, Input, Button, Select, Row, Col, Spin,Tooltip
} from 'antd'

import CollapseForm from 'Component/Schema/CollapseForm'
import { getCreactCustomerSchema, addCustomer } from 'Ajax'
import Container from 'PageUser/Container'

import QueryTable from 'Component/QueryTable'

class LoanRequestList extends Component {
	constructor() {
		super()
	}
	onClick(type, record) {
		let params = record
		const { router } = this.props;
		let pathname = ''

		switch (type) {
			case 'info':
				pathname += '/loanrequest/info/'
				break;
			case 'update':
				pathname += '/loanrequest/update/'
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
				<h1 className='item-title'>用款订单列表</h1>
				<QueryTable type="user" opt={{
					title: '操作',
					key: 'action',
					fixed: 'right',
					width:'80',
					render: (text, record) => (
						<span style={{whiteSpace:'nowrap'}}>
							<Tooltip placement="top" title="查看" mouseEnterDelay={0.2}><Icon onClick={this.onClick.bind(this, 'info', record)} style={{ cursor: 'pointer', fontSize: '18px' }} type="eye-o" /></Tooltip>
							<span className="ant-divider" />
							<Tooltip placement="top" title="编辑" mouseEnterDelay={0.2}><Icon onClick={this.onClick.bind(this, 'update', record)} style={{ cursor: 'pointer', fontSize: '18px' }} type="edit" /></Tooltip>
						</span>
					)
				}} />
			</Container>
		)
	}
}

export default LoanRequestList