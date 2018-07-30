import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import sa from 'superagent';
import { Link } from 'react-router';
import { Modal, Button, Row, Col, Tree, Input, Select, Radio } from 'antd';
import { getRouteDetail, updateRouteBase } from 'Pages/Fetcher';
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

class Dialog {
    static getModal(type, params) {
        if (!this.modal) {
            let onOk = params.onOk
            params.onOk = () => {
                delete this.modal
                if (onOk) return onOk()
            }
            this.modal = Modal[type](params)
        }
    }
    static error(params) {
        this.getModal("error", params)
    }
}

class Index extends Component {
	constructor(props) {
		super(props)
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
		}
	}

	componentDidMount() {
		this.fetchRouterInfo();
	}

	fetchRouterInfo = async () => {
		let routerId = this.props.router.location.state.params.id;
		let resp = await getRouteDetail(routerId);
		if (resp.code != 200) {
			this.setState({
				pageReady: true,
				pageError: resp.msg
			});
		} else {
			let fullpath = '';
			let tmpparent = resp.value;
			while (tmpparent != null) {
				fullpath = '/' + tmpparent.pathname + fullpath;
				tmpparent = tmpparent.parent;
			}
			this.setState({
				pageReady: true,
				pageData: resp.value,
				formData: {
					id: resp.value.id,
					pathname: resp.value.pathname,
					pathlabel: resp.value.pathlabel,
					description: resp.value.description,
					p_id: resp.value.p_id,
					is_group: resp.value.is_group,
					is_shownav: resp.value.is_shownav,
					sortindex: resp.value.sortindex,
					is_enable: resp.value.is_enable,
					fullpath: fullpath
				}
			});
		}
	}

	getGroupList = () => {
		let groupList = [];
		let pageData = this.state.pageData;
		if (pageData == null) {
			groupList.push({
				id: 0,
				pathname: '/',
				pathlabel: '根节点'
			});
		} else {
			let cpath = pageData.pathname;
			let clabel = pageData.pathlabel;
			let tmpnode = pageData;
			while (tmpnode.parent != null) {
				tmpnode = tmpnode.parent;
				clabel = tmpnode.pathlabel + (tmpnode.description == null || tmpnode.description == "" ? "" : ("(" + tmpnode.description + ")")) + '/' + clabel;
				cpath = tmpnode.pathname + '/' + cpath;
			}
			groupList.push({
				id: pageData.p_id,
				pathname: cpath,
				pathlabel: clabel
			});
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

	doUpdateRoute = async () => {
		let resp = await updateRouteBase(this.state.formData);
		if (resp.code != 200) {
			Dialog.error({
				title: '更新失败',
				content: resp.value
			});
		} else {
			browserHistory.replace(this.props.router.location);
		}
	}

	enterEditPage () {
		let routerId = this.props.router.location.state.params.id;
		browserHistory.push({
			pathname: '/system/routerpageset',
			state: {
				params: {
					id: routerId
				}
			}
		})
	}

	render () {
		if (this.state.pageReady === false) {
			return <div>加载中...</div>;
		}
		if (this.state.pageError !== null) {
			return <div>{ this.state.pageError }</div>;
		}

		let groupList = this.getGroupList();
		let groupSelectUI = [];
		for (let i = 0; i < groupList.length; i++) {
			groupSelectUI.push(<Option value={groupList[i].id}>/{groupList[i].pathlabel}</Option>)
		}
		let editConfigLink = this.state.formData.is_group ? null : (<Button type="primary" onClick={this.enterEditPage.bind(this)}>设置页面信息</Button>);
		
		return <div>
				<Row className='item-title'>
					<Col span="24">
						<h1 className="title">设置路由</h1>
					</Col>
				</Row>
				<div style={{backgroundColor:'white'}}>
					<div style={{width: 400}}>
						<Row className='item-title'>
							<Col span="8">
								<span className="title">导航标识</span>
							</Col>
							<Col span="16">
							{this.state.formData.fullpath}
							</Col>
						</Row>
						<Row className='item-title'>
							<Col span="8">
								<span className="title">显示名称</span>
							</Col>
							<Col span="16">
								<Input value={this.state.formData.pathlabel}onChange={this.onFormChange.bind(this, 'pathlabel')}/>
							</Col>
						</Row>
						<Row className='item-title'>
							<Col span="8">
								<span className="title">描述</span>
							</Col>
							<Col span="16">
								<Input value={this.state.formData.description} onChange={this.onFormChange.bind(this, 'description')}/>
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
									disabled={true}
								>
									{ groupSelectUI }
								</Select>
							</Col>
						</Row>
						<Row className='item-title'>
							<Col span="8">
								<span className="title">是否为group</span>
							</Col>
							<Col span="16">
								<RadioGroup value={this.state.formData.is_group} onChange={this.onFormChange.bind(this, 'is_group')}>
									<Radio disabled={true} value={1}>是</Radio>
									<Radio disabled={true} value={0}>否</Radio>
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
								<Input value={this.state.formData.sortindex} onChange={this.onFormChange.bind(this, 'sortindex')}/>
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
							<Button type="primary" onClick={this.doUpdateRoute.bind(this)} style={{margin: '0 10px 0 0'}}>更新路由</Button>
							{ editConfigLink }
						</Row>
					</div>
				</div>
			   </div>
	}
}

export default Index;