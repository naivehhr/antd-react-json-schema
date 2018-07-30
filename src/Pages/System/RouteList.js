import React, { Component } from 'react';
import sa from 'superagent';
import { Link } from 'react-router';
import { Button, Row, Col, Tree } from 'antd';
import { browserHistory } from 'react-router';
import { fetchRouterList } from 'Pages/Fetcher';
const TreeNode = Tree.TreeNode;

class Index extends Component {
	constructor() {
		super()
		this.state = {
			pageReady: false,
			pageError: null,
			pageData: null
		}
	}

	componentDidMount() {
		this.fetchRouterList();
	}

	fetchRouterList = async () => {
		let resp = await fetchRouterList();
		this.setState({
			pageReady: true,
			pageError: resp.code == 200 ? null : resp.msg,
			pageData: resp.value
		});
	}

	onTreeClick = (ev) => {
		browserHistory.push({
			pathname: '/system/routerupdate',
			state: {
				params: {
					id: ev[0]
				}
			}
		});
	}

	getRouterTree = (treeChildrenData) => {
		let routerList = [];
		for (let i = 0; i < treeChildrenData.length; i++) {
			let treeChild = treeChildrenData[i];
			let childChildren = treeChild.children != null ? this.getRouterTree(treeChild.children) : null;
			let nodelabel = treeChild.pathlabel + (treeChild.description == null || treeChild.description == "" ? "" : ("(" + treeChild.description + ")"));
			routerList.push(<TreeNode title={nodelabel} key={treeChild.id}>
								{childChildren}
							</TreeNode>);
		}
		return routerList;
	}

	render () {
		if (this.state.pageReady === false) {
			return <div>加载中...</div>;
		}
		if (this.state.pageError !== null) {
			return <div>{ this.state.pageError }</div>;
		}
		let routerList = this.getRouterTree(this.state.pageData);
		return <div>
				<Row className='item-title'>
					<Col span="24">
						<h1 style={{ float: 'left' }}>配置路由</h1>
						<div style={{ float: 'right' }}>
						<Link to="/system/routeradd">
							<Button type="primary">添加新路由</Button>
						</Link>
						</div>
					</Col>
				</Row>
				<div style={{backgroundColor:'white', padding: 5}}>
					<Tree
						showLine
						defaultExpandedKeys={["0"]}
						onSelect={this.onTreeClick.bind(this)}
					>
						<TreeNode title="根节点" key="0" selectable={false}>
							{routerList}
						</TreeNode>
					</Tree>
				</div>
			   </div>
	}
}

export default Index;