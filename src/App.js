import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import { getUserRouterConfig } from 'Pages/Fetcher';
import { fetch } from 'Ajax';
import SERVER_URL from 'Ajax/Url';
import LoginPage from 'Pages/Static/LoginPage';
import EntitySelectPage from 'Pages/Static/EntitySelect';
import AppRouter from 'AppRouter';
import 'Style/antd.scss'
import 'Style/base.scss'
import 'Style/tenstyle.scss'
import './app.scss'

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			initReady: false,
			user: null,
			entity: null
		};
	}

	componentDidMount() {
		//远程获取当前登录状态,也就是用户session里面的登录信息
		this.fetchUserInfo();
		this.props.setSysConfig({fetch: fetch});
	}

	fetchUserInfo = async () => {
		let res = await fetch(SERVER_URL.USER_INFO);
		let user = res.value;
		if (user != null) {
			this.setInitedUser(user);
		} else {
			//如果没有选择角色，直接先移除旧的cookie数据
			localStorage.removeItem('_USER_ENTITY_');
			this.setState({
				initReady: true
			});
		}
	}

	componentWillReceiveProps(nextProps) {
		//如果切换是切换实体操作时
		if (nextProps.user != null && nextProps.entity != null && this.state.user != null) {
			if (nextProps.user.username == this.state.user.username) {
				localStorage.setItem('_USER_ENTITY_', JSON.stringify(nextProps.entity));
				//TODO:目前切换实体先暴力的刷新处理先
				window.location.href = '/';
				return;
			}
		}
		//当用户状态更新时，页面的router逻辑需要变化
		if (nextProps.user != null) {
			this.setState({
				initReady: true,
				user: nextProps.user,
				entity: nextProps.entity
			});
		}
	}

	onUserLogin(user) {
		localStorage.removeItem('_USER_ENTITY_');
		this.setInitedUser(user);
	}

	setInitedUser = async (user) => {
		//设置初始化用户时（用户登录或第一次加载fetch当前用户数据），设置user和entity的store.
		let entity = null;
		let storeEntity = localStorage.getItem('_USER_ENTITY_');
		if (storeEntity != null) {
			try {
				storeEntity = JSON.parse(storeEntity);
			} catch (e) {
				storeEntity = null;
			}
		}
		if (storeEntity != null) {
			for (var i = 0; i < user.accessList.length; i++) {
				if (user.accessList[i].userGroupId == storeEntity.userGroupId && user.accessList[i].roleId == storeEntity.roleId) {
					entity = user.accessList[i];
					break;
				}
			}
		}
		if (entity == null) {
			entity = user.accessList[0];
		}
		localStorage.setItem('_USER_ENTITY_', JSON.stringify(entity));
		this.props.initUserState(user, entity);
	}

	render() {
		if (this.state.initReady == false) {
			return <Spin style={{ position: 'fixed', width: '100%', top: '50%', marginTop: '-12px' }} />;
		}
		//显示登录页面
		if (this.state.user == null) {
			return <LoginPage {...this.props} onUserLogin={this.onUserLogin.bind(this)} />
		}
		//显示什么信息
		return <AppRouter {...this.props} entity={ this.state.entity } />;
	}
}
const mapStateToProps = (state) => {
	return {
		user: state.user.user,
		entity: state.user.entity,
		sysconfig: state.sysconfig
	}
};

const mapDispatchToProps = (dispatch) => {
	return {
		initUserState: (user, entity) => {
			dispatch({ type: 'INIT_USER_STATE', user: user, entity: entity})
		},
		setSysConfig: (data) => {
			dispatch({ type: 'SET_SYS_CONFIG', data})
		}
		
	}
}

App = connect(mapStateToProps, mapDispatchToProps)(App)
export default App;
