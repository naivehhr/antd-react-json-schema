import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetch } from 'Ajax';
import SERVER_URL from 'Ajax/Url';

class HeaderSelf extends Component {
  constructor(props) {
    super(props);
  }

  logout = async () => {
    let result = await fetch(SERVER_URL.USER_LOGOUT);
    window.location.reload();
  }

  render() {
    let user = this.props.user;
    let entity = this.props.entity;
    return (
      <div>
        <div className="app-headerlogo"><img src={require('../../Style/images/logo.png')} />丰收云链</div>
        <div className="app-usernav">
          <span className="itemnav">{entity.userGroupName} - {entity.roleName}</span>
          <span className="username">
            {user.userName}
            <div className="usertoolbox">
              <div className="toolitem"><Link to='/account/entityinfo'>账户信息</Link></div>
              <div className="toolitem"><Link to='/account/entitymanage'>认证管理</Link></div>
              <div className="toolitem"><Link to='/account/changeentity'>切换角色</Link></div>
              <div className="toolitem" onClick={this.logout}>退出登录</div>
            </div>
          </span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user.user,
    entity: state.user.entity
  }
};
const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch({ type: 'LOGIN_OUT', user: null})
    }
  }
}
HeaderSelf = connect(mapStateToProps, mapDispatchToProps)(HeaderSelf)
export default HeaderSelf;