/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-10-16 18:27:50
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import './style.scss';

import {
	Layout,
	Menu,
	Icon,
	Breadcrumb,
	Button,
	Collapse,
	Input,
	Radio,
	Select,
	DatePicker,
	Checkbox,
	message,
	Form
} from 'antd'
import CollapseForm from 'Component/Schema/CollapseForm'
import DisplayForm from 'Component/Schema/DisplayForm'
import Container from 'PageUser/Container'
import InfoComponent from 'Component/InfoComponent'
import ReactJsonForm from "ReactJsonSchema";
import TitleField from 'ReactJsonSchema/components/fields/TitleField'
import {
	getLoanRequest,
	getLonRequestFundRequestUser,
	reviewQueryLoanRequestUser
} from 'Ajax'
class LoanRequestInfo extends Component {
	constructor() {
		super()
		this.state = {
			fundRequestJsonSchema: null,
			fundRequestUiSchema: null,
			fundReuqestFormDataList: null,
			reviewJsonSchema: null,
			reviewUiSchema: null,
			reviewFormDataList: null,
		}
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData = async () => {
		let loading = false
		// let result = await reviewLoanRequest()
		// let { jsonSchema, uiSchema } = result.value

		const { state } = this.props.location
		if (!state) return
		const { params } = state
		// this.props.fetchDataFun={(id)=>{getLoanRequest(params.id)}}
		let [reviewResult, fundRequestList] = (await Promise.all(
			[
				reviewQueryLoanRequestUser(params.id),
				getLonRequestFundRequestUser(params.id)
			]
		))
		let reviewInfo = reviewResult.value
		let fundRequestResult = fundRequestList.value
		this.setState({
			fundRequestJsonSchema: fundRequestResult.jsonSchema,
			fundRequestUiSchema: JSON.parse(fundRequestResult.uiSchema),
			fundReuqestFormDataList: fundRequestResult.listFormData,
			reviewJsonSchema: reviewInfo.jsonSchema,
			reviewUiSchema: JSON.parse(reviewInfo.uiSchema),
			reviewFormDataList: reviewInfo.listFormData
		})
	}

	submit = async ({ formData }) => {
		// console.log(formData)
		let newFormData = {
			formData
		}

		let result = await addReviewLoanRequest({ "formData": formData })
		let { code } = result
		if (code == '200') {
			message.success('提交审批成功');
		} else {
			message.error('提交审批失败');
		}
		// console.log()
	}

	render() {
		const {
			fundRequestJsonSchema,
			fundRequestUiSchema,
			fundReuqestFormDataList,
			reviewJsonSchema,
			reviewUiSchema,
			reviewFormDataList,
		} = this.state
		if (!reviewFormDataList) return <Container {...this.props} />
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
		fundRequestUiSchema["ui:display"]=true
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
		const { params } = state
		return (
			<Container {...this.props}>
				<div>
					<div>
						<InfoComponent
							{...this.props}
							fetchDataFun={getLoanRequest}
							fetchDataParams={params.id}
						/>
					</div>
					{reviewFormDataList && reviewFormDataList.length > 0 && 
					<div style={{padding: 20, backgroundColor: "white"}}>
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