import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Input, Tooltip } from 'antd';
import { getErrorMsg } from './utils'
import { formItemLayout } from './constant'
import './style.scss'
const { TextArea } = Input;

const FormItem = Form.Item
function AntdTextAreaWidget(props) {
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
		help,
		placeholder,
		...inputProps
	} = props;
	// console.log(props)
	let errMsg = getErrorMsg(errors)(id)
	const { getFieldDecorator, getFieldsValue, getFieldValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = props.formContext.myFormFun

	// const formItemLayout = {
	// 	labelCol: { span: 6 },
	// 	wrapperCol: { span: 18 }
	// };

	const _onChange = event => {
		// TODO: event.target.value 有时候是'', 有时候是undefined 😢
		onChange && onChange(event.target.value ? event.target.value : undefined, id)
	}

	let validateStatus
	if (errMsg) {
		validateStatus = 'error'
	} else if (!errMsg && value) {
		validateStatus = 'success'
	} else {
		validateStatus = 'success'
	}

	// return (
	// 	<MyFormItem
	// 		required={required}
	// 		label={label}
	// 		validateStatus={validateStatus}
	// 		help={errMsg && '不能为空'}
	// 	>
	// 		<Input id={id} onChange={_onChange} value={value} />
	// 	</MyFormItem>
	// )

	//要计算屏幕宽度么
	// console.log(window.innerWidth)

	const makeHelpView = () => {
		return (
			<div>
				customer HelpView
			</div>
		)
	}

	return (
		<FormItem
			colon={false}
			required={required}
			label={label}
			validateStatus={validateStatus}
			help={errMsg || help}
			{...formItemLayout}
			className="form-item"
		>
			<Tooltip title={value}>
				<TextArea id={id}
					onChange={_onChange}
					placeholder={placeholder}
					value={value}
					rows={options.rows}
					disabled={readonly}
					style={{resize: 'none'}}
				/>
			</Tooltip>
		</FormItem>
	)

	// if (schema.notAntdFormTrusteeship) {
	// 	// input的id暂时无用
	// 	return (
	// 		<FormItem colon={false} label={label} {...formItemLayout}>
	// 				<Input id={id} onChange={_onChange} value={value}/>
	// 		</FormItem>
	// 	)
	// }

	// return (
	// 	<FormItem colon={false} label={label} {...formItemLayout}>
	// 		{getFieldDecorator(id, {
	// 			rules: [{ required: required, message: '不能为空' }],
	// 			initialValue: value
	// 		})(
	// 			<Input onChange={_onChange}/>
	// 			)}
	// 	</FormItem>
	// )

}

if (process.env.NODE_ENV !== "production") {
	AntdTextAreaWidget.propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};
}

export default AntdTextAreaWidget;
