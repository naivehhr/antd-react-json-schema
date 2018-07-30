import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Select, Form } from 'antd';
import { getErrorMsg } from './utils'
import { formItemLayout } from './constant'
import './style.scss'

const FormItem = Form.Item
const Option = Select.Option
function AntdSelectWidget(props) {
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
		...inputProps
	} = props;
	const { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = props.formContext.myFormFun
	// const formItemLayout = {
	// 	labelCol: { span: 3 },
	// 	wrapperCol: { span: 5 }
	// };
	let errMsg = getErrorMsg(errors)(id)
	let validateStatus
	if(!errMsg && value) {
		validateStatus = 'success'
	} else if(errMsg) {
		validateStatus = 'error'
	}
	let _onChange = (event) => {
		onChange && onChange(event, id)
	}

	let valuelabel = "";
	let optionsView = options.enumOptions.map((v, i) => {
		if (v.value == value) {
			valuelabel = v.label;
		}
		return <Option value={v.value}>{v.label}</Option>
	})
	return (
		<FormItem 
			colon={false} 
			required={required} 
			label={label}
			validateStatus={validateStatus}
			help={errMsg}
			className="form-item"
			{...formItemLayout}
		>
			{
			readonly ?
			<font>{valuelabel}</font>
			:
			<Select id={id} 
				defaultValue={value}
				onChange={_onChange} >
				{optionsView}
			</Select>
			}
		</FormItem>
	)

	// return (
	// 	<FormItem colon={false} label={label} {...formItemLayout}>
	// 		{getFieldDecorator(id, {
	// 			rules: [{ required: required, message: '不能为空' }],
	// 			initialValue: value
	// 		})(
	// 			<Select >
	// 				{optionsView}
	// 			</Select>
	// 			)}
	// 	</FormItem>
	// )
}

if (process.env.NODE_ENV !== "production") {
	AntdSelectWidget.propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};
}

export default AntdSelectWidget;
