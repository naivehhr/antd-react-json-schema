import React, { Component } from 'react'
import ReactJsonForm from "ReactJsonSchema";
import {
	message,
	Form,
	Button
} from 'antd'
import _ from 'lodash'
import { warpComponentBySchema } from '../PageComponent';
import download from 'downloadjs'
import { fetch } from 'Ajax';
import { processRely } from '../../Util'

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
								"机构审批": "www.baidu.com",
								"用款审批": "www.sina.com"
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
		formData: {
			"allTask": [
				{
					"title": "机构审批", // 每一组
					"taskTotal": 1,
					"showMore": true,
					"content": [ // 每一行
						{
							"id": "lalall",
							"items": [ // 每一对
								{
									"title": "链属企业",
									"value": "山东精密股份公司"
								},
								{
									"title": "借款总金额(元)",
									"value": "1,000.00"
								}
							]
						}
					]
				},
				{
					"title": "用款审批", // 每一组
					"taskTotal": 1,
					"showMore": true,
					"content": [ // 每一行
						{
							"id": "lalall2222222222",
							"items": [ // 每一对
								{
									"title": "链属企业",
									"value": "山东精密股份公司"
								},
								{
									"title": "借款总金额(元)",
									"value": "1,000.00"
								}
							]
						},
						{
							"id": "lalall3333333",
							"items": [ // 每一对
								{
									"title": "链属企业",
									"value": "山东精密股份公司1"
								},
								{
									"title": "借款总金额(元)",
									"value": "2,000.00"
								}
							]
						}
					]
				}
			]
		},
		_schema: {
			"type": "object",
			// "required": ["firstName"],
			"properties": {
				"firstName3": {
					"type": "string",
					"title": "First name"
				},

				"firstName": {
					"type": "string",
					"title": "异步查询",
					"asyncText": true, // 这是干啥的来着
					"widget": "AsyncTextWidget",
					"source_api": "/api/123"
					// "asyncSourceId": "firstNameAsyncSource", // 这里要配置相关联的ID
				},
				// "firstNameAsyncSource": {
				// 	"type": "string",
				// 	"hidden": true,
				// 	"title": "AsyncSource"
				// },
				"agreement_checkbox": {
					"type": "boolean",
					"title": "我已仔细阅读并同意",
					"option": {
						"widget": "AgreementCheckboxWidget",
						"showCheckBox": true,
						"agreement_list": [
							{
								"title": "债权转让协议",
								"action_type": "form",
								"url": "/dd4efc671d1511e8a090080027000c3b/BILL_OPEN_1"
							},
							{
								"title": "平安银行服务协议",
								"action_type": "_blank",
								"url": "www.baidu.com"
							},
						],
					},
				},
				"upload": {
					"type": "string",
					"format": "file-upload",
					"title": "",
					"option": {
						// "onlyOne": true
					}
				},
				"uploadImage": {
					"type": "string",
					"format": "image",
					"title": "上传图片",
					"readonly": false
				}
			},
		},
		_uiSchema: {
			"uploadImage": {
				"ui:widget": "antdPhotoPicker",
				"ui:options": {
					"description": "请上传不超过10M",
					"children": [
						{
							"require": true,
							"label": "点击上传"
						}
					],
					"example": {
						"is_has": true,
						"img_path": "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3071238411,2355145731&fm=27&gp=0.jpg"
					}
				}
			}
			// "firstName": {
			// 	"ui:widget": "AsyncTextWidget"
			// },
			// "firstNameAsyncSource": { "ui:widget": "hidden" }, // 关联ID隐藏
			// "agreement_checkbox": {
			// 	"ui:widget": "AgreementCheckboxWidget"
			// }
		},

		_formData: {
			"agreement_checkbox": false,
			"firstNameAsyncSource": "www.baidu.com"
		},

		_s1: {
			"type": "object",
			"title": "审批链属企业",
			"titleLevel": null,
			"layout": "WholeSchemaLayout",
			"properties": {
				"jibenitem": {
					"type": "object",
					"title": "基本信息",
					"layout": "TitleChildLayout",
					"properties": {
						"num": {
							"type": "number",
							"title": "金额",
							"readonly": false,
							"hidden": false,
							"invisible": false,
							"disable": false,
							"needRequired": false,
							"unique": false,
							"format": "amount",
							"unit": "元",
							"precision": 2, // 这俩就readonly为true时候使用
							"exp": 2
						},
						"user_id": {
							"type": "string",
							"title": "手机号",
							"readonly": false,
							"hidden": false,
							"invisible": false,
							"disable": false,
							"needRequired": false,
							"unique": false,
							"format": "mobile-num"
						},
						"download": {
							"type": "string",
							"title": "下载数据",
							"format": "file-upload"
						},
						"card": {
							"type": "string",
							"title": "银行卡号",
							"readonly": false,
							"hidden": false,
							"invisible": false,
							"disable": false,
							"needRequired": false,
							"unique": false,
							"format": "bank-card",
							"dependency": {
								"type": "equal",
								"key": "user_id"
							}
						},
						"begin_date": {
							"type": "string",
							"title": "单据起始日",
							"format": "date",
							"readonly": false,
							"hidden": false,
							"invisible": false,
							"disable": false,
							"needRequired": false,
							"unique": false,
							"precision": 0,
							"exp": 0,
							"restrain": {
								"operation": "lt",
								// "value": "2018-02-20"
							}
						},
						"end_date": {
							"type": "string",
							"title": "单据结束日",
							"format": "date",
							"readonly": false,
							"hidden": false,
							"invisible": false,
							"disable": false,
							"needRequired": false,
							"unique": false,
							"precision": 0,
							"exp": 0,
							// "restrain": {
							// 	"operation": "gt",
							// 	// "value": "2018-02-16"
							// },
							"dependency": {
								"type": "date_compare",
								"key": "begin_date",
								"operation": "gt",
								// "value": "2018-02-2"
							}
						},
						"is_three_certificate_unit": {
							"type": "boolean",
							"title": "是否三证合一"
						},
						"isUnitInput": {
							"type": "string",
							"title": "营业执照注册号",
							"hidden": false,
						},
						"isUnitInput1": {
							"type": "string",
							"title": "营业执照到期日",
							"hidden": false,
						},
						"isUnitInput2": {
							"type": "string",
							"title": "组织机构代码",
							"hidden": false,
						},
						"unUnitInput": {
							"type": "string",
							"title": "统一社会信用代码",
							"hidden": false,
						},
						"unUnitInput1": {
							"type": "string",
							"title": "营业执照到期日",
							"hidden": false,
						},
					},

					"required": [
						"isUnitInput",
						"isUnitInput1",
						"isUnitInput2",
						"unUnitInput",
						"unUnitInput1"
					],
				}
			},
			"relation": {
				"jibenitem.isUnitInput": {
					rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
					invalidHidden: true
				},
				"jibenitem.isUnitInput1": {
					rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
					invalidHidden: true
				},
				"jibenitem.isUnitInput2": {
					rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
					invalidHidden: true
				},
				"jibenitem.unUnitInput": {
					rely: { "jibenitem.is_three_certificate_unit": [false] },
					invalidHidden: true
				},
				"jibenitem.unUnitInput1": {
					rely: { "jibenitem.is_three_certificate_unit": [false] },
					invalidHidden: true
				}
			},
		},
		_d1: {
			"jibenitem": {
				"num": 123123123,
				"user_id": '15101075739',
				"card": "6228480402564890018",
				"download": '[{"name":"产品募集说明书 (5).pdf","value":"e3e6057d208211e8a0e1929ad07f4a1c"},{"name":"产品募集说明书 (6).pdf","value":"e80b6c3e208211e8a0e1929ad07f4a1c"}]',
				"is_three_certificate_unit": true
			}
		},
		_u1: {
			"customer_layout": "TableLayout_KV",
			"options": { "per_line": 2, "showTitle": false }
		}
	}

	componentDidMount() {
		// const { _s1, _d1 } = this.state
		// let originalSchema = _.cloneDeep(_s1)
		// let schema = processRely(_s1, _d1, originalSchema)
		// this.setState({_s1: schema, originalSchema})
	}
	onChange = (event, id) => {
		// console.log('event', event)
		this.setState({
			_d1: event
		})
	}



	toToAgreement = () => {
		console.log('toToAgreementtoToAgreementtoToAgreement')
		fetch('/enterprise-web-oapi/platform/test/1111/dd4efc671d1511e8a090080027000c3b/BILL_OPEN_1', 'GET')
			.then(d => {
				const { content } = d.value
				return content
			})
			.then(d => {
				let b = new Blob([d], { type: 'application/pdf' })
				console.log(b)
				download(b)
			})
		// .then((c) => {
		// 	// download(blob)
		// 	download(new Blob([uriContent.bold()]), "dlHtmlBlob.pdf", "application/pdf");
		// 	// download(c, "dlText.pdf", "application/pdf");
		// })
	}


	getComponentConfig() {
		let sourceId = 'cha_check_chain_company_info';
		let schema = {
			"components": [
				{
					"component_type": "SchemaDisplay",
					"title": "链属企业详情",
					"source": {
						"fetchSource": {
							"url": "/scmserver/enterprise-web-oapi/platform/func/getByEntityId/",
							"method": "post",
							"params": {
								"staticParams": {
									"sourceId": "cor_check_chain_company_info"
								},
								"urlParams": [
									{
										"key": "chain_entity_id",
										"target_key": "entityId"
									}
								]
							}
						}
					},
					"uiSchema": {
						"business_license_info": {
							"customer_layout": "CollapsePanelDisplay",
							"options": {
								"per_line": 3,
								"disabled": true
							}
						},
						"bank_account_info": {
							"customer_layout": "CollapsePanelDisplay",
							"options": {
								"per_line": 3,
								"disabled": true
							}
						},
						"status": {
							"ui:widget": "hidden"
						}
					}
				},
				{
					"component_type": "ActionButton",
					"title": "查看用款",
					"action": {
						"type": "link",
						"url": "/loanmanage_corecom/loan_list",
						"params": {
							"urlParams": [
								{
									"key": "chain_entity_id",
									"target_key": "entity_id"
								}
							]
						}
					}
				}
			]
		};
		let schema1 = {
			"type": "object",
			"title": "审批链属企业",
			"titleLevel": null,
			"layout": "WholeSchemaLayout",
			"properties": {
				"id": {
					"type": "string",
					"title": "ID",
					"readonly": false,
					"hidden": false,
					"invisible": false,
					"disable": false,
					"needRequired": false,
					"unique": false
				},
				"user_id": {
					"type": "string",
					"title": "用户名",
					"readonly": false,
					"hidden": false,
					"invisible": false,
					"disable": false,
					"needRequired": false,
					"unique": false
				},
				"assign_data": {
					"type": "boolean",
					"title": "是否同意",
					"readonly": false,
					"hidden": false,
					"invisible": false,
					"disable": false,
					"needRequired": false,
					"unique": false
				},
				"auth_type": {
					"type": "string",
					"enumNames": [
						"链属企业"
					],
					"readonly": false,
					"hidden": false,
					"invisible": false,
					"disable": false,
					"needRequired": false,
					"unique": false,
					"default": "CHAIN",
					"enum": [
						"CHAIN"
					]
				},
			},
			"required": [
				"auth_type",
				"assign_data"
			],
			"dbFields": {
				"id": "",
				"user_id": "",
				"assign_data": "",
				"auth_type": ""
			},
			"scenario": null,
			"relation": {

			},
			"requireds": [
				"auth_type",
				"assign_data"
			]
		}
		let components = schema.components.map((componentConfig, index) => {
			return warpComponentBySchema(componentConfig, this.props)
		});
		return components;
	}


	submit = async (formData, callback) => {
		console.log(formData)
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
			_s1,
			_d1,
			_u1
		} = this.state
		let btnNull = (
			<div />
		)
		// let roleUI = this.getComponentConfig();
		return (
			<div>
				{/* <AntdForm
					{...this.props}
					schema={schema}
					uiSchema={uiSchema}
					formData={formData}
					onChange={this.onChange}
					onSubmit={this.submit}
					children={btnNull}
				/> */}
				<AntdForm
					{...this.props}
					schema={_s1}
					formData={_d1}
					//uiSchema={_u1}
					onChange={this.onChange}
					onSubmit={this.submit}

				// schema={_schema}
				// formData={_formData}
				// uiSchema={_uiSchema}
				// onChange={this.onChange}
				// onSubmit={this.submit}
				/>
			</div>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)
export default TaskHome