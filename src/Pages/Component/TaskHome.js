import React, { Component } from 'react'
import ReactJsonForm from "ReactJsonSchema";
import {
	message,
	Form
} from 'antd'
import _ from 'lodash'
import { fetch } from 'Ajax';
import './taskHome.scss'

class TaskHome extends Component {

	state = {
		schema: {
			"title": "主页",
			"type": "object",
		},
		uiSchema: {
			"customer_layout": 'DisplayTableLayout',
			"allTask":
				{
					"content":
						{
							"url_map": {
								"机构审批": {
									"list": "mock list",
									"item": "mock item"
								},
								"用款审批": {
									"list": "mock list",
									"item": "mock item"
								}
							},
							"actionBtns": [
								{
									"title": "审批",
									"params": "id"
								}
							]
						}
				}
		},
		formData: {},
		// formData: {
		// 	"allTask": [
		// 		{
		// 			"title": "机构审批", // 每一组
		// 			"taskTotal": 1,
		// 			"showMore": true,
		// 			"content": [ // 每一行
		// 				{
		// 					"id": "lalall",
		// 					"items": [ // 每一对
		// 						{
		// 							"title": "Mock Data",
		// 							"value": "山东精密股份公司"
		// 						},
		// 						{
		// 							"title": "Mock Data",
		// 							"value": "1,000.00"
		// 						}
		// 					]
		// 				}
		// 			]
		// 		},
		// 		{
		// 			"title": "用款审批", // 每一组
		// 			"taskTotal": 1,
		// 			"showMore": true,
		// 			"content": [ // 每一行
		// 				{
		// 					"id": "lalall2222222222",
		// 					"items": [ // 每一对
		// 						{
		// 							"title": "链属企业",
		// 							"value": "山东精密股份公司"
		// 						},
		// 						{
		// 							"title": "借款总金额(元)",
		// 							"value": "1,000.00"
		// 						}
		// 					]
		// 				},
		// 				{
		// 					"id": "lalall3333333",
		// 					"items": [ // 每一对
		// 						{
		// 							"title": "链属企业",
		// 							"value": "山东精密股份公司1"
		// 						},
		// 						{
		// 							"title": "借款总金额(元)",
		// 							"value": "2,000.00"
		// 						}
		// 					]
		// 				}
		// 			]
		// 		}
		// 	]
		// },
		_schema: {
			"type": "object",
			"required": ["firstName"],
			"properties": {
				"firstName3": {
					"type": "string",
					"title": "First name"
				},
				"firstName": {
					"type": "string",
					"title": "测试联动",
					"asyncText": true,
					"asyncSourceId": "firstNameAsyncSource", // 这里要配置相关联的ID
				},
				"firstNameAsyncSource": {
					"type": "string",
					"title": "AsyncSource"
				},
				"agreement_checkbox": {
					"type": "object",
					"title": '',
					"properties": {
						"isAgreement": {
							"type": "boolean",
							"title": "我已仔细阅读并同意",
							"showCheckBox": true, // 是否显示CheckBox
						},
					}
				},
			},
		},
		_uiSchema: {
			"firstName": {
				"ui:widget": "AsyncTextWidget"
			},
			"firstNameAsyncSource": { "ui:widget": "hidden" }, // 关联ID隐藏
			"agreement_checkbox": {
				"isAgreement": {
					"ui:widget": "AgreementCheckboxWidget"
				},
			}
		},

		_formData: {
			"agreement_checkbox": {
				"isAgreement": [{
					"value": true
				}, {
					"agreements": [
						{
							"title": "债权转让协议",
							"url": "/myinfo/entityinfo"
						},
						{
							"title": "平安银行方服务协议",
							"url": "/myinfo/entityinfo"
						}
					]
				}],
			},
			"firstNameAsyncSource": "www.baidu.com"
		},
		s: {
			"type": "object",
			"title": "票据转让",
			"titleLevel": null,
			"layout": "WholeSchemaLayout",
			"properties": {
				"transfer_info": {
					"type": "object",
					"title": "转让信息",
					"titleLevel": null,
					"modal": false,
					"layout": "TitleChildLayout",
					"properties": {
						"transfer_items": {
							"type": "array",
							"title": "转让组织机构代码/身份证号码",
							"titleLevel": null,
							"modal": false,
							"layout": null,
							"properties": null,
							"items": {
								"type": "object",
								"required": [
									"transfer_owner_code",
									"transfer_amount"
								],
								"properties": {
									"transfer_owner_code": {
										"type": "string",
										"title": "转让组织机构代码/身份证号码",
										"readonly": false,
										"hidden": false,
										"invisible": false,
										"disable": false,
										"needRequired": false,
										"unique": false
									},
									"transfer_amount": {
										"type": "number",
										"title": "转让金额",
										"readonly": false,
										"hidden": false,
										"invisible": false,
										"disable": false,
										"needRequired": false,
										"unique": false
									}
								}
							},
							"required": null
						},
						"bill_id": {
							"type": "string",
							"title": "被转让票据ID",
							"readonly": false,
							"hidden": false,
							"invisible": false,
							"disable": false,
							"needRequired": false,
							"unique": false
						}
					},
					"required": []
				}
			},
			"required": [],
			"dbFields": {
				"transfer_items": "",
				"bill_id": ""
			},
			"scenario": null,
			"relation": {},
			"requireds": []
		},
		d: {}
	}

	componentDidMount() {
		const { schema } = this.props
		const { fetchSource } = schema
		let promise = fetch(fetchSource.url, fetchSource.method);
		promise.then(d => {
			// console.log(d.value)
			this.setState({ formData: d.value, uiSchema: schema.uiSchema })
		})
	}

	onChange = (event, id) => {
		console.log('event', event)
		this.setState({
			d: event
		})
	}

	toToAgreement = () => {
		console.log('toToAgreementtoToAgreementtoToAgreement')
	}

	submit = async (formData, callback) => {
		// console.log(formData)
	}

	validate(formData, errors, errorSchema) {
		/**
		 * 判断协议是否勾选改变页面交互
		 */
		if (!formData.agreement_checkbox.isAgreement[0].value) {
			message.error('请勾选协议')
		}
		return { formData, errors, errorSchema };
	}


	render() {
		const {
			schema,
			uiSchema,
			formData,
			_schema,
			_uiSchema,
			_formData,
			s,
			d
		 } = this.state
		let btnNull = (
			<div />
		)
		if (Object.keys(formData).length < 1) return <div>loading</div>
		return (
			<div className="task-home">
				<AntdForm
					{...this.props}
					schema={schema}
					uiSchema={uiSchema}
					formData={formData}
					onChange={this.onChange}
					onSubmit={this.submit}
					children={btnNull}
				/>
				{/* <AntdForm
					{...this.props}
					schema={_schema}
					uiSchema={_uiSchema}
					formData={_formData}
					onChange={this.onChange}
					onSubmit={this.submit}
					validate={this.validate}
				/> */}
			</div>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

function warpComponent(schema, props) {
	return <TaskHome schema={schema} oprops={props} />
}

const ComponentModule = {
	warpComponent: warpComponent
};

export default ComponentModule;