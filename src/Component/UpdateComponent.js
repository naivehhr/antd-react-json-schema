/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-28 16:12:09
 */


import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'

import {
	message,
	Form
} from 'antd'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import ReactJsonForm from "ReactJsonSchema";

import Container from 'Page/Container'
class UpdateComponent extends Component {
	constructor() {
		super()
		this.state = {
			schema: null,
			uiSchema: null,
			formData: null
		}
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData = async () => {
		const { query } = this.props.router.location
		if (!query) return
		const { id } = query
		let result
		if (this.props.fetchDataParams) {
			result = await this.props.fetchDataFun(this.props.fetchDataParams)
		} else {
			result = await this.props.fetchDataFun()
		}
		if (result.code !== 200) {
			browserHistory.goBack()
			return
		}
		let { jsonSchema, formData, uiSchema } = result.value
		jsonSchema.layout = "ContainerPadding" //zjx 带有Padding值的Layout
		this.setState({ schema: jsonSchema, formData: formData, uiSchema: JSON.parse(uiSchema) })
	}

	onChange = (event, id) => {
		console.log('UpdateComponent change', event)
		this.setState({
			formData: event
		})
	}

	submit = async (formData, callback) => {
		let result = await this.props.submitFun({ "formData": formData })
		let { code } = result
		if (code == 200) {
			if (this.props.submitSuccMsg === undefined) {
				message.success('更新成功')
			} else if (this.props.submitSuccMsg) {
				message.success(this.props.submitSuccMsg)
			}
			const { state } = this.props.location.query
			const { pushParams = {} } = this.props
			browserHistory.push({
				pathname: this.props.pushOnSubmit,
				state: { submitResult: result, params: { formData: formData, ...pushParams } }
			})
		} else {
			callback({ 'formError': result.value.errors })
			if (this.props.submitErrMsg === undefined) {
				message.error('更新失败');
			} else if (this.props.submitErrMsg) {
				message.error(this.props.submitErrMsg)
			}
		}
	}

	render() {
		const {
			schema,
			uiSchema,
			formData
		} = this.state
		if (!this.state.schema) return <div />
		uiSchema["ui:titleFormat"] = this.props.titleFormat ? this.props.titleFormat : "form"
		return (
			<AntdForm
				schema={schema}
				uiSchema={uiSchema}
				formData={formData}
				onChange={this.onChange}
				onSubmit={this.submit} />
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

const AntdForm = Form.create()(ReactJsonForm)

export default connect(mapStateToProps)(UpdateComponent)