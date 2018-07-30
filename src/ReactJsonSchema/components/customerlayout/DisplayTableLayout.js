import React, { Component } from 'react'
import { browserHistory, Link } from 'react-router';
import _ from 'lodash'
import './dt_layout.scss'
import {
	Row,
	Col
} from 'antd'
const _tc = 100 // 多少条数据以后就显示更多按钮
class DisplayTableLayout extends Component {

	state = {
		_view: <div> loading </div>
	}

	componentWillMount = () => {
		this.makeView()
		// console.log(this.props)
	}

	doApprove = (params) => {
		return (e) => {
			console.log('params', params)
			// let action = params.action
			// if (!action) return
			// // console.log(action);
			// browserHistory.push({
			// 	pathname: '/myinfo/entityinfo',
			// 	state: { name: 'huhaoran' }
			// });
		}
	}

	showMore = (params) => {
		return () => {
			console.log(params)
		}
	}

	componentWillReceiveProps (nextProps) {
		this.makeView(nextProps)
	}
	
	makeView = (props) => {
		const { schema, formData, uiSchema } = props || this.props
		const allTask = formData.allTask
		let newView = <div>newView</div>
		let actionBtnConfig = _.get(uiSchema, `allTask.content.actionBtns`)
		let urlHeader = _.get(uiSchema, `allTask.content.url_header`)
		let urlItem = _.get(uiSchema, `allTask.content.url_item`)
		newView = allTask && allTask.map((item, index) => {
			let headerView = (
				<div className='dt-layout-header'>
					<div style={{ display: 'flex', flex: 15 }}>
						<span style={{fontSize:"16px",lineHeight:"50px"}}>
							{item.title}
						</span>
						<span style={{
							color: 'rgb(218, 112, 112)',
							marginLeft: 10,
							lineHeight:"50px"
						}}>
							{item.taskTotal + '条待处理'}
						</span>
					</div>
					{
						item.taskTotal > 0 ?
							<div style={{ display: 'flex', marginRight: 20 }}>
								<Link to={urlHeader[item.title].list_url}>查看更多</Link>
							</div>
							: <div></div>
					}
				</div>
			)

			let groupContentView = (
				<div className="empty-list">暂无数据</div>				
			)

			if (item.content.length > 0) {
 			groupContentView = item.content.map((i, t) => {
				if( t + 1 > _tc) return
				let actionView
				let leftView
				leftView = i.items && i.items.map((m, n) => {
					return (
						<div className='dt-layout-content-group-item'>
							<div style={{ padding:"0 10px" }}>
								{m.title}
							</div>
							<div style={{color:"green" }}>
								{m.value}
							</div>
						</div>
					)
				})
				// let actionBtnConfig = _.get(uiSchema, `allTask[${index}].content[${t}].actionBtns`)
				
				actionView = actionBtnConfig && actionBtnConfig.map((v, k) => {
					if(!urlItem[i.type]) {
						console.error('错误的任务类型')
						return 
					}
					let url = `${urlItem[i.type].item_url}?${v.params}=${i[v.params]}`
					return (
						<div>
							<Link to={url}>{v.title}</Link>
						</div>
					)
				})
				return (
					<div className='dt-layout-content-group'>
						<div style={{ display: 'flex', flex: 15 }}>
							{leftView}
						</div>
						<div style={{ display: 'flex', marginRight: 20}}>
							{actionView}
						</div>
					</div>
				)
			})
			}

			
			return (
				<div className='dt-layout-container'>
					{headerView}
					<div className='dt-layout-content'>
						{groupContentView}
					</div>
				</div>
			)
		})
		this.setState({ _view: newView })
	}


	render() {
		const { _view } = this.state
		return (
			<div>
				{_view}
			</div>
		)
	}
}

export default DisplayTableLayout