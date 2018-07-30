/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-08 14:53:47
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import './style-selectfund.scss';

import {
	message,
	Button,
	Steps,
	Form
} from 'antd'
import ReactJsonForm from "ReactJsonSchema";

import { updateLoanRequest } from 'Ajax'
import Container from 'PageUser/Container'
const Step = Steps.Step;
class LoanUpdateSelectFund extends Component {
	constructor() {
		super()
		this.state = {
			fundJsonSchema: null,
			fundFormData: null,
			fundUiSchema: null,
			loanJsonSchema: null,
			loanFormData: null,
			loanFormDataForUpdate: null,
			loanUiSchema: null,
			fundMultiListFormData: [],
			rowClass: 'fund-row',
			selectID: null
		}
	}

	componentDidMount() {
		// this.fetchData()
		const { state } = this.props.location
		if (!state) return
			console.log('====================================');
			console.log(state);
			console.log('====================================');
		const { submitResult, params } = state
		const { formData } = params
		let fund = submitResult.value.fundRequest
		let loan = submitResult.value.loanRequest
		loan.jsonSchema.title = ''
		this.setState({
			fundJsonSchema: fund.jsonSchema,
			fundUiSchema: JSON.parse(fund.uiSchema),
			fundMultiListFormData: fund.multiListFormData,
			loanFormData: loan.formData,
			loanJsonSchema: loan.jsonSchema,
			loanUiSchema: JSON.parse(loan.uiSchema),
			loanFormDataForUpdate:formData
			
		})
	}


	submit = async () => {
		const { loanFormDataForUpdate, fundMultiListFormData, selectID, loanFormData } = this.state
		const { router } = this.props;

		if (selectID === null) {
			message.error('请选择资金')
			return
		}
		let result = await updateLoanRequest({
			"fundsFormData": fundMultiListFormData[selectID],
			"loanRequestFormData": loanFormDataForUpdate
		})
		const { code } = result
		if(code == 200) {
			message.success('更新成功!')
			router.push({
				pathname: '/loanrequest/list',
			})
		}
	}

	goBack = () => {
		const { router } = this.props;
		// const { loanFormData } = this.state
		const { state } = this.props.location
		const { params } = state
		router.push({
			pathname: '/loanrequest/create',
			state: { params }
		})
	}
	select(selectID) {
		// console.log(selectID)
		let c = document.getElementById(`select${selectID}`)
		let funds = document.getElementsByName('fundRow')
		funds.forEach(i => {
			i.className = 'fund-row'
		})
		c.className = 'fund-row-select'
		this.setState({ selectID })
	}

	render() {
		const {
			fundJsonSchema,
			fundUiSchema,
			fundMultiListFormData,
			loanFormData,
			loanJsonSchema,
			loanUiSchema,
			rowClass
		} = this.state
		if (!loanJsonSchema) return <div />
		let btn = (
			<div style={{ display: 'none' }}>
			</div>
		)
		let fundView = fundMultiListFormData.map((value, index) => {
			fundUiSchema["ui:display"] = true
			let c = value.map((v, i) => {
				let js = Object.assign({}, fundJsonSchema)
				js.title = v.fund_name
				return (
					<div style={{
						width: '50%',
						display: 'inline-block',
						padding: 10,
					}} >
						<AntdForm
							schema={js}
							uiSchema={fundUiSchema}
							formData={v}
							children={<div />}
						/>
					</div>
				)
			})
			return (
				<div
					id={`select${index}`}
					name={'fundRow'}
					className={rowClass}
					onClick={this.select.bind(this, index)}
				>
					{c}
				</div>
			)
		})
		loanUiSchema["ui:display"] = true
		return (
			<Container  {...this.props}>
				<div className="selectfund-container">
					<div className="btn-group">
						<Button style={{ marginRight: 10 }} onClick={this.goBack}>上一步</Button>
						<Button onClick={this.submit}>提交</Button>
					</div>
					<div style={{ backgroundColor: 'white', padding: "40px 20px" }} >
						<Steps current={1}>
							<Step title="更新用款" description="" />
							<Step title="选择资金产品" description="" />
						</Steps>
					</div>
					<div>
						<AntdForm
							schema={loanJsonSchema}
							uiSchema={loanUiSchema}
							formData={loanFormData}
							children={<div />}
						/>
					</div>
					<div>
						{fundView}
					</div>
				</div>
			</Container>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

export default LoanUpdateSelectFund