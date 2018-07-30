import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactJsonForm from "ReactJsonSchema";
import { fetch } from 'Ajax'
import { warpParams } from '../utils';
import {
	message, Tabs, Table, Form, Icon, Input, Button, Select, Row, Col, Spin, Modal, Pagination
} from 'antd';
import { handleCallback } from '../utils';
import './schemaDialog.scss';

class SchemaDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fieldsLoading: true,
			title: props.config.title,
			okType: props.config.okType,
			jsonSchema: null,
			uiSchema: null,
			formData: null
		}
	}

	componentDidMount() {
		let { fetchSource } = this.props.pageConfig.source
		if(fetchSource) this.fetchQuery();
	}

	fetchQuery = async () => {
		let { fetchSource } = this.props.pageConfig.source;
		let locationQuery = this.props.router == null ? null : this.props.router.location.query;
		let targetObj = this.props.pageConfig.targetObj;
		let params = warpParams(targetObj, locationQuery, fetchSource.params);
		let result = await fetch(fetchSource.url, fetchSource.method, params);
		let { jsonSchema, formData } = result.value;
		this.setState({
			fieldsLoading: false,
			jsonSchema: jsonSchema,
			uiSchema: this.props.pageConfig.uiSchema,
			formData: formData
		});
	}

	handleModalCancel() {
		//自我消除
		ReactDOM.unmountComponentAtNode(this.props.container);
	}

	handleModalOk(formData={}){
		const { source } = this.props.pageConfig
		const { pushSource = {} }  = source
		let locationQuery = this.props.router == null ? null : this.props.router.location.query;
		let params = warpParams({}, locationQuery, pushSource.params);
		let promise = fetch(pushSource.url, pushSource.method, params)
		promise.then(d => {
			if(d.value && Object.keys(d.value.errors).length < 1) {
				message.success('操作成功!')
				this.handleModalCancel()
			} else {
				message.error('操作失败!')
			}
		}).catch(e => {
			console.error(e)
			message.error('操作失败!')
		})
	}

	handleFieldsSubmit = async (formData) => {
		let { pushSource } = this.props.pageConfig.source;
		let locationQuery = this.props.router == null ? null : this.props.router.location.query;
		let targetObj = this.props.pageConfig.targetObj;
		let params = warpParams(targetObj, locationQuery, pushSource.params);
		/**
		|--------------------------------------------------
		| @author aran.hu 添加 
		| nonuseDefaultFormData 
		| true => 不使用表单默认formData 
		|--------------------------------------------------
		*/
		params.formData = params.formData == null ? formData : _.merge(params.formData, formData)
		
		//去除formData中不需要的数据
		if (this.props.config.action.formDataOnlyUse) {
			let savArr = this.props.config.action.formDataOnlyUse;
			Object.keys(params.formData).map((_v)=>{
				if (savArr.indexOf(_v) < 0){
					delete params.formData[_v];
				}
			})
		}
        
		let result = await fetch(pushSource.url, pushSource.method, params);
		if (result.code == 200) {
			message.success('操作成功')
			setTimeout((function () {
				ReactDOM.unmountComponentAtNode(this.props.container);
				targetObj = targetObj == null ? {} : targetObj;
				if (formData != null) {
					for (var key in formData) {
						targetObj[key] = formData[key];
					}
				}
				if (typeof result.value == 'object') {
					for (var key in result.value) {
						targetObj[key] = result.value[key];
					}
				}
				handleCallback(targetObj, locationQuery, this.props.pageConfig.callback, this.props);
			}).bind(this), 1000);
		} else {
			message.error(result.data)
		}
	}

	onChange = (event, id) => {
		this.setState({
			formData: event
		})
	}

	render() {
		let { fieldsLoading, okType, title, jsonSchema, uiSchema, formData } = this.state;
		let { fetchSource } = this.props.pageConfig.source
		return (<Modal
			title={title}
			visible={true}
			onCancel={this.handleModalCancel.bind(this)}
			className="query-table-custom-fields schema-dialog-query-table"
			footer=""
		>
			{
				!fetchSource?
				(
					<div className="schema-dialog-button-group">
								<Button htmlType="submit" type="primary" onClick={this.handleModalOk.bind(this, formData)} tyle={{ marginRight: 5 }}>{okType == null ? "保存" : okType}</Button>
								<Button onClick={this.handleModalCancel.bind(this)}>退出</Button>
							</div>
				):
				fieldsLoading ? (
					<div className="loading">
						<Spin />
					</div>
				) : (
						<AntdForm
							{...this.props}
							schema={jsonSchema}
							uiSchema={uiSchema}
							formData={formData}
							onChange={this.onChange}
							onSubmit={this.handleFieldsSubmit}
						>
							<div style={{ textAlign: 'right' }} className="schema-dialog-button-group">
								<Button htmlType="submit" type="primary" style={{ marginRight: 5 }}>{okType == null ? "保存" : okType}</Button>
								<Button onClick={this.handleModalCancel.bind(this)}>退出</Button>
							</div>
						</AntdForm>
					)
			}

		</Modal>)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

let container = document.createElement('div');
container.className = "showschemadialog";
document.body.appendChild(container);
export const showSchemaDialog = function (pageConfig, props) {
	ReactDOM.render(<SchemaDialog {...props} pageConfig={pageConfig} container={container} />, container);
}