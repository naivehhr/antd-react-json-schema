import React, { PureComponent } from "react";
import { Button, Modal, TreeSelect, Row, Col, Radio, Input, Checkbox, message } from 'antd'
import _ from 'lodash'
import CacheTreeView from './CacheTreeView'
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TreeNode = TreeSelect.TreeNode;
export default class AntdRelatedSelectWidget extends PureComponent {

	constructor(props) {
		super(props)
		this.state = {
			defaultValue: ['小怪兽, 注册时间'], //select treee default value 暂未实现
			currentSelectValue: ['小怪兽, 注册时间'], // selecttree 展开后选中的东西 暂未实现
			selectItem: {}, // 真正的item数据
			relValue: this.props.value, // 回传的组件内数据
			view: false,
			treeData: this.props.treeData,
			propertyView: (
				<div>
					无属性可选择
				</div>
			),
			selectData: {}, //列表中选择的数据
			radioValue: false,
			checkBoxsValue: [],
			invalidHidden: true
		}
		// console.log(this.props)
	}


	componentDidMount() {

		this.init()

		// 上层value中缺少 invalidHidden
		// 传入的value是个完整的relation_setting结构
		// 从relation_setting 中获取rely的内容遍历之
		// 遍历查找从treeData.properties
		// 上层的schema formData 是怎么匹配的?

	}

	init() {
		const { id, treeData } = this.props
		const { relValue } = this.state
		const { invalidHidden, rely } = relValue
		if(Object.keys(relValue).length < 1) return
		if (!treeData || Object.keys(treeData).length < 1) {
			console.log('RelativeSeletComp init treeData 数据不完整, 无初始化内容')
			return
		}
		const { properties } = treeData
		if (Object.keys(relValue).length < 1 || Object.keys(properties).length < 1) {
			// console.log('RelativeSeletComp init relValue || properties数据不完整, 无初始化内容')
			return
		}

		// console.log('relValue', relValue)
		// console.log('treeData', treeData)

		let selectData = {}
		Object.keys(rely).forEach((i) => {
			let path
			if (i.indexOf('group') != -1) {
				// 跨层特殊处理
				path = i
			} else {
				path = i.split('.').join('.properties.')
			}
			let item = _.get(properties, path)
			if (item) {
				selectData[item.title] = {
					value: rely[i],
					id: i // i 就是下面 fun add 的 selectItem.id
				}
			}
		})
		this.setState({ selectData, invalidHidden: relValue.invalidHidden })

	}

	onCancel = () => {
		this.setState({
			view: false
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			treeData: nextProps.treeData
		})
	}
	radioOnChange = (e) => {
		this.setState({ radioValue: e.target.value })
	}

	checkBoxOnChange = (e) => {
		// console.log('checkBoxOnChange', e)
		this.setState({ checkBoxsValue: e })
	}

	invalidRadioOnChange = (e) => {
		this.setState({ invalidHidden: e.target.value })
	}

	onChange = (title, label, extra) => {
		if (!title) return // 为啥会出现 undefined
		// const { treeData } = this.props		
		const { triggerNode: { props: { item } } } = extra
		this.setState({ selectItem: item }, () => {
			this.makeAttributeView(item.type, item)
		});
	}

	makeAttributeView = (type = 'string', item) => {
		let propertyView
		switch (type) {
			case 'string':
				let optionsView
				if (item.enum && item.enum.length > 0) {
					optionsView = item.enum.map((v, i) => {
						return <Checkbox value={v}>{item.enumNames[i]}</Checkbox>
					})
					propertyView = (
						<Checkbox.Group
							onChange={this.checkBoxOnChange}
						>
							{optionsView}
						</Checkbox.Group>
					)
				}
				break;
			case 'boolean':
				propertyView = (
					<div>
						属性选择
						<RadioGroup onChange={this.radioOnChange}>
							<Radio value={true}>true</Radio>
							<Radio value={false}>false</Radio>
						</RadioGroup>
					</div>
				)
				break;
			default:
		}
		this.setState({ propertyView });
	}

	controlView = view => () => this.setState({ view })

	add = () => {
		const { radioValue, selectItem, selectData, checkBoxsValue } = this.state
		if (!selectItem || Object.keys(selectItem).length < 1){
			message.error('请选择关联字段')
			return
		}
		let _selectData = _.cloneDeep(selectData)
		let arr = []
		let tv
		if (selectItem.enum && selectItem.enum.length > 0) {
			tv = checkBoxsValue == undefined ? 'undefined' : checkBoxsValue
		} else {
			tv = radioValue == undefined ? 'undefined' : radioValue
		}
		if(tv instanceof Array) {
			arr.push(...tv)
		} else {
			arr.push(tv)
		}
		_selectData[selectItem.title] = {
			value: arr,
			id: selectItem.id
		}
		this.setState({ selectData: _selectData })
	}

	dropItem(key) {
		const { selectData } = this.state
		let _selectData = _.cloneDeep(selectData)
		delete _selectData[key]
		this.setState({ selectData: _selectData })
	}

	select = () => {
		const { selectData, value, invalidHidden } = this.state
		const { onSelect, id } = this.props
		let obj = {}
		let relObject = {}
		obj['formDataID'] = id
		obj['invalidHidden'] = invalidHidden
		Object.values(selectData).map((v, i) => {
			relObject[v.id] = v.value
		})
		obj['rely'] = relObject
		// console.log('obj', obj)
		onSelect && onSelect(obj)
		this.onCancel()
	}

	render() {
		let {
			view,
			defaultValue,
			currentSelectValue,
			propertyView,
			selectData,
			invalidHidden
		} = this.state
		let btn = (
			<div className="selectComponent-sub-btn" >
				<Button type="button" onClick={this.onCancel}>取消</Button>
				<Button style={{ marginLeft: 10 }} htmlType="submit" type="primary">确定</Button>
			</div>
		)
		let treeNodeView = CacheTreeView.getTreeView()
		let listView
		// treeNodeView = {}
		let keys = Object.keys(selectData)
		if (keys.length > 0) {
			listView = keys.map((v, i) => {
				let item = selectData[v]
				let str = item.value.join(',')
				return (
					<div style={{ marginTop: 20 }}>
						<Row>
							<Col span={6} >{v}</Col>
							<Col span={12}>{str}</Col>
							<Col>
								<Button size={'small'} onClick={this.dropItem.bind(this, v)}>删除</Button>
							</Col>
						</Row>
					</div>
				)
			})
		}
		// <input id={this.props.id} placeholder={"请选择"} className="ant-input ant-input-lg" disabled value ={(value && value.title) || ''} />
		return (
			<div className="selectComponent">
				<Button className="" onClick={this.controlView(true)}>{"选择"}</Button>
				<Modal
					title={'选择关联显示'}
					visible={view}
					onCancel={this.onCancel}
					footer={[]}
				>
					<Row>
						<TreeSelect
							showSearch
							style={{ width: 300 }}
							dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
							placeholder="请选择"
							allowClear
							treeDefaultExpandAll
							onChange={this.onChange}
						>
							{treeNodeView}
						</TreeSelect>
						<div style={{marginTop: 20}}>
							{propertyView}
						</div>
					</Row>
					{listView}
					<Row style={{ marginTop: 20 }}>
						<Col span={6}>关联无效是否隐藏</Col>
						<Col span={14}>
							<RadioGroup onChange={this.invalidRadioOnChange} value={invalidHidden}>
								<Radio value={true}>true</Radio>
								<Radio value={false}>false</Radio>
							</RadioGroup>
						</Col>
					</Row>
					<div style={{ marginTop: 20 }}>
						<Button className="" onClick={this.add}>{"添加"}</Button>
						<Button className="" style={{ marginLeft: 10 }} onClick={this.select}>{"确定"}</Button>
					</div>
				</Modal>
			</div >
		)
	}
}

function sleep(milliSeconds) {
	var startTime = new Date().getTime(); // get the current time    
	while (new Date().getTime() < startTime + milliSeconds);
}
// console.log('start...');
// sleep(3000);
// console.log('end...');