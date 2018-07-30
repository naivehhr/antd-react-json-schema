/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-12 11:42:52
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import './style-selectfund.scss';

import {
	message,
	Form
} from 'antd'
import DisplayForm from 'Component/Schema/DisplayForm'
import {
	getLonRequestCoreUser,
	reviewQueryLoanRequest,
	getLonRequestFundRequestCoreUser
} from 'Ajax'
import Container from 'Page/Container'
import ReactJsonForm from "ReactJsonSchema";
import InfoComponent from 'Component/InfoComponent'
import TitleField from 'ReactJsonSchema/components/fields/TitleField'

class LoanRequestInfo extends Component {
	constructor() {
		super()
		this.state = {
			loanRequestjsonSchema: null,
			loanRequestformData: null,
			loanRequestuiSchema: null,
			reviewJsonSchema: null,
			reviewFormDataList: null,
			reviewUiSchema: null,
			fundRequestJsonSchema: null,
			fundRequestUiSchema: null,
			fundReuqestFormDataList: null
		}
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData = async () => {
		let loading = false

		const { state } = this.props.location
		if (!state) return
		const { paramsInfo } = state
		let [loanResult, reviewQueryLoanResult, fundRequestResult] = (await Promise.all(
			[
				getLonRequestCoreUser(paramsInfo.id),
				reviewQueryLoanRequest(paramsInfo.id),
				getLonRequestFundRequestCoreUser(paramsInfo.id)
			]
		))
		let loanResultInfo = loanResult.value
		let reviewQueryLoanInfo = reviewQueryLoanResult.value
		let fundRequestInfo = fundRequestResult.value
		this.setState({
			loanRequestjsonSchema: loanResultInfo.jsonSchema,
			loanRequestformData: loanResultInfo.formData,
			loanRequestuiSchema: JSON.parse(loanResultInfo.uiSchema),
			reviewJsonSchema: reviewQueryLoanInfo.jsonSchema,
			reviewFormDataList: reviewQueryLoanInfo.listFormData,
			reviewUiSchema: JSON.parse(reviewQueryLoanInfo.uiSchema),
			fundRequestJsonSchema: fundRequestInfo.jsonSchema,
			fundRequestUiSchema: JSON.parse(fundRequestInfo.uiSchema),
			fundReuqestFormDataList: fundRequestInfo.listFormData
		})
	}

	submit = async ({ formData }) => {
		let result = await updateCustomer({ "formData": formData })
		let { msg } = result
		// if (msg == '正常') {
		// 	message.success('更新客户信息成功');
		// } else {
		// 	message.error('更新失败');
		// }
	}

	render() {
		const {
			loanRequestjsonSchema,
			loanRequestformData,
			loanRequestuiSchema,
			reviewJsonSchema,
			reviewFormDataList,
			reviewUiSchema,
			fundRequestJsonSchema,
			fundRequestUiSchema,
			fundReuqestFormDataList
		} = this.state
		if (!reviewFormDataList) return <Container  {...this.props} />
		reviewUiSchema["ui:display"] = true
		let reviewFormData = reviewFormDataList.map((value, index) => {
			return (
				<div>
					<AntdForm
						schema={reviewJsonSchema}
						uiSchema={reviewUiSchema}
						formData={value}
						children={<div />}
					/>
				</div>
			)
		})
		if (!fundReuqestFormDataList) return <Container {...this.props} />
		fundRequestUiSchema["ui:display"] = true
		let fundRequestFomData = fundReuqestFormDataList.map((value, index) => {
			let js = Object.assign({}, fundRequestJsonSchema)
			js.title = value.fund_name
			return (
				<div style={{
					width: '50%',
					display: 'inline-block',
					padding: 10,
				}} >
					<AntdForm
						schema={js}
						uiSchema={fundRequestUiSchema}
						formData={value}
						children={<div />}
					/>
				</div>
			)
		})
		const { state } = this.props.location
		const { paramsInfo } = state
		return (
			<Container {...this.props}>
				<div>
					<div>
						<InfoComponent
							{...this.props}
							fetchDataFun={getLonRequestCoreUser}
							fetchDataParams={paramsInfo.id}
						/>
					</div>
					{reviewFormDataList && reviewFormDataList.length > 0 && <div style={{ padding: 20, backgroundColor: "white" }}>
						<TitleField
							title={"审批意见"}
						/>
						{reviewFormData}
					</div>
					}
					<div className="selectfund-container ">
						<TitleField
							title={"已选资金"}
						/>
						<div className="fund-row">
							{fundRequestFomData}
						</div>
					</div>
				</div>
			</Container>

		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

export default LoanRequestInfo