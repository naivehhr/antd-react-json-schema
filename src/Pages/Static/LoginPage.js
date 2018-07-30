import React, { Component } from 'react';
import { Row, Col, Input, Button, message  } from 'antd';
import { fetch } from 'Ajax';
import SERVER_URL from 'Ajax/Url';
import './login.scss';
import logo from '../../Style/images/logo.png'

class LoginPage extends Component {
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
    let userName = this.refs.nameipt.refs.input.value.trim();
    if (userName == "") {
      message.error('请输入手机号码');
      return;
    }
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(userName)) {
      message.error('请输入正确的手机号码');
      return;
    }
		this.setState({
			inRequest: true,
			hasFetched: true
		});
		let resp = await fetch(SERVER_URL.VERIFY_CODE_BEFORELOGIN, 'POST', { userName: userName});
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

  doLogin = async () => {
    let username = this.refs.nameipt.refs.input.value.trim();
    let verifyCode = this.refs.vcodeipt.refs.input.value.trim();
    if (username == '') {
      message.error('请输入手机号码');
      return;
    }
    var myreg=/^[1][3,4,5,7,8][0-9]{9}$/
    if (!myreg.test(username)) {
      message.error('请输入正确的手机号码');
      return;
    }
    if (verifyCode == '') {
      message.error('请输入短信验证码');
      return;
    }
    let result = await fetch(SERVER_URL.USER_LOGIN_BYVCODE, 'POST', {userName: username, verifyCode: verifyCode});
    if (result.code != 200) {
      message.error(result.data);
      return; 
    }

    this.props.onUserLogin(result.value);
  }

  render() {
    return (
      <div className="login-page-container">
        <div className="login-page-container-inner">
          <div className="left-intro">
            <div className="fengshou-logo">
              <img src={logo} />
              <div className="logo-title">丰收云链</div>
            </div>
            <div className="intro">
              <div className="intro-title">用户名和登录密码</div>
              <div className="child-line">未认证用户:  13133333333</div>
              <div className="child-line">运营人员:  13233333333</div>
              <div className="child-line">核心企业代理人:  13333333333</div>
              <div className="child-line">链属企业代理人:  13433333333</div>
              <div className="child-line">登录密码:  pass</div>
            </div>
          </div>
          <div className="right-form-container">
            <div className="form-inner">
              <div className="form-title">手机登录</div>
              <form className="login-form-body">
                <Input ref="nameipt" placeholder="手机号码" />
                <div className="vcodeline">
                  <Input ref="vcodeipt"
                      placeholder={"短信验证码"}
                      className="vcodeinput"
                      onKeyUp={
                        (e)=>{
                          if (e.keyCode === 13){
                            this.doLogin.bind(this)()
                          }
                        }
                      }
                    />
                  <Button className="vcodebtn" type="primary" disabled={(this.state.inRequest == true || this.state.looperCount > 0)} onClick={this.sendVcode.bind(this)}>
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
                </div>
                <Button onClick={this.doLogin.bind(this)} type="primary">登录</Button>
              </form>
              {/* <div className="TIP">还没有注册账号？</div>
              <div className="reg-button"></div> */}
            </div>
          </div>
        </div>
        <div className="footer">
          丰收云链 XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
        </div>
      </div>
    )
        
  }
}
export default LoginPage;