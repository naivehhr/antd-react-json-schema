import React, { Component } from 'react'
import { fetch } from 'Ajax'
import { Form, message } from 'antd'
import ReactJsonForm from "ReactJsonSchema";
import SchemaField from 'ReactJsonSchema/components/fields/SchemaField'
import { warpUrlParams } from './utils'

class SchemaComponent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataReady: false
		}
	}

	componentDidMount() {
		this.fetchInfoData();
	}

	fetchInfoData = async () => {
		let queryReq = this.props.schema.queryReq;
		let paramsdata = warpUrlParams(queryReq.fetchParams, this.props.location.query);
		let { code, value } = await fetch(queryReq.url, queryReq.method, paramsdata);
		let title = this.props.schema.title;
		// console.log(value);
		if (code == 200) {
			this.setState({
				dataReady: true,
				schema: value.jsonSchema,
				uiSchema: this.props.schema.uiSchema == null ? value.uiSchema : value.uiSchema,
				formData: value.formData
			})
		}
	}

	render() {
		if (this.state.dataReady == false) {
			return <div>loading...</div>;		
		}
		const {
			uiSchema,
			formData,
			schema
		} = this.state;
		let uiSchemaString = (uiSchema && JSON.parse(uiSchema)) || {};
		return <AntdForm uiSchema={uiSchemaString} formData={formData} schema={schema} />
	}
}

const AntdForm = Form.create()(ReactJsonForm)

function warpComponent(schema, props) {
	// console.log(schema);
	let nprops = { ...props, schema: schema }
	return <SchemaComponent {...nprops} />
}

const ComponentModule = {
	warpComponent: warpComponent
};

export default ComponentModule;
