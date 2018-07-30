/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-28 16:13:00
 */


import React, { Component } from 'react'
import ReactJsonForm from "ReactJsonSchema";
import { browserHistory } from 'react-router'
import {
	Form
} from 'antd'
class InfoComponent extends Component {
	constructor() {
		super()
		this.state = {
			schema: null,
			uiSchema: null,
			formData: null
		}
	}
	componentDidMount() {
		const { state } = this.props.location
		if (state && state.params) {
			this.setState({ formData: state.params.formData })
		}
		this.fetchData()
	}

	fetchData = async () => {
		let loading = false
		let result 
		if(this.props.fetchDataParams ) {
			result = await this.props.fetchDataFun(this.props.fetchDataParams)
		} else {
			result = await this.props.fetchDataFun()
		}
		if(result.code !== 200) {
			browserHistory.goBack()
			return
		}
		let { jsonSchema, uiSchema, formData } = result.value
		jsonSchema.layout = "Block" //zjx
		jsonSchema.titleLevel = "one" //zjx
		this.setState({
			schema: jsonSchema,
			uiSchema: typeof uiSchema == 'object'?uiSchema: JSON.parse(uiSchema),
			formData: formData
		})
	}

	render() {
		const {
			schema,
			uiSchema,
			formData,
		} = this.state
		if (!this.state.schema) return <div />
		uiSchema["ui:titleFormat"] = this.props.titleFormat ? this.props.titleFormat : "form"
		uiSchema["ui:display"] = true
		return (
			<div>
				<AntdForm
					schema={schema}
					uiSchema={uiSchema}
					formData={formData}
					children={<div />}
				/>
			</div>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)
export default InfoComponent