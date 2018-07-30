/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2018-01-27 17:31:56
 */


import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { connect } from 'react-redux'
import { processRely } from '../Util'
import {
	message,
	Form
} from 'antd'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import ReactJsonForm from "ReactJsonSchema";

import Container from 'Page/Container'
class CreateComponent extends Component {
	constructor() {
		super()
		this.state = {
			schema: null,
			originalState: null,
			uiSchema: null,
			formData: null
		}
	}

	componentDidMount() {
		const { state } = this.props.location
		if (state && state.params) {
			this.setState({ formData: state.params.formData })
		} else if (this.props.formData) {
			this.setState({ formData: this.props.formData })
		}
		this.fetchData()
	}

	fetchData = async () => {
		let loading = false
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
		let { jsonSchema, formData } = result.value
		if (jsonSchema.layout == null) { 
			jsonSchema.layout = "ContainerPadding" //zjx 带有Padding值的Layout
		}
		let uiSchema = this.props.uiSchema;
		this.setState({ 
			schema: jsonSchema, 
			formData: formData,
			originalState: jsonSchema,
			uiSchema: uiSchema
		}, () => {
			let schema = processRely(this.state, this.state.originalState)
			this.setState({ schema })
		})
	}

	submit = async (formData, callback) => {
		let { submitAddParams } = this.props;
		submitAddParams = submitAddParams == null ? {} :submitAddParams;
		submitAddParams.formData = formData;
		let result = await this.props.submitFun(submitAddParams)
		let { code } = result
		if (code == 200) {
			if (this.props.submitSuccMsg === undefined) {
				message.success('创建成功')
			} else if (this.props.submitSuccMsg) {
				message.success(this.props.submitSuccMsg)
			}
			if (this.props.pushOnSubmitCallback) {
				this.props.pushOnSubmitCallback(formData);
				return;
			}
			browserHistory.push({
				pathname: this.props.pushOnSubmit,
				state: { submitResult: result, params: { formData: formData } }
			})
		} else {
			// error msg callback 
			callback({'formError': result.value.errors})
			if (this.props.submitErrMsg === undefined) {
				message.error('创建失败');
			} else if (this.props.submitErrMsg) {
				message.error(this.props.submitErrMsg)
			}
		}
	}

	onChange = (event, id) => {
		// console.log('CreateComponent change', event)
		this.setState({
			formData: event
		}, () => {
			let schema = processRely(this.state, this.state.originalState)
			this.setState({ schema })
		})
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
				{...this.props}
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

export default connect(mapStateToProps)(CreateComponent)
