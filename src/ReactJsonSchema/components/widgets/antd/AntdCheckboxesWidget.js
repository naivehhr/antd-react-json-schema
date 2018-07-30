import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Select, Form, Checkbox } from 'antd';
const FormItem = Form.Item
const Option = Select.Option
import { getErrorMsg } from './utils'
import _ from 'lodash';
import { formItemLayout } from './constant'
import './style.scss'

function AntdCheckboxesWidget(props) {
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
	// console.log('value', value)
	const { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = props.formContext.myFormFun
	const { column } = schema
	let optionsView = options.enumOptions.map((v, i) => {
		if (column) {
			let _col = Number.isInteger(+column) ? 24 / (+column) : 24
			return (
				<Col span={_col} className="checkbox"><Checkbox value={v.value}>{v.label}</Checkbox></Col>
			)
		}
		return (
			<Checkbox value={v.value}>{v.label}</Checkbox>
		)
	})

	let _onChange = (event) => {
		let _value = []
		if (schema.itemsExclude) {
			// console.log('event', event)
			// console.log('value', value)
			// 这个去重会导致一个可恶的bug,要取最后一个值
			// 又好了？
			_value = _.xor(event, value);
			// console.log('_value', _value);
			return onChange && onChange(_value, { id, schema })

			// return onChange && onChange([_value[_value.length - 1]], {id, schema})

		}
		onChange && onChange(event, { id, schema })
	}

	let errMsg = getErrorMsg(errors)(id)
	let validateStatus
	if (!errMsg && value) {
		validateStatus = 'success'
	} else if (errMsg) {
		validateStatus = 'error'
	}

	if (column) {
		return (
			<div
				colon={false}
				required={required}
				label={label}
				validateStatus={validateStatus}
				help={errMsg}
				{...formItemLayout}
			>
				<Checkbox.Group
					onChange={_onChange}
					value={value}
					disabled={readonly}
				>
					{optionsView}
				</Checkbox.Group>
			</div>
		)
	}
	return (
		<FormItem
			colon={false}
			required={required}
			label={label}
			validateStatus={validateStatus}
			help={errMsg}
			{...formItemLayout}
			className="form-item"
		>
			<Checkbox.Group
				onChange={_onChange}
				value={value}
				disabled={readonly}
			>
				{optionsView}
			</Checkbox.Group>
		</FormItem>
	)

	// return (
	// 	<FormItem colon={false} label={label} {...formItemLayout}>
	// 		{getFieldDecorator(id, {
	// 			rules: [{ required: required, message: '不能为空'}],
	// 			initialValue: value,
	// 		})(
	// 			<Checkbox.Group onChange={_onChange}>
	// 				{optionsView}
	// 			</Checkbox.Group>
	// 			)}
	// 	</FormItem>
	// )
}

if (process.env.NODE_ENV !== "production") {
	AntdCheckboxesWidget.propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};
}

export default AntdCheckboxesWidget;
