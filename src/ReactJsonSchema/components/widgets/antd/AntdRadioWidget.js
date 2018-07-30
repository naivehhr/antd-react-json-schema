import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Select, Form, Radio } from 'antd';
import { formItemLayout } from './constant'
import './style.scss'

const FormItem = Form.Item
const RadioGroup = Radio.Group
import {
	getErrorMsg
} from './utils'

function AntdRadioWidget(props) {
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
	let errMsg = getErrorMsg(errors)(id)
	// console.log(`widget id=${id} value=${value}`, );
	const { getFieldDecorator, getFieldValue, getFieldsValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = props.formContext.myFormFun
	// const formItemLayout = {
	// 	labelCol: { span: 3 },
	// 	wrapperCol: { span: 5 }
	// };

	let radioView = options.enumOptions.map((v, i) => {
		return <Radio value={v.value}>{v.label}</Radio>
	})

	let _onChange = event => {
		onChange && onChange(event.target.value, id)
	}

	let validateStatus
	if(!errMsg && value) {
		validateStatus = 'success'
	} else if(errMsg) {
		validateStatus = 'error'
	}

	return (
		<FormItem
			colon={false} 
			required={required} 
			validateStatus={validateStatus}
			help={errMsg}
			label={label}
			className="form-item"
			{...formItemLayout}
		>
			<RadioGroup 
				value={value} 
				disabled={readonly}
				onChange={_onChange}
			>
				{radioView}
			</RadioGroup>
		</FormItem>
	)

	// if (formContext.notAntdFormTrusteeship) {
	// 	return (
	// 		<FormItem {...formItemLayout}>
	// 			<RadioGroup value={value} onChange={_onChange}>
	// 				{radioView}
	// 			</RadioGroup>
	// 		</FormItem>
	// 	)
	// }

	// return (
	// 	<FormItem label={label} {...formItemLayout}>
	// 		{getFieldDecorator(id, {
	// 			rules: [{ required: required, message: '不能为空' }],
	// 			initialValue: value,
	// 		})(
	// 			<RadioGroup value={value}>
	// 				{radioView}
	// 			</RadioGroup>
	// 			)}
	// 	</FormItem>
	// )
}

if (process.env.NODE_ENV !== "production") {
	AntdRadioWidget.propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};
}

export default AntdRadioWidget;
