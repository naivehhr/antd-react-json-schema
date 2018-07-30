import React, { Component } from 'react';
import { Menu, Layout } from 'antd';
import { browserHistory } from 'react-router';
const { Sider } = Layout;
const { SubMenu } = Menu
import { getPageRouter } from 'Pages/Fetcher';

class MySidebar extends Component {
	constructor(props) {
		super(props);
	}

	getMenuList(ppath, children) {
		if (children == null || !(children.length > 0)) return [];
		let menulist = [];
		for (let i = 0; i < children.length; i++) {
			let child = children[i];
			if (child.is_shownav != 1) continue;
			let currentkey = ppath + '/' + child.pathname;
			if (child.is_group == 1) {
				let cchildren = this.getMenuList(currentkey, child.children);
				menulist.push(<SubMenu key={currentkey} title={<span><span>{child.pathlabel}</span></span>}>
								{ cchildren }
							  </SubMenu>);
			} else {
				menulist.push(<Menu.Item key={currentkey}>{child.pathlabel}</Menu.Item>);
			}
		}
		return menulist;
	}

	genPageList() {
		let siderConfig = getPageRouter();
		return this.getMenuList('', siderConfig);
	}

	handleClick = e => {
		browserHistory.push(e.key)
	}

	render() {
		let menuitems = this.genPageList();
		let selectedKeys = this.props.location.pathname;
		let openKeys = selectedKeys.replace(/\/[^\/]*$/g, '');
		if (menuitems.length == 0) {
			return null;
		}
		return (
			<Sider className="app-pagesiderbar_wrapper">
				<Menu onClick={this.handleClick}
					mode="inline"
					defaultOpenKeys={[openKeys]}
					selectedKeys={[selectedKeys]}
				>
					{menuitems}
				</Menu>
			</Sider>
		)
	}
}
export default MySidebar;