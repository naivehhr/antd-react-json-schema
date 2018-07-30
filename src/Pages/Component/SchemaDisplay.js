import React, { Component } from 'react';
import { message, Form } from 'antd'
import ReactJsonForm from "ReactJsonSchema";
import { fetch } from 'Ajax';
import { warpParams } from './utils'

class SchemaComponent extends Component {
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
        // jsonSchema.properties.business_license_info.properties.business_licence_pic.format = 'image'
        jsonSchema.readonly = true;
        this.setState({
            componentInit: true,
			schema: jsonSchema,
			formData: formData,
			uiSchema: this.props.pageConfig.uiSchema
        })
    }

	render() {
        if (this.state.componentInit == false) {
            return <div> loading... </div>
        }
        if (this.state.componentError != null) {
            return <div> { this.state.componentError } </div>
        }
		const {
			schema,
			uiSchema,
			formData
        } = this.state
		return (
			<AntdForm
				{...this.props}
				schema={schema}
				uiSchema={uiSchema}
				formData={formData} >
				<div></div>
			</AntdForm>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

function warpComponent(schema, props) {
    //请求数据参数
    return <SchemaComponent
              {...props}
              pageConfig={schema}
            />;
}

const ComponentModule = {
    warpComponent: warpComponent
};

export default ComponentModule;