import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Select, Form, Checkbox } from 'antd';
const FormItem = Form.Item
const Option = Select.Option
import { Link } from 'react-router';
import {
	getErrorMsg
} from '../antd/utils'

/**
 * checkbox 选择协议
 * @param {*} props 
 */
function AgreementCheckboxWidget(props) {
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
		errors,
		onChange,
		help,
		allFormData,
		...inputProps
	} = props;
	let checkBoxValue = value
	const { option } = schema
	let agreements = option.agreement_list
	let errMsg = getErrorMsg(errors)(id)

	const { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = props.formContext.myFormFun

	let _onChange = event => {
		let nValue = event.target.checked
		onChange && onChange(nValue, id)
	}
	const handleClick = (i, e) => {
		e.preventDefault()
		let form = document.createElement("form");
		form.setAttribute("action", "/enterprise-web-oapi/platform/contract/preview" + i.url);
		form.setAttribute("method", "post");
		// form.setAttribute("target", "_blank");
		let input = document.createElement("input");
		input.type = "hidden";
		input.name = "formdata";
		input.value = JSON.stringify(allFormData);
		form.appendChild(input);
		document.body.appendChild(form)
		form.submit();
		document.body.removeChild(form)
	}
	// console.log('errMsg', errMsg, checkBoxValue)
	let _style = { display: 'inline', marginLeft: 132 }
	// if(errMsg && !checkBoxValue) {
	// 	_style = { display: 'inline', marginLeft: 132, border: '1px solid red' }
	// }
	return (
		<FormItem className="ant-form-item-no-colon form-item">
			<div style={_style} id={id}>
				{
					schema.option && schema.option.showCheckBox ?
						<Checkbox checked={checkBoxValue} onChange={_onChange}>{label}</Checkbox>
						: null
				}
				{
					agreements ?
						agreements.map(i => {
							if (i.action_type == "form") {
								return (
									<Link onClick={handleClick.bind(this, i)}>{`《${i.title}》`}</Link>
								)
							} else if (i.action_type == "_blank") {
								return (
									<Link to={i.url} target="_blank">{`《${i.title}》`}</Link>
								)
							}
						})
						: <div>
						</div>
				}
			</div>
		</FormItem>
	)
}

export default AgreementCheckboxWidget;
