/*
 * @Author: aran.hu 
 * @Date: 2017-08-22 09:26:47 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-08-31 16:05:31
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
	Radio,
	Select,
	DatePicker,
	Checkbox
} from 'antd'
const Panel = Collapse.Panel
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Apple', 'Pear', 'Orange'];
export default class DisplayField extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...props.formData };
	}

	// event
	onChange(name) {
		return (event) => {
			this.setState({
				[name]: event.target.value
			}, () => this.props.onChange(this.state));
			// console.log('---', this.props.formData)
		};
	}

	//string
	handleChange(key, value) {
		this.setState({
			[key]: value
		}, () => this.props.onChange(this.state));
	}

	// Date
	handleDateChange(key, value) {
		this.setState({
			[key]: value ? value.format("YYYY-MM-DD") : ''
		}, () => this.props.onChange(this.state));
	}

	renderDiv(w, v) {
		if (!w) return <div>{v}</div>
		return (
			<div style={{
				width: `${w}%`,
				display: 'inline-block',
				paddingRight: 10
			}}
			>
				{v}
			</div>
		)
	}

	render() {
		const { schema, formData, formContext } = this.props
		let propertiesMap = this.props.schema.properties
		if (!propertiesMap) return
		let propertiesKeys = Object.keys(propertiesMap)
		let contentView = Object.values(propertiesMap).map((value, index) => {
			let fieldName = propertiesKeys[index]
			if(value.hidden) return
			let _text = formData[fieldName]
			if (value.enum) {
				let _i = value.enum.indexOf(_text)
				_text = value.enumNames[_i]
			}
			if(typeof _text === "boolean") {
				_text = _text?'是': '否'
			}
			let itemView = (
				<div className="field">
					<div className="name">
						<span>{value.title}</span>
					</div>
					<div className="value">
						<span style={{ marginLeft: 10 }}>{_text}</span>
					</div>
				</div>
			)
			return this.renderDiv(formContext.w, (itemView))
		})
		return (
			<div className="contain">
				<Collapse defaultActiveKey={['1']} >
					<Panel disabled={formContext.disabled} className="display" header={schema.title} key="1" >
						{contentView}
					</Panel>
				</Collapse>
			</div>
		);
	}
}