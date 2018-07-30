/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-10 17:01:04
 */


import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
import moment from 'moment'
import './style-info.scss';

import {
	message,
	Button,
	Form,
	Timeline,
	Icon,
	Tooltip
} from 'antd'
import ReactJsonForm from "ReactJsonSchema";
import InfoComponent from 'Component/InfoComponent'

import {
	getCustomer,
	getCreditView,
	getCreditRecommend,
	queryLoanRequest,
	queryTrackLoanRequest,
	getCoreUserQixinInfo
} from 'Ajax'
import Container from 'Page/Container'

class CustomerInfo extends Component {
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
		// const { router } = this.props;
		// console.log('history', router)
		// console.log('params', this.props.location.state.params)
	}

	fetchData = async () => {
		let loading = false
		const { state } = this.props.location
		if (!state) return
		const { params } = state
		let [customer, credit, creditRecommend, queryResult] = (await Promise.all(
			[
				getCustomer(params.id),
				getCreditView(params.id),
				getCreditRecommend(params.id),
				queryTrackLoanRequest({
					"filter": {},
					"search": {
						"customer_id": params.id
					},
					"tab": {}
				})
			]
		))
		let customerInfo = customer.value
		// console.log(customerInfo.jsonSchema.layout)
		customerInfo.jsonSchema.layout = "Transparent"//zjx 背景透明Layout
		for(let item in customerInfo.jsonSchema.properties){
			let obj = customerInfo.jsonSchema.properties[item]
			obj.layout = "Block"//zjx 修改为Block layout
		}
		let creditInfo = credit.value
		creditInfo.jsonSchema.layout = "Transparent"//zjx 背景透明Layout
		for(let item in creditInfo.jsonSchema.properties){
			let obj = creditInfo.jsonSchema.properties[item]
			obj.layout = "Block"//zjx 修改为Block layout
		}
		let creditRecommendInfo = creditRecommend.value
		creditRecommendInfo.jsonSchema.layout = "Block"//zjx 背景透明Layout
		creditRecommendInfo.jsonSchema.titleLevel = "one"//zjx 背景透明Layout
		// console.log(creditRecommendInfo)
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

	onClick(type) {
		let path
		const { state } = this.props.location
		const { params } = state
		const { router } = this.props;
		router.push({
			pathname: `/customer/update/`,
			state: { params }
		})
	}

	onClickToCredit() {
		const { state } = this.props.location
		let params = { "id": this.state.creditFormData.base_fields.id, "customerId": state.params.id }
		const { router } = this.props;
		router.push({
			pathname: `/credit/update/`,
			state: { params }
		})
	}

	loanTrack = () => {
		const { state } = this.props.location
		let params = { "searchType": "customer_id", "searchContent": state.params.id }
		const { router } = this.props;
		router.push({
			pathname: `/loanrequest/loanlist`,
			state: { params }
		})
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
		let btnCustomer = (
			<div className="edit-btn">
				<Tooltip title="编辑">
					<Icon type="edit" onClick={this.onClick.bind(this, 'customer', customerFormData)}></Icon>
				</Tooltip>

			</div>
		)
		let btnCredit = (
			<div className="edit-btn">
				<Tooltip title="编辑">
					<Icon type="edit" onClick={this.onClickToCredit.bind(this, 'credit')}></Icon>
				</Tooltip>
			</div>
		)
		let btnNull = (
			<div />
		)
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
					<p>{value.status}</p>
					<p>`用款订单号：${value.id}`</p>
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
		const { state } = this.props.location
		const { params } = state
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
								>
									{btnCustomer}
								</AntdForm>
							</div>
							<div style={{ padding: 20, backgroundColor: "white" }}>
								<InfoComponent
									{...this.props}
									fetchDataFun={getCoreUserQixinInfo}
									fetchDataParams={params.id} />
							</div>
						</div>
						<div className="right-info">
							<div className="credit">
								<AntdForm
									schema={newCreditJsonSchema}
									formData={creditFormData}
									uiSchema={creditUiSchema}
								>
									{btnCredit}
								</AntdForm>


								<AntdForm
									schema={newCreditRecommendJsonSchema}
									formData={creditRecommendFormData}
									uiSchema={creditRecommendUiSchema}
								>
									{btnNull}
								</AntdForm>
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

export default CustomerInfo