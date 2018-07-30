import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import sa from 'superagent';
import { Link } from 'react-router';
import { Modal, Button, Row, Col, Tree, Input, Select, Radio } from 'antd';
import { getRouteDetail, updateRouteConfig } from 'Pages/Fetcher';
const { TextArea } = Input;

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
			config: null
		}
	}

	componentDidMount() {
		this.fetchRouterInfo();
	}

	fetchRouterInfo = async () => {
		let routerId = this.props.router.location.state.params.id;
		let resp = await getRouteDetail(routerId);
		this.setState({
			pageReady: true,
			pageError: resp.code == 200 ? null : resp.msg,
			pageData: resp.value,
			config: resp.value == null ? null :  resp.value.config
		});
	}

	getFullPath = () => {
		let pageData = this.state.pageData;
		if (pageData == null) {
			return {
				pathname: '/' + pageData.pathname,
				pathlabel: '/根节点/' + pageData.pathlabel
			};
		} else {
			let cpath = pageData.pathname;
			let clabel = pageData.pathlabel;
			let tmpnode = pageData;
			while (tmpnode.parent != null) {
				tmpnode = tmpnode.parent;
				clabel = tmpnode.pathlabel + '/' + clabel;
				cpath = tmpnode.pathname + '/' + cpath;
			}
			return {
				pathname: '/' + cpath,
				pathlabel: '/' + clabel
			};
		}
	}

	doUpdateRoute = async () => {
		let id = this.props.router.location.state.params.id;
		let resp = await updateRouteConfig(id, this.state.config);
		if (resp.code != 200) {
			Dialog.error({
				title: '更新失败',
				content: resp.msg
			});
		} else {
			browserHistory.replace(this.props.router.location);
		}
	}

	onConfigChange = (ev) => {
		this.setState({
			config: ev.target.value
		})
	}

	doViewMock = () => {
	}

	render () {
		if (this.state.pageReady === false) {
			return <div>加载中...</div>;
		}
		if (this.state.pageError !== null) {
			return <div>{ this.state.pageError }</div>;
		}
		let fullPath = this.getFullPath();
		return <div>
				<Row className='item-title'>
					<Col span="24">
						<h1 className="title">页面设置</h1>
					</Col>
				</Row>
				<div style={{backgroundColor:'white'}}>
					<div style={{width: 800}}>
						<Row className='item-title'>
							<Col span="8">
								<span className="title">地址链接</span>
							</Col>
							<Col span="16">
								<span>{ fullPath.pathname }</span>
							</Col>
						</Row>
						<Row className='item-title'>
							<Col span="8">
								<span className="title">显示名称</span>
							</Col>
							<Col span="16">
								<span>{ fullPath.pathlabel }</span>
							</Col>
						</Row>
						<Row>
							<TextArea rows={10} value={this.state.config} onChange={this.onConfigChange.bind(this)} />
						</Row>
						<Row className='item-title'>
							<Button type="primary" onClick={this.doUpdateRoute.bind(this)} style={{ margin: '0 10px 0 0' }}>更新页面</Button>
						</Row>
					</div>
				</div>
			   </div>
	}
}

export default Index;