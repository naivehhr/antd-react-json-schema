import React from "react";
import PropTypes from "prop-types";
import './style.scss'
import { Row, Col, Form, InputNumber, Tooltip } from 'antd';
import { _format } from '../../../../Util'
// import { Row, Col, Form, InputNumber } from 'antd';
import { getErrorMsg, getCursortPosition, setCaretPosition } from './utils'
import { formItemLayout } from './constant'
import './style.scss'

const FormItem = Form.Item
function AntdNumberWidget(props) {
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

	let errMsg = getErrorMsg(errors)(id)
	let validateStatus
	if (!errMsg && value) {
		validateStatus = 'success'
	} else if (errMsg) {
		validateStatus = 'error'
	}
	let _onChange = (event) => {
		// let obj = document.getElementById(id)
		// let d = getCursortPosition(obj)
		onChange && onChange(event, id)
		// if (event) {
		// 	setTimeout(() => {
		// 		setCaretPosition(obj, d + 1)
		// 	})
		// }
	}
	// let newValue
	// if (schema.format == 'amount') {
	// 	newValue = _format.formatValue(schema, value)
	// }
	return (
		<FormItem colon={false}
			required={required}
			label={label}
			validateStatus={validateStatus}
			help={errMsg}
			className="form-item"
			{...formItemLayout}
		>
			<InputNumber
				id={id}
				onChange={_onChange}
				min={0}
				disabled={readonly}
				value={value}
				formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
				parser={value => value.replace(/\$\s?|(,*)/g, '')}
				style={{ height: 43 }}
			/>
			{
				schema.unit ?
					<div style={{
						position: 'absolute',
						left: '105%',
						top: 0,
						lineHeight: '40px',
						width: 200
					}}>
						{schema.unit}
					</div>
					:
					null
			}
		</FormItem>
	)
}

if (process.env.NODE_ENV !== "production") {
	AntdNumberWidget.propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};
}

export default AntdNumberWidget;
