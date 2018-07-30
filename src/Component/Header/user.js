import React from 'react';
import { Component } from 'react';
import { Link, hashHistory } from 'react-router'
import { Layout, Menu, Button } from 'antd';
const { Header } = Layout;
import { connect } from 'react-redux'
import { updateUserInfo } from 'Action/user'
import { updateNav } from 'Action/user_nav'
import './index.scss';
import {
  logoutCoreUser,
} from 'Ajax'
class HeaderSelf extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: '',
    }
  }
  
  componentDidMount() {
    // console.log('path', document.location)
    let cp = document.location.hash.split('#')
    let h = document.location.hash
    let newNav = ''
    if(h.indexOf('loanrequest') != -1) {
      newNav = '/loanrequest/list'
    } else if(h.indexOf('account') != -1) {
      newNav = '/account/info'
    } else if(h.indexOf('fund') != -1) {
      newNav = '/fund/info'
    } else if(h.indexOf('login') != -1) {
      newNav = '/login'
    } else if(h.indexOf('register') != -1) {
      newNav = '/register'
    }
    let newSide =  h.split('/').pop()
    // console.log('menu change newNav', newNav)
    // console.log('menu change newSide', newSide)
    this.props.dispatch(updateNav({ currentRoute: newNav, currentSide: newSide}))
  }

  handleClick = async (e) => {
    // console.log(e)
    const { dispatch } = this.props
    if (e.key == '/login') {
      if (!this.props.user.customerName) {
        hashHistory.push('/login')
      } else {
        hashHistory.push('/account/info')
      }
      dispatch(updateNav({ currentRoute: e.key }))
      return
    }
    if (e.key == '/logout') {
      let result = await logoutCoreUser()
      dispatch(updateUserInfo({ customerName: '', isLogin: false }))
      hashHistory.push('/login')
      return
    }
    let strArr = e.key.split('/')
    let newSide = strArr[strArr.length - 1]
    dispatch(updateNav({ currentRoute: e.key, currentSide: newSide }))
    hashHistory.push(e.key)
  }

  render() {
    const { user, userNav } = this.props
    return (
      <Layout>
        <Header className="header">
          <div className="logo" />
          {user.isLogin ?
            <div>
              <Menu
                theme="dark"
                onClick={this.handleClick}
                selectedKeys={[this.props.userNav.currentRoute]}
                mode="horizontal"
                defaultSelectedKeys={['/customer/list']}
              >
                <Menu.Item key="/loanrequest/list">用款管理</Menu.Item>
                <Menu.Item key="/account/info">我的账户</Menu.Item>
                <Menu.Item key="/fund/info">资金</Menu.Item>

                <Menu.Item key="/logout" className={"right"} >退出</Menu.Item>
                <Menu.Item key="/login" className={"right"} >{user.isLogin ? user.customerName : '请登录'}</Menu.Item>
              </Menu>
            </div> :
            <div>
              <Menu
                theme="dark"
                onClick={this.handleClick}
                selectedKeys={[this.props.userNav.currentRoute]}
                mode="horizontal"
                defaultSelectedKeys={['/customer/list']}
              >

                <Menu.Item key="/login" className={"right"} >{user.isLogin ? user.customerName : '请登录'}</Menu.Item>
                <Menu.Item key="/register" className={"right"} >注册</Menu.Item>
              </Menu>
            </div>
          }
        </Header>
      </Layout>
    )
  }
}
const mapStateToProps = state => {
  return {
    user: state.user,
    userNav: state.userNav
  }
}
export default connect(mapStateToProps)(HeaderSelf)