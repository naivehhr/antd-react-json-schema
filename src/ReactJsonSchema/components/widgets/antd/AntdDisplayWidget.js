import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from 'antd';
import './style.scss'
function AntdDisplayWidget(props) {
	const {
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
		...inputProps
	} = props;
	let _value = value
	if(typeof _value === "boolean") {
		_value = _value?'是': '否'
	}
	return (
		<div className="antd-display-widget">
			<Row>
				<Col span={12} >
					<div>
					{label}
					</div>
				</Col>
				<Col span={12} >{_value}</Col>
			</Row>
		</div>
	)
}

if (process.env.NODE_ENV !== "production") {
	AntdDisplayWidget.propTypes = {
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
	};
}

export default AntdDisplayWidget;
