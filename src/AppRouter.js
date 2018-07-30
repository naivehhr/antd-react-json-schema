import React, { Component } from 'react';
import { browserHistory, hashHistory, Router, Route, Redirect } from 'react-router';
import { connect } from 'react-redux';
import { Spin  } from 'antd';
import PageWarp from 'Pages/PageWarp';
import { getUserRouterConfig } from 'Pages/Fetcher';
import 'Style/antd.scss'
import 'Style/base.scss'

class AppRouter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			routerReady: false,
			routerConfig: null,
			routerError: null
		};
	}

	componentDidMount () {
		this.fetchRouterLogic();
	}

	fetchRouterLogic = async () => {
		let response = await getUserRouterConfig(this.props.entity);
		this.setState({
			routerReady: true,
			routerError: response.code == 200 ? null : response.msg,
			routerConfig: response.value
		});
	}

	handleServerConfig(rawdata) {
		let oRoutes = [];
		for (var i = 0; i < rawdata.length; i++) {
			oRoutes = oRoutes.concat(this.makeRouter(rawdata[i]));
		}

		let routerList = [];
		if (oRoutes.length > 0) {
			//如果有链接，默认调到第一个链接上去
			routerList.push(<Redirect from="/" to={oRoutes[0].path} />)
		}
		for (var i = 0; i < oRoutes.length; i++) {
			routerList = routerList.concat(oRoutes[i].routers);
		}
		return routerList;
	}

	makeRouter = (router) => {
		let oRoutes = [];
		//如果是个叶子节点之间返回节点route
		if (router.is_group === 0) {
			return [{path: router.pathname, routers: [(<Route breadcrumbName={router.pathlabel} path={router.pathname} component={PageWarp} />)]}];
		}
		//如果是个group，那么则返回空节点
		if (router.children == null || !(router.children.length > 0)) {
			return oRoutes;
		}

		let childRoutes = [];
		for (let i = 0; i < router.children.length; i++) {
			childRoutes = childRoutes.concat(this.makeRouter(router.children[i]));
		}

		if (childRoutes.length > 0) {
			//对于GROUP默认添加一个自动跳转到第一个的逻辑
			let autoRedirectRouter = router.pathname + '/' + childRoutes[0].path;
			oRoutes.push(<Redirect from={router.pathname} to={autoRedirectRouter} />);
			let routerList = [];
			for (let i = 0; i < childRoutes.length; i++) {
				routerList = routerList.concat(childRoutes[i].routers);
			}
			oRoutes.push((
				<Route breadcrumbName={router.pathlabel} path={router.pathname}>
					{ routerList }
				</Route>
			))
		}
		return [{path: router.pathname, routers: oRoutes}]
	}

	render() {
		if (this.state.routerReady == false) {
			return <Spin style={{position: 'fixed', width: '100%', top: '50%', marginTop: '-12px'}} />;
		}
		if (this.state.routerError != null) {
			//TODO:添加错误页面
			return <div>{ this.state.routerError }</div>;
		}
		let oRoutes = this.handleServerConfig(this.state.routerConfig);
		return (
			<div>
				<Router history={browserHistory}>
					<Route>
						{ oRoutes }
						<Redirect from='*' to='/' />
					</Route>
				</Router>
			</div>
		)
	}
}
export default AppRouter;