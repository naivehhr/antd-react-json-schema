/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-22 16:52:36
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import HeaderSelf from 'Component/Header/user'
import BreadcrumbSelf from 'Component/Breadcrumb'
import { connect } from 'react-redux'
import { updateNav } from 'Action/user_nav'
// import { CustomerSider } from 'Dict/CustomerSider'
// import * as A from 'Dict'
import {
	UserFundSider,
	UserLoanRequestSider,
	UserAccountSider
} from 'Dict'

class Container extends Component {
	constructor(props) {
		super(props)
		this.state = {
			routes: props.routes,
			siderModule: UserFundSider
		}
	}

	componentWillMount() {
		const { children, location } = this.props
		const { pathname } = location
		let siderModule = UserFundSider
		let currentPath = pathname.match(/\/(\S*?)\//) && pathname.match(/\/(\S*?)\//)[1]
		switch (currentPath) {
			case 'fund':
				siderModule = UserFundSider
				break
			case 'account':
				siderModule = UserAccountSider
				break
			case 'loanrequest':
				siderModule = UserLoanRequestSider
				break
			default:
				console.log('sider dict config error')
		}
		this.setState({ siderModule })
	}

	componentDidMount() {
	}

	handleClick = e => {
		let path = this.state.siderModule.path + '/'
		let newPatch = '/' + path + e.key
		// console.log(' newPatch==', newPatch)
		this.props.dispatch(updateNav({ currentRoute: newPatch, currentSide: e.key }))
		hashHistory.push(newPatch)
	}

	render() {
		const { children, userNav } = this.props
		const { siderModule } = this.state
		return (
			<Layout>
				<HeaderSelf />
				<Layout>
					<Sider width={'15%'} className="aside">
						<Menu onClick={this.handleClick}
							mode="inline"
							defaultOpenKeys={siderModule.defaultOpenKeys}
							selectedKeys={[userNav.currentSide]}
						>
							{
								siderModule.list.map((item) => {
									if (!item.list) {
										return <Menu.Item key={item.key}>
											<Icon type={item.icon} />{item.title}
										</Menu.Item>
									} else {
										return <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.title}</span></span>}>
											{
												item.list.map((ele) => {
													return <Menu.Item key={ele.key}>{ele.title}</Menu.Item>
												})
											}
										</SubMenu>
									}
								})
							}
						</Menu>
					</Sider>
					<Content className="container">
						<BreadcrumbSelf routes={this.state.routes} />
						{children}
					</Content>
				</Layout>
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
export default connect(mapStateToProps)(Container)
// export default Container