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
	Input
} from 'antd'
const { Header, Content, Sider, Item, Footer } = Layout;
const { SubMenu } = Menu
const Panel = Collapse.Panel
import { SchemaForm, utils, BaseField, BaseTemp } from 'react-schema-form-antd'
import Form from "react-jsonschema-form";
class CusRegField extends Component {

	componentDidMount() {
	}

	callback = () => { }

	onSubmit = ({ formData }) => {
		console.log({ formData })
	}


	defaultForm() {
		const schema = {
			title: "defaultForm",
			type: "object",
			required: ["title"],
			properties: {
				title: { type: "string", title: "Title", default: "A new task" },
				done: { type: "boolean", title: "Done?", default: false }
			}
		};
		const uiSchema = {
			"title": {
				"ui:readonly": true
			}
		}
		const formData = {
			title: "First task",
			done: true
		};
		return (
			<Form schema={schema} formData={formData} uiSchema={uiSchema} />
		)
	}

	customFieldTemplate() {
		// 设置 description要在uiSchema中`
		const schema = {
			title: "customFieldTemplate",
			type: "object",
			required: ["title"],
			properties: {
				title: { type: "string", title: "Title", default: "A new task" },
			}
		};

		const uiSchema = {
			"title": {
				// "ui:readonly": true,
				// "ui:help": "Hint: Make it strong!", 
				// "ui:description": "The best password",
				"ui:field": "geo", // 自定义的weigth怎么写
			}
		}
		const fields = {geo: GeoPosition}; // 自定义fields


		// 这基本是完全重新定义了field 故当然也可以更改为antd的风格
		function CustomFieldTemplate(props) {
			const { id, classNames, label, help, required, description, errors, children } = props;
			return (
				<div className={classNames}>
					<label htmlFor={id}>{label}{required ? "*" : null}</label>
					{description}
					{children}
					{errors}
					{help}
				</div>
			);
		}

		return (
			<Form 
				schema={schema} 
				FieldTemplate={CustomFieldTemplate} 
				uiSchema={uiSchema}
				fields={fields}
			/>
		)
	}

	renderSchemaForm = () => {
		return (
			<div>
				<Collapse defaultActiveKey={['1']}>
					<Panel header="This is panel header 1" key="1">
						{this.customFieldTemplate()}
					</Panel>
				</Collapse>
			</div>
		)
	}

	onChange(type, a) {
		console.log(type)
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
class GeoPosition extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...props.formData };
	}

	componentWillReceiveProps(nextProps) {
		console.log('nextProps', nextProps);
	}
	
	onChange(name) {
		return (event) => {
			this.setState({
				[name]: event.target.value
			}, () => this.props.onChange(this.state));
		};
	}

	render() {
		const { title } = this.state;
		console.log(title)
		return (
			<div>
				<Input placeholder="Basic usage" value={title} onChange={this.onChange("title")}/>
			</div>
		);
	}
}
export default CusRegField