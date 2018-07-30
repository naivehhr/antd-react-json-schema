/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-07 15:41:08
 */


import React, { Component } from 'react'
import './style.scss';

import {
	message, Button, Form
} from 'antd'
import Container from 'PageUser/Container'
import InfoComponent from 'Component/InfoComponent'
import ReactJsonForm from "ReactJsonSchema";
import { userFundQuery, updateCustomer} from 'Ajax'
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
		this.fetchData()
	}

	fetchData = async () => {
		let loading = false
		let { code, value } = await userFundQuery()
		if (code == 200) {
			let { jsonSchema, listFormData, uiSchema } = value
			this.setState({ jsonSchema: jsonSchema, listFormData, uiSchema: JSON.parse(uiSchema) })
		}
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
		let { listFormData = [], jsonSchema, uiSchema } = this.state
		return (
			<Container  {...this.props}>
				{
					listFormData.map(item => {
						let jsonSchemaNew = Object.assign({}, jsonSchema)
						jsonSchemaNew.title = item.name
						delete jsonSchemaNew.properties.name
						uiSchema["ui:display"] = true
						return (
							<AntdForm
								schema={jsonSchemaNew}
								formData={item}
								uiSchema={uiSchema}
								children={<div />}
						/>
						)
					})
				}
			</Container>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

export default FundInfo