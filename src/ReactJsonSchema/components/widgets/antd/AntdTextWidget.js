import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Form, Input, Tooltip } from 'antd';
import { getErrorMsg, getCursortPosition, setCaretPosition } from './utils'
import { formItemLayout } from './constant'
import './style.scss'
import { _format } from '../../../../Util'
const FormItem = Form.Item
function AntdTextWidget(props) {
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
	let errMsg = getErrorMsg(errors)(id)
	const { getFieldDecorator, getFieldsValue, getFieldValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = props.formContext.myFormFun

	// const formItemLayout = {
	// 	labelCol: { span: 6 },
	// 	wrapperCol: { span: 18 }
	// };

	const _onChange = event => {
		// TODO: event.target.value 有时候是'', 有时候是undefined 😢
		// console.log('-event.target.value-', event.target.value)
		let _value = _format.unFormatValue(schema, event.target.value.trim())
		// if(schema && schema.format == 'amount') {
		// 	_value = parseFloat(_value).toFixed(schema.precision || 2)
		// }
		// console.log('onchange =====', _value)
		let obj = document.getElementById(id)
		let d = getCursortPosition(obj)
		onChange && onChange(event.target.value ? _value : undefined, id)
		setTimeout(() => {
			setCaretPosition(obj, d + 1)
		})
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
	let _value = _format.formatValue(schema, value)
	
	// console.log('显示_value', _value)
	let textplaceholder = placeholder == null ? ("请填写" + label) : placeholder;
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
			<Tooltip title={_value}>
				{
				readonly ?
				(
					(_value == null || _value == "") ?
					(<font className="holderstyle">{textplaceholder}</font>) : (<font>{_value}</font>)
				)
				:
				<Input id={id}
					onChange={_onChange}
					placeholder={textplaceholder}
					value={_value}
					disabled={readonly}
				/>
				}
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
			</Tooltip>
		</FormItem>
		// </FormItem>
		// <FormItem colon={false} label={label} {...formItemLayout}>
		// 	{getFieldDecorator(id, {
		// 		rules: [{ required: required, message: '不能为空' }],
		// 		initialValue: value
		// 	})(
		// 		<Input onChange={_onChange} disabled={readonly}/>
		// 		)}
		// </FormItem>
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
	AntdTextWidget.propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};
}

class MyFormItem extends React.Component {
	render() {
		const {
			required,
			label,
			validateStatus,
			help,
			children
		} = this.props

		return (
			<div className="custom-item">
				<div className="item-label">
					<label>{label}</label>
				</div>
				<div className="item-wiget">
					{children}
				</div>
			</div>
		)
	}
}

export default AntdTextWidget;
