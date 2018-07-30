/*
 * @Author: aran.hu 
 * @Date: 2017-08-22 13:26:47 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-08-22 14:27:17
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
	Radio
} from 'antd'
const { Header, Content, Sider, Item, Footer } = Layout;
const { SubMenu } = Menu
const Panel = Collapse.Panel
import Form from "react-jsonschema-form";
import BaseInput from "react-jsonschema-form/lib/components/widgets/BaseInput"
import { getCreactCustomerSchema, addCustomer } from 'Ajax'

class CusRegField extends Component {

	constructor() {
		super()
		this.state = {
			jsonSchema: null
		}
	}
	componentDidMount() {
		this.fetchData()
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
		const { jsonSchema } = this.state
		if(!jsonSchema) return
		let a = jsonSchema.properties
		const schema = {
			"type": "object",
			"title": "新建客户",
			"properties": {
				"group1": {
					"type": "object",
					"title": "基本信息",
					"properties": {
						"field2": {
							"type": "radio",
							"title": "行业类别"
						},
						"field1": {
							"type": "string",
							"title": "客户名称"
						}
					},
					"required": []
				},
				"group2": {
					"type": "object",
					"title": "法人信息",
					"properties": {
						"field22": {
							"type": "string",
							"title": "法人代表证件类型"
						},
						"field11": {
							"type": "string",
							"title": "法人代表名称"
						}
					},
					"required": []
				}
			}
		}
		const fields = { collapseField: CollapseField };
		const uiSchema = {
			"group1": {
				"ui:field": "collapseField",
			},
			"group2": {
				"ui:field": "collapseField",
			},
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
				<Form
					schema={jsonSchema}
					uiSchema={uiSchema}
					formData={formData}
					onSubmit={this.submit}
					fields={fields}
				/>
			</div>

		)
	}

	callback = () => { }

	submit = async ({ formData }) => {
		let result = await addCustomer(JSON.stringify(formData))
		console.log(formData)
		console.log('result==', result)
	}

	render() {
		return (
			<Layout style={{ height: "100vh" }}>
				<Header style={{ background: '#fff', padding: 0 }} >header</Header>
				<Layout >
					<Sider collapsible>
						<Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
							<SubMenu key="sub1" title={<span><Icon type="mail" /><span>自定义注册字段</span></span>}>
								<Menu.Item key="1">编辑注册字段</Menu.Item>
							</SubMenu>
							<SubMenu key="sub2" title={<span><Icon type="mail" /><span>自定义用款字段</span></span>}>
								<Menu.Item key="1">编辑用款字段</Menu.Item>
							</SubMenu>
						</Menu>
					</Sider>
					<Content style={{ margin: '0 16px' }}>
						<Breadcrumb style={{ margin: '12px 0' }}>
							<Breadcrumb.Item>Home</Breadcrumb.Item>
							<Breadcrumb.Item>List</Breadcrumb.Item>
							<Breadcrumb.Item>App</Breadcrumb.Item>
						</Breadcrumb>
						<div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
							<p style={{ fontSize: 16 }}>注册字段</p>
							<div className="mybtn-group">
								<Button className="mybtn-group-btn">编辑选项</Button>
								<Button>编辑全部信息</Button>
							</div>
							<div>
								{this.renderSchemaForm()}
							</div>
						</div>
					</Content>

				</Layout>
				<Footer style={{ textAlign: 'center' }}>
					Ant Design ©2016 Created by Ant UED
				</Footer>
			</Layout>
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