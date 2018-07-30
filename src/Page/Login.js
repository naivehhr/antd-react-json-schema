import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import { connect } from 'react-redux'

import { Menu, Icon, Breadcrumb } from 'antd'
import {
  Form, Table, Input, Select, Checkbox, Radio, Button, InputNumber, Spin,
  DatePicker, Row, Col, message, Modal
} from 'antd'

import Header from 'Component/Header'
import 'Style/login.scss'
import cot from 'cookie.js'
import {
  sendCode,
  login
} from 'Ajax'

const CheckboxGroup = Checkbox.Group
const FormItem = Form.Item
const createForm = Form.create
const Option = Select.Option
const RadioGroup = Radio.Group

class _Login extends Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.lock = 0
  }

  componentDidMount() {
    // console.log(this.props)
  }

  login = async (data) => {
    let mobile = this.props.form.getFieldValue('mobile')
    let code = this.props.form.getFieldValue('code')
    let result = await login({
      "code": code,
      "mobile": mobile
    })

  }

  sendCode = async (data) => {
    let mobile = this.props.form.getFieldValue('mobile')
    let result = await sendCode({ "mobile": mobile })
  }
  render() {
    const { getFieldDecorator, getFieldError, isFieldValidating, getFieldsValue } = this.props.form
    const nameProps = getFieldDecorator('mobile', {
      rules: [
        { required: true, min: 5, message: '用户名至少为5个字符' },
        { validator: this.userExists },
      ],
    })

    const passwdProps = getFieldDecorator('code', {
      rules: [
        { required: true, whitespace: true, message: '请填写密码' },
        { validator: this.checkPass },
      ],
    })
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    return <div className="page">
      <Header />
      <div className="welcom-login">
        <Row>
          <Col span={12} offset={6}>
            <Form>
              <FormItem
                {...formItemLayout}
                label="手机号"
                hasFeedback
              >
                {
                  nameProps(<Input placeholder="输入代理人手机号" />)
                }
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="验证码"
                hasFeedback
              >
                {
                  passwdProps(<Input type="code" placeholder="" />)
                }
              </FormItem>
              <FormItem wrapperCol={{ span: 12, offset: 7 }}>
                <Button type="primary" onClick={this.login}>登录</Button>
                <Button type="primary" onClick={this.sendCode}>发送验证码</Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    </div>
  }
}
const mapStateToProps = state => {
  return {
    user: state.user
  }
}

const Login = Form.create()(_Login)

export default connect(mapStateToProps)(Login)