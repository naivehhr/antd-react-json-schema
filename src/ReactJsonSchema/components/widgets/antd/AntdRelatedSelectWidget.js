import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Input } from 'antd';
import RelativeSelectComponent from './RelativeSelectComponent'
import { getErrorMsg } from './utils'
import { formItemLayout } from './constant'
import './style.scss'

const FormItem = Form.Item
function AntdGroupSelectWidget(props) {
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
		onChange,
		errors,
		onSelect,
		...inputProps
	} = props;
	// console.log('value', value)
	const {
		getFieldDecorator,
		getFieldValue,
		setFieldsValue,
		getFieldsError,
		getFieldError,
		isFieldTouched
	} = props.formContext.myFormFun
	let _onChange = (value) => {
		onChange && onChange(value)
	}
	let errMsg = getErrorMsg(errors)(id)
	let validateStatus
	if (!errMsg && value) {
		validateStatus = 'success'
	} else if (errMsg) {
		validateStatus = 'error'
	}
	let selcompUiSchema = { "ui:rootFieldId": id }
	return (
		<FormItem
			colon={false}
			required={required}
			label={label}
			disabled={readonly}
			validateStatus={validateStatus}
			help={errMsg}
			className="form-item"
			{...formItemLayout}
		>
			<RelativeSelectComponent
				id={id}
				value={value}
				onSelect={onSelect}
				treeData={schema.treeData} />
		</FormItem>
	)

	// return (
	// 	<FormItem colon={false} label={label} {...formItemLayout}>
	// 		{getFieldDecorator(id, {
	// 			rules: [{ required: required, message: '不能为空' }],
	// 			initialValue: value
	// 		})(
	// 			<SelectComponent  onChange={onChange} value={value}/>

	// 			)}
	// 	</FormItem>
	// )

}

export default AntdGroupSelectWidget;
