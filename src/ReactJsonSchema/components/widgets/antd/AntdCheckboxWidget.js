import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Select, Form } from 'antd';
const FormItem = Form.Item
const Option = Select.Option

/**
 * 暂时无用，全部使用AntdCheckboxes
 * @param {*} props 
 */
function AntdCheckboxWidget(props) {
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
	} = props;
	const { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = props.formContext.myFormFun
	const formItemLayout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 }
	};

	let _onChange = event => {
		onChange && onChange(event.target.value, id)
	}

	let optionsView = options.enumOptions.map((v, i) => {
		return <Option value={v.value}>{v.label}</Option>
	})

	return (
		<FormItem colon={false} label={label} {...formItemLayout}>
			<Select onChange={_onChange}>
				{optionsView}
			</Select>
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
	AntdCheckboxWidget.propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};
}

export default AntdCheckboxWidget;
