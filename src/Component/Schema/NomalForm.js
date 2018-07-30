/*
 * @Author: aran.hu 
 * @Date: 2017-08-23 10:00:07 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-04 10:57:21
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
import NomalField from './NomalField'

const NomalForm = (props) => {
	const { jsonSchema, formData, submit, btn, uiSchema, btnMsg } = props
	if (!jsonSchema) return <div />
	let a = jsonSchema.properties
	const fields = { nomalField: NomalField };
	const _uiSchema = {
		"ui:field": "nomalField",
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
				showErrorList={false} 
			>
			{
				btn? btn : <div className="btn">
					<Button htmlType="submit" type="primary" >{btnMsg ? btnMsg : '保存'}</Button>
				</div>
			}
			</Form>
		</div>
	)
}
export default NomalForm 