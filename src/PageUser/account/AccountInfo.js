/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-11 17:06:25
 */


import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import moment from 'moment'
import './style-info.scss';

import {
	message, Row, Col, Form, Timeline
} from 'antd'
import DisplayForm from 'Component/Schema/DisplayForm'
import {
	userView,
	getCreditViewUser,
	getCreditRecommendUser,
	queryTrackLoanRequestUser,
} from 'Ajax'
import Container from 'PageUser/Container'
import QueryTable from 'Component/QueryTable'
import ReactJsonForm from "ReactJsonSchema";

class AccountInfo extends Component {
	constructor() {
		super()
		this.state = {
			customerJsonSchema: null,
			customerFormData: null,
			customerUiSchema: null,
			creditJsonSchema: null,
			creditFormData: null,
			creditUiSchema: null,
			creditRecommendJsonSchema: null,
			creditRecommendFormData: null,
			creditRecommendUiSchema: null,
			loanTail: [],
			repaymentTail: []
		}
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData = async () => {
		let loading = false
		let [customer, credit, creditRecommend, queryResult] = (await Promise.all(
			[
				userView(),
				getCreditViewUser(),
				getCreditRecommendUser(),
				queryTrackLoanRequestUser({
					"filter": {},
					"search": {},
					"tab": {}
				})
			]
		))
		let customerInfo = customer.value
		let creditInfo = credit.value
		let creditRecommendInfo = creditRecommend.value
		let loanInfo = queryResult.value
		let statusList = loanInfo.rows.map((value, index) => {
			let c = JSON.stringify(value, ['id', 'status', 'time_update'])
			// console.log(JSON.parse(c))
			return JSON.parse(c)
		})
		this.setState({
			customerJsonSchema: customerInfo.jsonSchema,
			customerFormData: customerInfo.formData,
			customerUiSchema: JSON.parse(customerInfo.uiSchema),
			creditJsonSchema: creditInfo.jsonSchema,
			creditFormData: creditInfo.formData,
			creditUiSchema: JSON.parse(creditInfo.uiSchema),
			creditRecommendJsonSchema: creditRecommendInfo.jsonSchema,
			creditRecommendFormData: creditRecommendInfo.formData,
			creditRecommendUiSchema: JSON.parse(creditRecommendInfo.uiSchema),
			loanTail: statusList
		})
	}

	submit = async ({ formData }) => {
		let result = await updateCustomer({ "formData": formData })
		let { msg } = result
		if (msg == '正常') {
			message.success('更新客户信息成功');
		} else {
			message.error('更新失败');
		}
	}

	render() {
		const {
			customerJsonSchema,
			customerFormData,
			customerUiSchema,
			creditJsonSchema,
			creditFormData,
			creditUiSchema,
			creditRecommendJsonSchema,
			creditRecommendFormData,
			creditRecommendUiSchema,
			loanTail,
			repaymentTail
		} = this.state
		let loantrailView = loanTail.map((value, index) => {
			return (
				<Timeline.Item color="#c8d2df" >
					<div className="timeline-content">
						<p>用款订单号：{value.id}</p>
						<p >{value.status}</p>
					</div>
					<span>{value.time_update}</span>
				</Timeline.Item>
			)
		})
		let _loantrailView = loantrailView.slice(0, 2)
		let repaymentTailView = repaymentTail.map((value, index) => {
			return (
				<li>{value.time_update}
					<p>`用款订单号：${value.id}`</p>
					<p>{value.status}</p>
				</li>
			)
		})
		if (!customerJsonSchema) return <Container  {...this.props} />
		let newCustomerJsonSchema = customerJsonSchema
		newCustomerJsonSchema.display = true
		delete newCustomerJsonSchema.title
		let newCreditJsonSchema = creditJsonSchema
		newCreditJsonSchema.display = true
		delete newCreditJsonSchema.title
		let newCreditRecommendJsonSchema = creditRecommendJsonSchema
		newCreditRecommendJsonSchema.display = true
		creditRecommendUiSchema["ui:titleFormat"] = false
		creditUiSchema["ui:display"] = true
		customerUiSchema["ui:display"] = true
		creditRecommendUiSchema["ui:display"] = true
		return (
			<Container  {...this.props}>
				<div className="info-container">
					<div>
						<h1>客户信息</h1>
					</div>
					<div className="info-content">
						<div className="left-info">
							<div >
								<AntdForm
									schema={customerJsonSchema}
									formData={customerFormData}
									uiSchema={customerUiSchema}
									children={<div />}/>
							</div>
							<div>
							</div>
						</div>
						<div className="right-info">
							<div className="credit">
								<AntdForm
									schema={newCreditJsonSchema}
									formData={creditFormData}
									uiSchema={creditUiSchema}
									children={<div />}/>
								<div style={{ padding: 20, backgroundColor: "white" }}>
									<AntdForm
										schema={newCreditRecommendJsonSchema}
										formData={creditRecommendFormData}
										uiSchema={creditRecommendUiSchema}
										children={<div />}
									/>
								</div>
							</div>
							<div className="fund-track">
								<div>
									<span >用款跟踪</span>
									<Link style={{ float: 'right', color: '#007bff' }} onClick={this.loanTrack} >查看更多</Link>
								</div>
								<Timeline className="timeline">
									{_loantrailView}
								</Timeline>
							</div>
							<div className="fund-track">
								<div>
									<span >还款跟踪</span>
									<Link style={{ float: 'right', color: '#007bff' }} to="">查看更多</Link>
								</div>
								<ul >
									{repaymentTailView}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</Container>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

export default AccountInfo