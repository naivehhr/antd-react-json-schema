/*
 * @Author: aran.hu 
 * @Date: 2017-08-22 09:26:47 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-04 15:23:49
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
export default class NomalField extends React.Component {
	constructor(props) {
		super(props);
		this.state = { ...props.formData };
	}

	// number
	onChangeNumber(name) {
		return (event) => {
			let v = +event.target.value
			if (!Number.isInteger(v)) return
			this.setState({
				[name]: v
			}, () => this.props.onChange(this.state));
		};
	}

	// string
	onChange(name) {
		return (event) => {
			this.setState({
				[name]: event.target.value
			}, () => this.props.onChange(this.state));
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

	render() {
		const { field1, field2 } = this.state;
		const { schema, formData } = this.props
		// console.log('schema', schema)
		let propertiesMap = this.props.schema.properties
		if (!propertiesMap) return
		// let aa = Object.values(c)
		let propertiesKeys = Object.keys(propertiesMap)
		let contentView = Object.values(propertiesMap).map((value, index) => {
			let fieldName = propertiesKeys[index]
			if (value.hidden) return
			switch (value.type) {
				case "number":
				case "integer":
					return (
						<div>
							<label >{value.title}</label>
							<Input type="text" value={this.state[fieldName]} onChange={this.onChangeNumber(fieldName)} />
						</div>
					)
					break
				case 'string':
					if (value.enum) {
						let ops = []
						for (let i = 0; i < value.enum.length; i++) {
							let c = (
								<Option value={value.enum[i]} >{value.enumNames[i]}</Option>
							)
							ops.push(c)
						}
						return (
							<div>
								<div><label >{value.title}</label></div>
								<Select defaultValue={formData[fieldName]} onChange={this.handleChange.bind(this, fieldName)}>
									{ops}
								</Select>
							</div>
						)
					} else if (value.format) {
						let t = value.format
						switch (t) {
							case "date":
								return (
									<div>
										<div><label >{value.title}</label></div>
										<DatePicker onChange={this.handleDateChange.bind(this, fieldName)} />
									</div>
								)
								break;

							default:
								break;
						}
					} else {
						return (
							<div>
								<label >{value.title}</label>
								<Input type="text" value={this.state[fieldName]} onChange={this.onChange(fieldName)} />
							</div>
						)
					}

					break;
				case 'array':
					return (
						<div>
							<label >{value.title}</label>
							<CheckboxGroup options={value.items.enum} onChange={this.handleChange.bind(this, fieldName)} />
						</div>
					)
					break
				default:
			}
		})
		return (
			<div style={{ padding: 10 }}>
				<div>
					<h4>{schema.title}</h4>
				</div>
				<div>
					{contentView}
				</div>
			</div>
		);
	}
}