/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-08-29 15:32:02
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import './style.scss';

import {
	message
} from 'antd'
import DisplayForm from 'Component/Schema/DisplayForm'
import { getCustomer } from 'Ajax'
import Container from 'Page/Container'

class FundInfo extends Component {
	constructor() {
		super()
		this.state = {
			jsonSchema: null,
			formData: null,
			uiSchema: null
		}
	}

	componentDidMount() {
		// this.fetchData()
	}

	fetchData = async () => {
		let loading = false
		let result = await getCustomer()
		let { jsonSchema, formData, uiSchema } = result.value
		this.setState({ jsonSchema: jsonSchema, formData: formData, uiSchema: JSON.parse(uiSchema) })
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
		return (
			<Container  {...this.props}>
				<DisplayForm {...this.state} submit={this.submit} />
			</Container>

		)
	}
}
export default FundInfo