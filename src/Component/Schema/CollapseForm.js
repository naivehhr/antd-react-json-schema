/*
 * @Author: aran.hu 
 * @Date: 2017-08-23 10:00:07 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-09 17:18:39
 */
import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import './style.scss';
import ReactJsonForm from "ReactJsonSchema";

import {
	Layout,
	Menu,
	Icon,
	Breadcrumb,
	Button,
	Collapse,
	Input,
	Radio,
	Form
} from 'antd'
const { Header, Content, Sider, Item, Footer } = Layout;
const { SubMenu } = Menu
const Panel = Collapse.Panel
// import Form from "react-jsonschema-form";
import CollapseField from './CollapseField'

const AntdForm = Form.create()(ReactJsonForm)
const CollapseForm = (props) => {
	const {
		jsonSchema,
		formData,
		submit,
		uiSchema,
		btn,
		btnMsg,
		w,
		onChange,
		disabled
	 } = props
	if (!jsonSchema) return <div />
	let a = jsonSchema.properties
	const fields = { collapseField: CollapseField };
	const _uiSchema = {
		// "bankaccountitem": {
		// 	"ui:field": "collapseField",
		// }
	}

	const transformErrors = errors => {
		return errors.map(error => {
			// use error messages from JSON schema if any
			// if (error.schema.messages && error.schema.messages[error.name]) {
			// 	return {
			// 		...error,
			// 		message: error.schema.messages[error.name]
			// 	};
			// }
			return {
				message: `${error.schema.properties[error.argument].title} 不能为空`
			}
		});
	};

	function validate(formData, errors) {
		if (formData.pass1 !== formData.pass2) {
			errors.pass2.addError("Passwords don't match");
		}
		return errors;
	}
	
	// jsonSchema.layout = 'Tabs'
	// jsonSchema.properties = {}
	// jsonSchema.properties.Derived = {
	// 	layout: 'Simple',
	// 	title: '衍生变量',
	// 	titleLevel: '1',
	// 	type: "object",
	// 	properties: {
	// 		DerivedLabel: {
	// 			colum: '2',
	// 			items: {
	// 				type: 'string',
	// 				enum: [1,2,3]
	// 			},
	// 			type: 'array'
	// 		}
	// 	}
	// }
	
	return (
		<div style={{ width: '100%' }}>
			<AntdForm
				className={"form"}
				schema={jsonSchema}
				uiSchema={uiSchema ? uiSchema : _uiSchema}
				formData={formData}
				fields={fields}
				onSubmit={submit}
				onChange={onChange}
				showErrorList={false}
				transformErrors={transformErrors}
				formContext={{ w: w, disabled: disabled }}
			>
				{
					btn ? btn :
						<div className="sub-btn">
							<Button htmlType="submit" type="primary" >{btnMsg ? btnMsg : '保存'}</Button>
						</div>
				}

			</AntdForm>
		</div>
	)
}

export default CollapseForm 