/*
 * @Author: aran.hu 
 * @Date: 2017-08-22 09:26:47 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-04 15:54:42
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
	Checkbox,
	Upload,
	message,
} from 'antd'
const Panel = Collapse.Panel
const Option = Select.Option;
const { MonthPicker, RangePicker } = DatePicker;
const CheckboxGroup = Checkbox.Group;
const plainOptions = ['Apple', 'Pear', 'Orange'];
const RadioGroup = Radio.Group;

export default class CollapseField extends React.Component {
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

	handleChangeBoolean(key, event) {
		this.setState({
			[key]: event.target.value
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
		// let aa = Object.values(c)
		let propertiesKeys = Object.keys(propertiesMap)
		let contentView = Object.values(propertiesMap).map((value, index) => {
			let fieldName = propertiesKeys[index]
			if (value.hidden) return
			let itemView = null
			switch (value.type) {
				case "number":
				case "integer":
					itemView = (
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
						itemView = (
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
								itemView = (
									<div>
										<div><label >{value.title}</label></div>
										<DatePicker onChange={this.handleDateChange.bind(this, fieldName)} />
									</div>
								)
								break;
							case "data-url":
								const _props = {
									name: 'file',
									action: '//jsonplaceholder.typicode.com/posts/',
									headers: {
										authorization: 'authorization-text',
									},
									onChange(info) {
										if (info.file.status !== 'uploading') {
											console.log(info.file, info.fileList);
										}
										if (info.file.status === 'done') {
											message.success(`${info.file.name} 上传成功！`);
										} else if (info.file.status === 'error') {
											message.error(`${info.file.name} 上传失败！`);
										}
									},
								};
								itemView = (
									<div>
										<div><label >{value.title}</label></div>
										<Upload {..._props}>
											<Button>
												<Icon type="upload" /> 选择文件
    										</Button>
										</Upload>
									</div>
								)
							default:
								break;
						}
					} else {
						itemView = (
							<div >
								<label >{value.title}</label>
								<Input type="text" value={this.state[fieldName]} onChange={this.onChange(fieldName)} />
							</div>
						)
					}

					break;
				case 'array':
					let format = value.items.format
					if (format) {
						switch (format) {
							case 'data-url':
								const _props = {
									action: '//jsonplaceholder.typicode.com/posts/',
									onChange({ file, fileList }) {
										if (file.status !== 'uploading') {
											console.log(file, fileList);
										}
									},
									defaultFileList: [],
								};
								itemView = (
									<div>
										<label >{value.title}</label>
										<Upload {..._props}>
											<Button>
												<Icon type="upload" /> 上传
    									</Button>
										</Upload>
									</div>
								)
								break;

							default:
								break;
						}
					} else {
						itemView = (
							<div>
								<label >{value.title}</label>
								<CheckboxGroup options={value.items.enum} onChange={this.handleChange.bind(this, fieldName)} />
							</div>
						)
					}
					break
				case 'boolean':
					itemView = (
						<div style={{paddingTop: 5}}>
							<label >{value.title}</label>
							<div>
								<RadioGroup onChange={this.handleChangeBoolean.bind(this, fieldName)} value={this.state[fieldName]}>
									<Radio value={true}>是</Radio>
									<Radio value={false}>否</Radio>
								</RadioGroup>
							</div>
						</div>
					)
					break
				default:
					console.log('字段类型匹配失败', value.type)
			}
			return this.renderDiv(formContext.w, (itemView))
		})
		return (
			<div className="contain">
				<Collapse defaultActiveKey={['1']} >
					<Panel disabled={formContext.disabled} header={schema.title} key="1" >
						{contentView}
					</Panel>
				</Collapse>
			</div>
		);
	}
}