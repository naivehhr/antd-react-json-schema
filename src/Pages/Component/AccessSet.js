import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import sa from 'superagent';
import './accessset.scss';
import { message, Modal, Button, Row, Col, Tree, Input, Select, Radio, Checkbox, Spin } from 'antd';
import { fetchMockData } from 'Pages/Fetcher';
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;

class AccessTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			accessList: this.formatAccessList(props.accessList, props.currentAccess)
		}
	}

	componentWillReceiveProps (nextProps) {
		this.setState({
			accessList: this.formatAccessList(nextProps.accessList, nextProps.currentAccess)
		});
	}

	formatAccessList = (accessList, accessMap) => {
		let newAccessList = [];
		accessMap = accessMap == null ? {} : accessMap;
		for (var i = 0; i < accessList.length; i++) {
			let oldAccess = accessList[i];
			let newAccess = {id: oldAccess.id, name: oldAccess.name, des: oldAccess.des};
			let newAccessChildren = [];
			for (var j = 0; j < oldAccess.children.length; j++) {
				newAccessChildren.push({
					id: oldAccess.children[j].id,
					name: oldAccess.children[j].name,
					checked: accessMap[oldAccess.children[j].id + ''] === true
				})
			}
			newAccess.children = newAccessChildren;
			newAccessList.push(newAccess);
		}
		return newAccessList;
	}

	onColumnChange = (routeid, itemid, event) => {
		let accessList = this.state.accessList;
		for (var i = 0; i < accessList.length; i++) {
			if (accessList[i].id === routeid) {
				for (var j = 0; j < accessList[i].children.length; j++) {
					if (accessList[i].children[j].id === itemid) {
						accessList[i].children[j].checked = event.target.checked;
						this.setState({
							accessList: accessList
						});
						return;
					}
				}
				return;
			}
		}
	}

	updateGroupColumn = (routeid, checked) => {
		let accessList = this.state.accessList;
		for (var i = 0; i < accessList.length; i++) {
			if (accessList[i].id === routeid) {
				for (var j = 0; j < accessList[i].children.length; j++) {
					accessList[i].children[j].checked = checked;
				}
				this.setState({
					accessList: accessList
				});
				return;
			}
		}
	}

	getAccessTable = () => {
		let accessTrList = [];
		for (let i = 0; i < this.state.accessList.length; i++) {
			let accessGroup = this.state.accessList[i];
			let childOptions = [];
			for (let j = 0; j < accessGroup.children.length; j++) {
				let childoptitem = accessGroup.children[j];
				childOptions.push(<Checkbox checked={childoptitem.checked} onChange={this.onColumnChange.bind(this, accessGroup.id, childoptitem.id)}>{childoptitem.name}</Checkbox>)
			}
			let accessGroupName = accessGroup.name + (accessGroup.des == null || accessGroup.des == "" ? "" : ("(" + accessGroup.des + ")"));
			accessTrList.push(<tr>
								<td className='col1'>{ accessGroupName }</td>
								<td className='col2'>{childOptions}</td>
								<td className='col3'>
									<Button size={'small'} style={{margin: '0 5px'}} type="primary" onClick={this.updateGroupColumn.bind(this, accessGroup.id, true)}>全选</Button>
    								<Button size={'small'} style={{margin: '0 5px'}} onClick={this.updateGroupColumn.bind(this, accessGroup.id, false)}>取消</Button></td>
							  </tr>)
		}
		return accessTrList;
	}

	getAccessList () {
		let accessList = this.state.accessList;
		let dataList = [];
		for (let i = 0; i < this.state.accessList.length; i++) {
			let accessGroup = this.state.accessList[i];
			let childOptions = [];
			for (let j = 0; j < accessGroup.children.length; j++) {
				let childoptitem = accessGroup.children[j];
				if (childoptitem.checked === true) {
					dataList.push(childoptitem.id);
				}
			}
		}
		return dataList;
	}

	render () {
		let accessTrList = this.getAccessTable();
		let table = (<table className="roleaccesstable">
						<thead>
							<tr>
								<th className="col1">菜单名称</th>
								<th className="col2">权限点</th>
								<th className="col3">批量操作</th>
							</tr>
						</thead>
						<tbody>
							{ accessTrList }
						</tbody>
					</table>);
		if (this.props.currentAccess === null) {
			return (<Spin>{table}</Spin>);
		}
		return <div>{table}</div>;
	}
}

class AccessSet extends Component {
  /**
   * props包含
   * roleListSource 角色列表资源
   * accessListSource 权限列表资源
   * roleAccessSource 角色权限配置
   * roleAccessStore 角色权限存储
   */
	constructor(props) {
		super(props)
		this.state = {
			accessList: null, //路由列表
			roleList: null, //角色列表
			currentRole: null, //当前角色
			currentAccess: null, //当前角色权限
			pageError: null
		}
		this.lastFetchIdx = 0;
	}

	componentDidMount() {
		this.fetchAccessAndRoleList();
	}

	getRoleAccess = async (currentRole) => {
		this.lastFetchIdx++;
		let fetchIdx = this.lastFetchIdx;
		let accessResp = await fetchMockData(this.props.schema.roleAccessSource + '?rid=' + currentRole.id);
		//延迟请求之后结果是否一致
		if (fetchIdx !== this.lastFetchIdx) {
			return;
		}
		let currentAccess = {};
		if (accessResp.code === 200) {
			if (accessResp.value != null && accessResp.value.config != null) {
				let jsonstrConfig = accessResp.value.config;
				try {
					let targetArr = JSON.parse(jsonstrConfig);
					if (targetArr != null && typeof targetArr == 'object' && targetArr.length > 0) {
						for (var i = 0; i < targetArr.length; i++) {
							currentAccess[targetArr[i] + ""] = true;
						}
					}
				} catch (e) {
				}
			}
		} else {
			//TOAST 权限加载失败了，直接修改默认会覆盖之前的权限设置，请谨慎
		}
		this.setState({
			currentAccess: currentAccess
		});
	}

	//拉取access列表
	fetchAccessAndRoleList = async () => {
		let accessList = [];
		let roleList = [];
		let currentRole = null;
		let pageError = null;
    	let accessResp = await fetchMockData(this.props.schema.accessListSource);
		if (accessResp.code == 200) {
			accessList = accessResp.value;
		} else {
			pageError = accessResp.msg;
		}
		if (pageError === null) {
			let roleResp =  await fetchMockData(this.props.schema.roleListSource);
			if (roleResp.code == 200) {
				roleList = roleResp.value;
				currentRole = roleList[0];
				this.getRoleAccess(currentRole);
			} else {
				pageError = roleResp.msg;
			}
		}
		this.setState({
			accessList: accessList,
			roleList: roleList,
			currentRole: currentRole,
			pageError: pageError
		});
	}

	//选择权限时候的bulabula
	onRoleChange = (value) => {
		for (var i = 0; i < this.state.roleList.length; i++) {
			if (value == this.state.roleList[i].id) {
				this.setState({
					currentRole: this.state.roleList[i],
					currentAccess: null
				});
				this.getRoleAccess(this.state.roleList[i]);
			}
		}
	}

	_getRoleOptions = () => {
		let roleOptions = [];
		for (var i = 0; i < this.state.roleList.length; i++) {
			roleOptions.push(<Option value={this.state.roleList[i].id}>{this.state.roleList[i].role_name}</Option>)
		}
		return roleOptions;
	}

	onUpdateAccess = async () => {
		let accessList = this.refs.accessTable.getAccessList();
		let roleResp = await fetchMockData(this.props.schema.roleAccessStore + '?rid=' + this.state.currentRole.id + '&config=' + encodeURIComponent(JSON.stringify(accessList)));
		message.info('权限保存成功');
	}

	render () {
		if (this.state.pageError !== null) {
			return <div>{ this.state.pageError }</div>;
		}
		if (this.state.accessList === null || this.state.roleList === null) {
			return <div>加载中...</div>;
		}
		let roleOptions = this._getRoleOptions();
		return <div>
					<div style={{backgroundColor:'white'}}>
						<Row>
							<Col span="2">
								<span className="title">选择角色</span>
							</Col>
							<Col span="22">
								<Select
									value={this.state.currentRole.id}
									style={{ width: 200 }}
									onChange={this.onRoleChange}
								>
									{ roleOptions }
								</Select>
							</Col>
						</Row>
						<div>
							<AccessTable ref="accessTable" currentAccess={this.state.currentAccess} accessList={this.state.accessList} />
						</div>
						<Row className='item-title'>
							<Button type="primary" onClick={this.onUpdateAccess.bind(this)}>更新权限</Button>
						</Row>
					</div>
				</div>
	}
}

function warpComponent(schema, props) {
  //请求数据参数
  return <AccessSet
            {...props}
            schema={schema}
          />;
}

function getSampleConfig() {
  return {};
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;