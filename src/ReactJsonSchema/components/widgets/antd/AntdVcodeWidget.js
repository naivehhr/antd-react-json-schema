import React, { Component } from 'react';
import PropTypes from "prop-types";
import { Row, Col, Form, Icon, Button, Input, Tooltip, message } from 'antd';
import { getErrorMsg } from './utils'
import { formItemLayout } from './constant'
import { fetch } from 'Ajax';
import SERVER_URL from 'Ajax/Url';
const FormItem = Form.Item

class AntdVcodeWidget extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			inRequest: false,
			looperCount: 0,
			hasFetched: false
		}
	}

	//倒计时逻辑
	loopUpdateTimer() {
		setTimeout((function() {
			if (this.state.looperCount > 0) {
				this.setState({
					looperCount: this.state.looperCount - 1
				}, function() {
					this.loopUpdateTimer();
				});
			}
		}).bind(this), 1000);
	}

	//验证码发送逻辑
	sendVcode = async () => {
		if (this.state.inRequest == true || this.state.looperCount > 0) return;
		let { schema } = this.props;
		this.setState({
			inRequest: true,
			hasFetched: true
		});
		let resp = await fetch(SERVER_URL.VERIFY_CODE, 'POST', { code_type: schema.option.code_type});
		if (resp.code !== 200) {
			message.error(resp.data);
			this.setState({
				inRequest: false
			});
			return;
		}
		message.success('验证码已发送，请尽快使用');
		this.setState({
			inRequest: false,
			looperCount: 60
		}, function() {
			this.loopUpdateTimer();
		});
	}

	onChange(event) {
		let value = event.target.value;
		this.props.onChange(value, this.props.id);
	}

    render() {
        const {
            id,
            value,
            readonly,
            schema,
            label,
            required,
            errors,
            help,
            placeholder
        } = this.props;

        let validateStatus
        let errMsg = getErrorMsg(errors)(id)
        if (errMsg) {
            validateStatus = 'error'
        } else if (!errMsg && value) {
            validateStatus = 'success'
        } else {
            validateStatus = 'success'
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
                {
                    readonly ?
                    (<font>{(value == null || value == "" ? "-" : value)}</font>)
                    :
                    [
						(<Input id={id}
							onChange={this.onChange.bind(this)}
							placeholder={"请填写短信验证码"}
							value={value}
							className="vcodeinput"
							style={{ width: 110 }}
						/>),
						(
						<Button className="vcodebtn" disabled={(this.state.inRequest == true || this.state.looperCount > 0)} onClick={this.sendVcode.bind(this)}>
							{
								this.state.inRequest ? 
								"验证码发送中"
								: 
								(
									this.state.looperCount > 0 ?
									(this.state.looperCount + "秒")
									:
									(this.state.hasFetched ? "重新获取" : "获取")
								)
							}
						</Button>
						)
                    ]
				}
            </FormItem>
        )
    }
}

export default AntdVcodeWidget;
