/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-08-30 11:19:30
 */


import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import moment from 'moment'
import './style.scss';

import {
	message, Tabs, Table, Form, Icon, Input, Button, Select, Row, Col, Spin
} from 'antd'

import CollapseForm from 'Component/Schema/CollapseForm'
import { getCreactCustomerSchema, addCustomer } from 'Ajax'
import Container from 'Page/Container'
import QueryTable from 'Component/QueryTable'

class LoanRequestList extends Component {
	constructor() {
		super()
		this.state = {
			queryParams: {}
		}
	}

	componentDidMount() {
		const { state } = this.props.location
		if (state) {
			console.log('state', state)
			this.setState({ 
				queryParams: state.params
			})
		}
	}

	onClick(type, record) {
		let paramsInfo = { "id": record.id }
		let paramsReview = { "id": record.id, "customerId": record.customer_id }
		const { router } = this.props;
		let pathname = ''

		switch (type) {
			case 'info':
				pathname += '/loanrequest/info/'
				router.push({
					pathname: pathname,
					state: { paramsInfo }
				})
				break;
			case 'review':
				pathname += '/loanrequest/review/'
				router.push({
					pathname: pathname,
					state: { paramsReview }
				})
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<Container  {...this.props}>
				<h1 className='item-title'>用款订单列表</h1>
				<QueryTable type="loan"  queryParams={this.state.queryParams} opt={{
					title: '操作',
					key: 'action',
					fixed: 'right',
					width:'80',
					render: (text, record) => (
						<span style={{whiteSpace:'nowrap'}}>
							<Button size="small" onClick={this.onClick.bind(this, 'info', record)}>查看</Button>
							<span className="ant-divider" />
							<Button size="small" onClick={this.onClick.bind(this, 'review', record)}>审批</Button>
						</span>
					)
				}} />
			</Container>
		)
	}
}

export default LoanRequestList