import {
	Layout,
	Menu,
	Icon,
	Breadcrumb,
	Button,
	Collapse,
	Input,
	Radio,
	Select,
	DatePicker,
	Checkbox,
	Upload,
	message,
	Tabs,
} from 'antd'
const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const Panel = Collapse.Panel
import React, { Component } from "react";
import {
	orderProperties,
	retrieveSchema,
	getDefaultRegistry,
} from "../../utils";
import _ from 'lodash';

export const SimpleLayout = (children, title, schema) => {
	// console.log('schema', schema)
	return (
		<div className="layout-wrapper layout-simple">
			<TitleView title={title} required={true} schema={schema} />
			<div className="simple-layout">
				{children}
			</div>
		</div>
	)
}

export const ContainerPaddingLayout = (children, title, schema) => {		
	// console.log('schema', schema)
	return (
		<div className="layout-wrapper layout-container-padding">
			<TitleView title={title} required={true} schema={schema} />
			<div className="container-padding">
				{children}
			</div>
		</div>
	)
}
//整体form的容器
export const WholeSchemaLayout = (children, title, schema) => {
	return (
		<div className="layout-wrapper whole-schema-layout">
			<TitleView title={title} required={true} schema={schema} />
			<div className="whole-schema-inner">
				{children}
			</div>
		</div>
	)
}
//每个带灰色标题的容器
export const TitleChildLayout = (children, title, schema) => {
	return (
		<div className="layout-wrapper title-child-layout">
			<TitleView title={title} required={true} schema={schema} />
			<div className="title-child-layout-inner">
				{children}
			</div>
		</div>
	)
}
export const TransparentLayout = (children, title, schema) => {
	// console.log('schema', schema)
	return (
		<div className="layout-wrapper layout-transparent">
			<TitleView title={title} required={true} schema={schema} />
			<div className="transparent">
				{children}
			</div>
		</div>
	)
}

export const BlockLayout = (children, title, schema) => {
	// console.log('schema', schema)
	return (
		<div className="layout-wrapper layout-block">
			<TitleView title={title} required={true} schema={schema} />
			<div className="block-layout">
				{children}
			</div>
		</div>
	)
}

export const TabsLayout = (children, title, schema) => {
	// console.log(children);
	// const registry = getDefaultRegistry()
	// const TitleField = registry.fields.TitleField
	// let newChildren =  _.cloneDeep(children);
	// const { schema } = children && children.props
	// if(schema && schema.groupBy) {

	// }
	let tabPaneView = children.map((v, i) => {
		const { schema } = v.props
		// var users = [
		// 	{ 'user': 'barney',  'age': 36, 'active': true },
		// 	{ 'user': 'fred',    'age': 40, 'active': false },
		// 	{ 'user': 'pebbles', 'age': 1,  'active': true }
		// ];

		// // let newValue = _.cloneDeep(v)
		// // console.log(newValue)
		// if(schema.groupBy != '') {
		// 	let gropuResult = _.groupBy(schema.enum, (value)=> value.data.usage);
		// 	// console.log(gropuResult)
		// 	let _views = []
		// 	for(let item in gropuResult) {
		// 		let newValue = _.cloneDeep(v)
		// 		delete newValue.props.schema.enum
		// 		delete newValue.props.schema.enumNames
		// 		let title = item
		// 		let itemsViewArr = gropuResult[item]
		// 		// console.log('itemsViewArr=',itemsViewArr)
		// 		let newNames = itemsViewArr.map((v, i) => {
		// 			return v.data.key
		// 		})
		// 		// console.log('newNames==', newNames)
		// 		newValue.props.schema["enum"] = itemsViewArr
		// 		newValue.props.schema["enumNames"] = newNames
		// 		let t = <TabPane tab={title} key={item}>{newValue}</TabPane>
		// 		_views.push(t)
		// 	}

		// 	return _views
		// 	// let _views
		// 	// for(let item in gropuResult) {
		// 	// 	let title = item
		// 	// 	let itemsViewArr = gropuResult[item]
		// 	// 	console.log(itemsViewArr)
		// 	// }

		// }
		let tabTitle = schema.title
		let _titleLevel = schema.titleLevel
		if (_titleLevel && +_titleLevel == 0) return // 0 不显示 为了设置里面的一个特殊情况，如果不用
		return <TabPane tab={tabTitle || `Tabs${i}`} key={i}>{v}</TabPane>
	})
	return (
		<div>
			{/* <TitleView title={title} required={true} schema={schema} /> */}
			<Tabs defaultActiveKey={schema.defaultActiveKey || '0'}>
				{tabPaneView}
			</Tabs>
		</div>
	)
}

export const CollapseLayout = (children, title, schema) => {
	if (title) {
		return (
			<Collapse defaultActiveKey={[`${title}`]} >
				<TitleView title={title} required={true} schema={schema} />
				<Panel header={title} key={title} >
					{children}
				</Panel>
			</Collapse>
		)
	} else {
		return (
			<div>
				{children}
			</div>
		)
	}
}


export const HorizontalLayout = (children, title, schema) => {
	return (
		<div>
			<TitleView title={title} required={true} schema={schema} />
			<div className="horizontal-layout">
				{children}
			</div>
		</div>
	)
}


const TitleView = (props) => {
	const registry = getDefaultRegistry()
	const TitleField = registry.fields.TitleField
	const { schema, title } = props
	return (
		<div>
			{title ? (
				<TitleField
					title={title}
					required={true}
					titleLevel={schema.titleLevel}
				/>
			) :
				<div />
			}
		</div>
	)
}
