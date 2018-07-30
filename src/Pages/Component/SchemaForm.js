import React, { Component } from 'react';
import { message, Form } from 'antd'
import ReactJsonForm from "ReactJsonSchema";
import { fetch } from 'Ajax';
import { warpParams, handleCallback } from './utils'
import _ from "lodash";

class SchemaFormComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
            componentInit: false,
            componentError: null,
			schema: null,
			uiSchema: null,
			formData: null
		}
	}

	componentDidMount() {
        this._fetchPageSchema();
    }

    _fetchPageSchema = async() => {
        let { fetchSource } = this.props.pageConfig.source;
        let locationQuery = this.props.router == null ? null : this.props.router.location.query;
        let params = warpParams(this.props.pageConfig.targetObj, locationQuery, fetchSource.params);
        let result = await fetch(fetchSource.url, fetchSource.method, params);
        if (result.code !== 200) {
            this.setState({
                componentInit: true,
                componentError: '数据请求错误'
            })
			return;
        }
        let { jsonSchema, formData} = result.value;
        this.setState({
            componentInit: true,
			schema: jsonSchema,
			formData: formData,
			uiSchema: this.props.pageConfig.uiSchema
        })
    }

	submit = async (formData, callback) => {
        let { pushSource } = this.props.pageConfig.source;
        let locationQuery = this.props.router == null ? null : this.props.router.location.query;
        let params = warpParams(this.props.pageConfig.targetObj, locationQuery, pushSource.params);
        params.formData = params.formData == null ? formData : _.merge(params.formData, formData)
        let result = await fetch(pushSource.url, pushSource.method, params);
		let { code } = result
		if (code == 200) {
            message.success('操作成功')
            this.onCallback(formData, result.value);
		} else {
            message.error(result.data)
		}
    }

    onCallback = (form, response) => {
        let targetObj = response == null ? {} : response;
        for (var key in form) {
            targetObj[key] = form[key];
        }
        let locationQuery = this.props.router == null ? null : this.props.router.location.query;
        handleCallback(targetObj, locationQuery, this.props.pageConfig.callback, this.props);
    }

	onChange = (event, id) => {
		this.setState({
			formData: event
		})
	}

	render() {
        if (this.state.componentInit == false) {
            return <div> loading... </div>
        }
        if (this.state.componentError != null) {
            return <div> { this.state.componentError } </div>
        }
		let {
			schema,
			uiSchema,
			formData
        } = this.state
		return (
			<AntdForm
				{...this.props}
				schema={schema}
				uiSchema={uiSchema}
				formData={formData}
				onChange={this.onChange}
				onSubmit={this.submit} />
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

function warpComponent(schema, props) {
    //请求数据参数
    return <SchemaFormComponent
              {...props}
              pageConfig={schema}
            />;
}

const ComponentModule = {
    warpComponent: warpComponent
};

export default ComponentModule;