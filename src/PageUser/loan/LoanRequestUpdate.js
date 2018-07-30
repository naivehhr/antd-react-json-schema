/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-12 15:40:57
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
	Steps,
	Form
} from 'antd'
const Step = Steps.Step;

import Container from 'PageUser/Container'
import InfoComponent from 'Component/InfoComponent'
import UpdateComponent from 'Component/UpdateComponent'
import ReactJsonForm from "ReactJsonSchema";
import TitleField from 'ReactJsonSchema/components/fields/TitleField'


import {
	getLoanRequestUpdate,
	reviewQueryLoanRequestUser,
	getCreditViewUser,
	addLoanRequestQuerySelectable
} from 'Ajax'
class LoanRequestUpdate extends Component {
	constructor() {
		super()
		this.state = {
			jsonSchema: null,
			uiSchema: null,
			formData: null,
			reviewJsonSchema: null,
			reviewUiSchema: null,
			reviewFormDataList: null,
		}
	}

	componentDidMount() {
		const { state } = this.props.location
		if (state) {
			this.setState({ formData: state.params.formData })
		}
		this.fetchData()
	}

	fetchData = async () => {
		let loading = false
		// let result = await reviewLoanRequest()
		// let { jsonSchema, uiSchema } = result.value

		const { state } = this.props.location
		if (!state) return
		const { params } = state
		// console.log('====================================');
		// console.log(state);
		// console.log('====================================');
		// this.props.fetchDataFun={(id)=>{getLoanRequest(params.id)}}
		let [reviewResult] = (await Promise.all(
			[
				reviewQueryLoanRequestUser(params.id)
			]
		))
		let reviewInfo = reviewResult.value
		this.setState({
			reviewJsonSchema: reviewInfo.jsonSchema,
			reviewUiSchema: JSON.parse(reviewInfo.uiSchema),
			reviewFormDataList: reviewInfo.listFormData
		})
	}

	render() {
		const {
			reviewJsonSchema,
			reviewUiSchema,
			reviewFormDataList,
		} = this.state
		let btn = (
			<div>
				<Button style={{ marginTop: 10 }} type="primary" htmlType="submit" >下一步</Button>
			</div>
		)
		if (!reviewFormDataList) return <div />
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
		const { state } = this.props.location
		if (!state) return
		const { params } = state
		return (
			<Container {...this.props}>
				<div style={{ backgroundColor: 'white', padding: "40px 20px" }} >
					<Steps current={0}>
						<Step title="更新用款" description="" />
						<Step title="选择资金产品" description="" />
					</Steps>
				</div>
				<div>
					<InfoComponent
						{...this.props}
						fetchDataFun={getCreditViewUser}
					/>
				</div>
				<div style={{ padding: 20, backgroundColor: "white" }}>
					<TitleField
						title={"审批意见"}
					/>
					{reviewFormData}
				</div>
				<div>
					<UpdateComponent
						{...this.props}
						fetchDataFun={getLoanRequestUpdate}
						fetchDataParams={params.id}
						submitFun={addLoanRequestQuerySelectable}
						pushOnSubmit={'/loanrequest/update/selectfund'}
						submitSuccMsg={''}
					/>
				</div>
			</Container>
		)
	}
}

const AntdForm = Form.create()(ReactJsonForm)

export default LoanRequestUpdate