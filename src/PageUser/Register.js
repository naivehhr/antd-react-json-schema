/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-07 19:26:46
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import { connect } from 'react-redux'

import { message, Steps, Layout, Menu, Breadcrumb, Icon, Tabs, Row, Col, Form, Input, Button } from 'antd'
const Step = Steps.Step
const TabPane = Tabs.TabPane
const FormItem = Form.Item

const { SubMenu } = Menu;
const { Content, Sider } = Layout;
import CollapseForm from 'Component/Schema/CollapseForm'
import { getCreactCustomerUserSchema, addCustomerUser } from 'Ajax'
import HeaderSelf from 'Component/Header'
import { CustomerSider } from 'Dict/CustomerSider'
import Container from 'Page/Container'
import Header from 'Component/Header/user'

import {
	sendCodeCoreUser,
	loginCoreUser,
} from 'Ajax'

class LoginForm extends Component {
	login = async (data) => {
		let mobile = this.props.form.getFieldValue('mobile')
		let code = this.props.form.getFieldValue('code')
		let result = await loginCoreUser({
			"code": code,
			"mobile": mobile
		})
		if (result.code == 200) {
			this.props.dispatch(updateUserInfo({ customerName: mobile, isLogin: true }))
			hashHistory.replace("/loanrequest/list")
		}
	}

	sendCode = async (data) => {
		let mobile = this.props.form.getFieldValue('mobile')
		let result = await sendCodeCoreUser({ "mobile": mobile })
		let { code } = result
		if (code == 200) {
			// this.props.dispatch(updateUserInfo())
		}
	}
	render() {
		const { getFieldDecorator, getFieldError, isFieldValidating, getFieldsValue } = this.props.form
		const nameProps = getFieldDecorator('mobile', {
			rules: [
				{ required: true, min: 5, message: '用户名至少为5个字符' },
				{ validator: this.userExists },
			],
		})

		const passwdProps = getFieldDecorator('code', {
			rules: [
				{ required: true, whitespace: true, message: '请填写密码' },
				{ validator: this.checkPass },
			],
		})
		const formItemLayout = {
			labelCol: { span: 7 },
			wrapperCol: { span: 12 },
		}

		return <div className="welcom-login">
			<Row>
				<Col span={12} offset={6}>
					<Form>
						<FormItem
							{...formItemLayout}
							label="手机号"
							hasFeedback
						>
							{
								nameProps(<Input placeholder="输入代理人手机号" />)
							}
						</FormItem>
						<FormItem label="验证码" {...formItemLayout} >
							<Row>
								<Col span="18">
									{
										passwdProps(<Input type="code" placeholder="" />)
									}
								</Col>
								<Col span="6">
									<Button style={{ marginLeft: 15 }} type="default" onClick={this.sendCode}>发送验证码</Button>
								</Col>
							</Row>
						</FormItem>
						<FormItem wrapperCol={{ span: 12, offset: 7 }}>
							<Button type="primary" onClick={this.login}>登录</Button>
						</FormItem>
					</Form>
				</Col>
			</Row>
		</div>
	}
}

const WrappedLoginForm = Form.create()(LoginForm)

import CreateComponent from 'Component/CreateComponent'
class Register extends Component {
	constructor() {
		super()
		this.state = {
			activeTab: 0,
			jsonSchema: null,
			uiSchema: null,
			marginLeft: 0
		}
	}

	componentDidMount() {
		this.fetchData()
		// console.log('?', this.props)
	}

	fetchData = async () => {
		let loading = false
		let result = await getCreactCustomerUserSchema()
		let { jsonSchema, uiSchema } = result.value
		this.setState({ jsonSchema: jsonSchema, uiSchema: JSON.parse(uiSchema) })
	}

	submit = async ({ formData }) => {
		let result = await addCustomerUser({ "formData": formData })
		let { code } = result
		if (code == 200) {
			message.success('注册成功');
			hashHistory.push('/login')
		} else {
			message.error('注册失败');
		}
	}
	handleSelectTab = idx => () => {
		this.setState({
			activeTab: idx,
			marginLeft: -100 * idx
		})
	}

	render() {
		const { marginLeft, activeTab } = this.state
		return (
			<div style={{ position: 'absolute', width: '100%', top: 0, bottom: 0, backgroundColor: 'white' }}>
				<div className="page register">
					<header className="register-header">
						<h1 className="title">供应链管理平台</h1>
						<ul className="register-tab">
							<li onClick={this.handleSelectTab(0)} className={activeTab == 0 ? 'active' : ''}>登录</li>
							<li onClick={this.handleSelectTab(1)} className={activeTab == 1 ? 'active' : ''}>注册</li>
						</ul>
					</header>
					<div style={{ marginLeft: `${marginLeft}%` }} className="register-body">
						<div className={`register-tab-body ${activeTab == 0 ? 'active' : 'inactive'}`}>
							<WrappedLoginForm />
						</div>
						<div className={`register-tab-body ${activeTab == 1 ? 'active' : 'inactive'}`}>
							<Steps className="register-step" current={0}>
								<Step title="基本信息" />
								<Step title="银行账户信息" />
								<Step title="代理人信息" />
							</Steps>
							<CreateComponent
								{...this.props}
								fetchDataFun={getCreactCustomerUserSchema}
								submitFun={addCustomerUser}
								pushOnSubmit={'/login'}
								titleFormat="none"
								submitSuccMsg={"注册成功"}
								submitErrMsg={"注册失败"}
							/>
						</div>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.user
	}
}

export default connect(mapStateToProps)(Register)