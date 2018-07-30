/*
 * @Author: aran.hu 
 * @Date: 2017-08-23 10:00:07 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-08-30 15:53:20
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
import DisplayField from './DisplayField'

const DisplayForm = (props) => {
	const { 
		jsonSchema, 
		formData, 
		submit, 
		uiSchema, 
		btn, 
		disabled,
		w
	} = props
	if (!jsonSchema) return <div />
	let a = jsonSchema.properties
	const fields = { displayField: DisplayField };
	// const _uiSchema = {
	// 	"defaultGroup": {
	// 		"ui:field": "displayField",
	// 	},
	// }
	const _uiSchema = {
		"jibenitem": {
			"ui:field": "displayField"
		},
		"bankaccountitem": {
			"ui:field": "displayField"
		},
		"dailirenitem": {
			"ui:field": "displayField"
		}
	}

	return (
		<div>
			<Form
				className={"form"}
				schema={jsonSchema}
				uiSchema={uiSchema ? uiSchema : _uiSchema}
				formData={formData}
				fields={fields}
				onSubmit={submit}
				formContext={{w: w, disabled: disabled}}
			>
				{
					btn ? btn :
						<div className="sub-btn" >
							<Button htmlType="" type="primary">编辑</Button>
						</div>
				}
			</Form>
		</div>
	)
}
export default DisplayForm 