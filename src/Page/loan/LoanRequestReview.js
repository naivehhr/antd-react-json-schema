/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-12 13:56:57
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import './style-selectfund.scss';

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

import Container from 'Page/Container'
import ReactJsonForm from "ReactJsonSchema";
import InfoComponent from 'Component/InfoComponent'
import CreateComponent from 'Component/CreateComponent'
import TitleField from 'ReactJsonSchema/components/fields/TitleField'

import {
	reviewLoanRequest,
	addReviewLoanRequest,
	getCreditView,
	getLonRequestCoreUser,
	getLonRequestFundRequestCoreUser
} from 'Ajax'
class LoanRequestReview extends Component {
	constructor() {
		super()
		this.state = {
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
		const { paramsReview } = state
		let [fundRequestList] = (await Promise.all(
			[
				getLonRequestFundRequestCoreUser(paramsReview.id)
			]
		))
		let fundRequestResult = fundRequestList.value
		let reveiewFormData = {
			"loan_request_id": paramsReview.id
		}
		this.setState({
			reveiewFormData,
			fundRequestJsonSchema: fundRequestResult.jsonSchema,
			fundRequestUiSchema: JSON.parse(fundRequestResult.uiSchema),
			fundReuqestFormDataList: fundRequestResult.listFormData
		})
	}

	cancel = () => {
		hashHistory.goBack()
	}

	render() {
		const {
			reveiewFormData,
			fundRequestJsonSchema,
			fundRequestUiSchema,
			fundReuqestFormDataList
		} = this.state
		let btn = (
			<div style={{marginLeft: 20, paddingBottom: 20}}>
				<Button type="button" onClick={this.cancel}>取消</Button>
				<Button style={{ marginLeft: 10 }} htmlType="submit" type="primary">确定</Button>
			</div>
		)
		if (!fundReuqestFormDataList) return <Container  {...this.props} />
		fundRequestUiSchema["ui:display"]=true
		let fundRequestFomData = fundReuqestFormDataList.map((value, index) => {
			let js = Object.assign({}, fundRequestJsonSchema)
			js.title = value.fund_name
			return (
				<div style={{
					width: '50%',
					display: 'inline-block',
					padding: 10,
				}}>
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
		const { paramsReview } = state
		return (
			<Container {...this.props}>
				<div>
					<div>
						<InfoComponent
							{...this.props}
							fetchDataFun={getLonRequestCoreUser}
							fetchDataParams={paramsReview.id}
						/>
					</div>
					<div>
					<InfoComponent
							{...this.props}
							fetchDataFun={getCreditView}
							fetchDataParams={paramsReview.customerId}
						/>
					</div>
					<div className="selectfund-container ">
						<TitleField
							title={"已选资金"}
						/>
						<div className="fund-row">
							{fundRequestFomData}
						</div>
					</div>
					<div style={{ marginTop: 40 }}>
						<CreateComponent 
							{...this.props}
							formData={reveiewFormData}
							fetchDataFun={reviewLoanRequest}
							fetchDataParams={paramsReview.id}
							submitFun={addReviewLoanRequest}
							pushOnSubmit={'/loanrequest/loanlist'}
							children={btn}
						/>
					</div>
				</div>
			</Container>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

export default LoanRequestReview
