/*
 * @Author: aran.hu 
 * @Date: 2017-08-22 13:26:47 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-08-25 15:38:28
 */
import React, { Component } from 'react'
import { hashHistory, Link } from 'react-router'
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
	Modal,
	Checkbox
} from 'antd'
const CheckboxGroup = Checkbox.Group;
const { Header, Content, Sider, Item, Footer } = Layout;
const { SubMenu } = Menu
const Panel = Collapse.Panel
import Form from "react-jsonschema-form";
import BaseInput from "react-jsonschema-form/lib/components/widgets/BaseInput"
import { getCreactCustomerSchema, addCustomer } from 'Ajax'
import CollapseForm from 'Component/Schema/CollapseForm'
import NomalForm from 'Component/Schema/NomalForm'
import DisplayForm from 'Component/Schema/DisplayForm'
import Container from 'Page/Container'

const plainOptions = ['Apple', 'Pear', 'Orange'];
class CusRegField extends Component {

	constructor() {
		super()
		this.state = {
			visible: false,
			formData: {
				"defaultGroup": {
					"certIntegration": "是",
					"agentIdNo": "1",
					"agentIdType": "2",
					"agentMobile": "3"
				}
			},
			jsonSchema: {
				"type": "object",
				"title": "新建客户",
				"properties": {
					"defaultGroup": {
						"type": "object",
						"title": "基本信息",
						"properties": {
							"certIntegration": {
								"type": "string",
								"title": "是否三证合一"
							},
							"licenseNo": {
								"type": "string",
								"title": "营业执照号码"
							},
							"agentIdNo": {
								"type": "string",
								"title": "代理人证件号码"
							},
							"agentName": {
								"type": "string",
								"title": "代理人姓名"
							},
							"agentMobile": {
								"type": "string",
								"title": "代理人手机号码"
							},
							"name": {
								"type": "string",
								"title": "客户名称"
							},
							"agentIdType": {
								"type": "string",
								"title": "代理人证件类型"
							}
						},
						"required": null
					}
				}
			}
		}
	}
	componentDidMount() {
		// this.fetchData()
	}

	showModal = () => {
		this.setState({
			visible: true,
		});
	}

	handleOk = (e) => {
		console.log(e);
		this.setState({
			visible: false,
		});
	}
	handleCancel = (e) => {
		console.log(e);
		this.setState({
			visible: false,
		});
	}

	fetchData = async () => {
		let loading = false
		let result = await getCreactCustomerSchema()
		let { jsonSchema } = result.value
		// console.log(jsonSchema)
		this.setState({
			jsonSchema: JSON.parse(jsonSchema)
		})
	}

	renderSchemaForm = () => {
		// const { jsonSchema } = this.state
		// if (!jsonSchema) return
		// let a = jsonSchema.properties
		const schema = {
			"type": "object",
			"title": "新建客户",
			"properties": {
				"defaultGroup": {
					"type": "object",
					"title": "基本信息",
					"properties": {
						"certIntegration": {
							"type": "string",
							"title": "是否三证合一"
						},
					},
					"required": null
				}
			}
		}
		const fields = { collapseField: CollapseField };
		const uiSchema = {
			"defaultGroup": {
				"ui:field": "collapseField",
			}
		}
		const formData = {
			// "group1": {
			// 	"field2": "1",
			// 	"field1": "2"
			// },
			// "group2": {
			// 	"field22": "2",
			// 	"field11": "3"
			// }
		}
		return (
			<div>
				<CollapseForm
					schema={schema}
					uiSchema={uiSchema}
					onSubmit={this.submit}
					fields={fields}
				/>
			</div>

		)
	}

	callback = () => { }

	onChange = (checkedValues) => {
		console.log('checked = ', checkedValues);
	}

	submit = async ({ formData }) => {
		console.log(JSON.stringify(formData))
		// let result = await addCustomer({
		// 	"formData": JSON.stringify(formData)
		// })
		// console.log('result==', result)
	}

	render() {
		const schema = {
			"type": "object",
			"title": "新建客户",
			"properties": {
				"defaultGroup": {
					"type": "object",
					"title": "基本信息",
					"properties": {
						"certIntegration": {
							"type": "string",
							"title": "是否三证合一"
						},
						"date": {
							"type": "string",
							"title": "选择日期",
							"format": "date"
						},
						"file": {
							"type": "string",
							"format": "data-url",
							"title": "文件上传"
						},
						"files": {
							"type": "array",
							"title": "显示已上传文件列表",
							"items": {
								"type": "string",
								"format": "data-url"
							}
						}
					},
					"required": null
				}
			}
		}
		const fields = { collapseField: CollapseField };
		const uiSchema = {
			"defaultGroup": {
				"ui:field": "collapseField",
			}
		}
		return (
			<Container {...this.props}>
				<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
					<p style={{ fontSize: 16 }}>注册字段</p>
					<div className="mybtn-group">
						<Button className="mybtn-group-btn">编辑选项</Button>
						<Button>编辑全部信息</Button>
					</div>
					<div>
						<Button type="primary" onClick={this.showModal}>Open</Button>
						<Modal
							title="Basic Modal"
							visible={this.state.visible}
							onOk={this.handleOk}
							onCancel={this.handleCancel}
						>
							<CheckboxGroup options={plainOptions} defaultValue={['Apple']} onChange={this.onChange} />
						</Modal>
					</div>
					<div>
						<CollapseForm
							jsonSchema={schema}
							uiSchema={uiSchema}
							fields={fields}
						/>
					</div>
					<div >
					</div>
				</div>
			</Container>
		)
	}
}
class CollapseField extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...props.formData };
	}

	onChange(name) {
		return (event) => {
			this.setState({
				[name]: event.target.value
			}, () => this.props.onChange(this.state));
		};
	}

	render() {
		const { field1, field2 } = this.state;
		const { schema, formData } = this.props
		let propertiesMap = this.props.schema.properties
		if (!propertiesMap) return
		// let aa = Object.values(c)
		let propertiesKeys = Object.keys(propertiesMap)
		let contentView = Object.values(propertiesMap).map((value, index) => {
			let fieldName = propertiesKeys[index]
			switch (value.type) {
				case 'string':
					return (
						<div>
							<label >{value.title}</label>
							<Input type="text" value={this.state[fieldName]} onChange={this.onChange(fieldName)} />
						</div>
					)
					break;
				case 'radio':
					return (
						<div>
							<Radio value={1}>A</Radio>
						</div>
					)
					break
				default:
			}
		})
		return (
			<div>
				<Collapse defaultActiveKey={['1']} >
					<Panel header={schema.title} key="1">
						{contentView}
					</Panel>
				</Collapse>
			</div>
		);
	}
}

export default CusRegField