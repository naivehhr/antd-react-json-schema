/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-08 14:12:23
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
	Steps
} from 'antd'
const Step = Steps.Step;

import Container from 'PageUser/Container'
import InfoComponent from 'Component/InfoComponent'
import CreateComponent from 'Component/CreateComponent'
import {
	getCreactLoanRequestSchema,
	addLoanRequestQuerySelectable,
	getCreditViewUser
} from 'Ajax'
class LoanRequestCreate extends Component {
	constructor() {
		super()
		this.state = {
			jsonSchema: null,
			uiSchema: null,
			formData: null,
			creditJsonSchema: null,
			creditFormData: null,
			creditUiSchema: null,
		}
	}

	componentDidMount() {
		const { state } = this.props.location
		if (state && state.params) {
			this.setState({ formData: state.params.formData })
		}
		// this.fetchData()
	}

	// fetchData = async () => {
	// 	let loading = false

	// 	let [result, credit] = (await Promise.all(
	// 		[
	// 			getCreactLoanRequestSchema(),
	// 			getCreditViewUser(),
	// 		]
	// 	))
	// 	let { jsonSchema, uiSchema } = result.value
	// 	let creditInfo = credit.value
	// 	this.setState({
	// 		jsonSchema: jsonSchema,
	// 		uiSchema: JSON.parse(uiSchema),
	// 		creditJsonSchema: creditInfo.jsonSchema,
	// 		creditFormData: creditInfo.formData,
	// 		creditUiSchema: JSON.parse(creditInfo.uiSchema),
	// 	})
	// }


	render() {
		const {
			creditJsonSchema,
			creditFormData,
			creditUiSchema,
		} = this.state
		let btn = (
			<div>
				<Button style={{ marginTop: 10 }} type="primary" htmlType="submit" >下一步</Button>
			</div>
		)
		return (
			<Container {...this.props}>
				<div style={{ backgroundColor: 'white', padding: "40px 20px" }} >
					<Steps current={0}>
						<Step title="新建用款" description="" />
						<Step title="选择资金产品" description="" />
					</Steps>
				</div>
				<div>
					<InfoComponent
						{...this.props}
						fetchDataFun={getCreditViewUser}
					/>
				</div>
				<div>
					<CreateComponent
						{...this.props}
						fetchDataFun={getCreactLoanRequestSchema}
						submitFun={addLoanRequestQuerySelectable}
						pushOnSubmit={'/loanrequest/selectfund'}
						submitSuccMsg={''}
					/>
				</div>
			</Container>
		)
	}
}
export default LoanRequestCreate