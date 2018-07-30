import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { message, Button, Row, Col, Input, Select, Radio } from 'antd';
import { fetchRouterList, addRoute } from 'Pages/Fetcher';
const RadioGroup = Radio.Group;

class Index extends Component {
	constructor() {
		super();
		this.state = {
			pageReady: false,
			pageError: null,
			pageData: null,
			formData: {
				pathname: null,
				pathlabel: null,
				description: null,
				p_id: 0,
				is_group: 0,
				is_shownav: 1,
				sortindex: null,
				is_enable: 0
			}
		};
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

	getGroupList = (p_path, p_label, treeChildrenData) => {
		let groupList = [];
		for (let i = 0; i < treeChildrenData.length; i++) {
			let treeChild = treeChildrenData[i];
			if (treeChild.is_group) {
				let cpathname = p_path + '/' + treeChild.pathname;
				let cpathlabel = p_label + '/' + treeChild.pathlabel + (treeChild.description == null || treeChild.description == "" ? "" : ("(" + treeChild.description + ")"));
				groupList.push({
					id: treeChild.id,
					pathname: cpathname,
					pathlabel: cpathlabel
				});
				if (treeChild.children != null) {
					groupList = groupList.concat(this.getGroupList(cpathname, cpathlabel, treeChild.children));
				}
			}
		}
		return groupList;
	}

	onFormChange = (key, ev) => {
		let val = null;
		if (ev != null && ev.target != null) {
			val = ev.target.value;
		} else {
			val = ev;
		}
		let tmpstate = this.state.formData;
		tmpstate[key] = val;
		this.setState({
			formData: tmpstate
		});
	}

	doAddRoute = async () => {
		let self = this;
		let querys = [];
		for (let key in this.state.formData) {
			if (this.state.formData[key] != null) {
				querys.push(key + '=' + encodeURIComponent(this.state.formData[key]));
			}
		}
		let response = await addRoute(querys.join('&'));
		if (response.code != 200) {
			message.error('添加失败: ' + response.msg);
		} else {
			browserHistory.push({
				pathname: '/system/routerlist'
			})
		}
	}

	render() {
		if (this.state.pageReady === false) {
			return <div>加载中...</div>;
		}
		if (this.state.pageError !== null) {
			return <div>{this.state.pageError}</div>;
		}
		let groupList = this.getGroupList('', '', this.state.pageData);
		let groupSelectUI = [];
		for (let i = 0; i < groupList.length; i++) {
			groupSelectUI.push(<Option value={groupList[i].id}>{groupList[i].pathlabel}</Option>)
		}
		return <div>
			<Row className='item-title'>
				<Col span="24">
					<h1 className="title">新建路由</h1>
				</Col>
			</Row>
			<div style={{ backgroundColor: 'white' }}>
				<div style={{ width: 400 }}>
					<Row className='item-title'>
						<Col span="8">
							<span className="title">导航标识</span>
						</Col>
						<Col span="16">
							<Input value={this.state.formData.pathname} onChange={this.onFormChange.bind(this, 'pathname')} />
						</Col>
					</Row>
					<Row className='item-title'>
						<Col span="8">
							<span className="title">显示名称</span>
						</Col>
						<Col span="16">
							<Input value={this.state.formData.pathlabel} onChange={this.onFormChange.bind(this, 'pathlabel')} />
						</Col>
					</Row>
					<Row className='item-title'>
						<Col span="8">
							<span className="title">描述</span>
						</Col>
						<Col span="16">
							<Input value={this.state.formData.description} onChange={this.onFormChange.bind(this, 'description')} />
						</Col>
					</Row>
					<Row className='item-title'>
						<Col span="8">
							<span className="title">上级导航</span>
						</Col>
						<Col span="16">
							<Select
								value={this.state.formData.p_id}
								onChange={this.onFormChange.bind(this, 'p_id')}
							>
								<Option value={0}>根节点</Option>
								{groupSelectUI}
							</Select>
						</Col>
					</Row>
					<Row className='item-title'>
						<Col span="8">
							<span className="title">是否为group</span>
						</Col>
						<Col span="16">
							<RadioGroup value={this.state.formData.is_group} onChange={this.onFormChange.bind(this, 'is_group')}>
								<Radio value={1}>是</Radio>
								<Radio value={0}>否</Radio>
							</RadioGroup>
						</Col>
					</Row>
					<Row className='item-title'>
						<Col span="8">
							<span className="title">是否展示在导航中</span>
						</Col>
						<Col span="16">
							<RadioGroup value={this.state.formData.is_shownav} onChange={this.onFormChange.bind(this, 'is_shownav')}>
								<Radio value={1}>是</Radio>
								<Radio value={0}>否</Radio>
							</RadioGroup>
						</Col>
					</Row>
					<Row className='item-title'>
						<Col span="8">
							<span className="title">排序</span>
						</Col>
						<Col span="16">
							<Input value={this.state.formData.sortindex} onChange={this.onFormChange.bind(this, 'sortindex')} />
						</Col>
					</Row>
					<Row className='item-title'>
						<Col span="8">
							<span className="title">状态</span>
						</Col>
						<Col span="16">
							<RadioGroup value={this.state.formData.is_enable} onChange={this.onFormChange.bind(this, 'is_enable')}>
								<Radio value={1}>已经启用</Radio>
								<Radio value={0}>已经停用</Radio>
							</RadioGroup>
						</Col>
					</Row>
					<Row className='item-title'>
						<Button type="primary" onClick={this.doAddRoute.bind(this)}>添加新路由</Button>
					</Row>
				</div>
			</div>
		</div>
	}
}

export default Index;