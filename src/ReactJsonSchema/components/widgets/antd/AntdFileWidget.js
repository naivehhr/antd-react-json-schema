import React, { Component } from "react";
import PropTypes from "prop-types";
import {
	Row,
	Col,
	Form,
	Button,
	Icon,
	Upload,
	message
} from 'antd';
const FormItem = Form.Item
import { formItemLayout } from './constant'
import SERVER_URL from '../../../../Ajax/Url'

class AntdFileWidget extends Component {

	state = {
		fileList: [],
	}

	handleChange = (info) => {
		const { schema, onChange, id } = this.props
		let fileList = info.fileList
		// if (info.file.status !== 'uploading') {
		// 	console.log(info.file, info.fileList);
		// }
		// console.log(info.file.status) 
		if (info.file.status === 'done') {
			message.success(`${info.file.name} file uploaded successfully`);
			// let str = fileList.reduce((pre, cur) => {
			// 	let name = cur.name
			// 	let c = `${name}:${cur.response.value}`
			// 	if (!pre) return c
			// 	return `${pre},${c}`
			// }, '')

			let obj = fileList.map((i, k) => {
				let name = i.name
				// console.log('name', name)
				if (i.response && i.response.value) {
					return {name: i.name, value: i.response.value}
				}
			})
			onChange && onChange(JSON.stringify(obj), id)
		} else if (info.file.status === 'error') {
			message.error(`${info.file.name} file upload failed.`);
		}
		if (schema.option && schema.option.onlyOne) {
			fileList = fileList.slice(-1);
		}
		this.setState({ fileList });
	}

	render() {
		const {
			id,
			value,
			readonly,
			disabled,
			autofocus,
			onBlur,
			onFocus,
			options,
			schema,
			formContext,
			registry,
			label,
			required,
			...inputProps
		} = this.props;
		const { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = this.props.formContext.myFormFun
		const fileProps = {
			action: `${SERVER_URL.FILE_UPLOAD}`,
			onChange: this.handleChange,
			headers: {
				// authorization: 'authorization-text',
			}
		};
		return (
			<FormItem colon={false} label={label} {...formItemLayout} className="form-item">
				<Upload
					{...fileProps}
					id={id}
					fileList={this.state.fileList}
				>
					<Button>
						<Icon type="upload" /> 上传
				</Button>
				</Upload>
			</FormItem >
		)
	}
}

export default AntdFileWidget;
