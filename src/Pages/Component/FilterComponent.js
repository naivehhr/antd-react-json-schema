import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Form } from 'antd'
import ReactJsonForm from "ReactJsonSchema";
import { fetch } from 'Ajax';
import { warpParams } from './utils'

class FilterComponent extends Component {
	constructor(props) {
        super(props)
        let config = props.pageConfig;
		this.state = {
            componentInit: false,
            componentError: null,
            sourceSchema: null,
            sourceUISchema: null,
            sourceFormData: null,
            staticSchema: config.staticSchema,
            staticUISchema: config.staticUISchema,
            staticFormData: config.staticFormData,
            storeObj: props.storeObj
		}
	}

	componentDidMount() {
        this._fetchPageSchema();
    }

    componentWillReceiveProps(nextProps) {
		this.setState({
			storeObj: nextProps.storeObj
		});
	}

    _fetchPageSchema = async() => {
        if (this.props.pageConfig.source == null) {
            this.setState({
                componentInit: true
            });
            return;
        }

        let fetchSource = this.props.pageConfig.source;
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
			sourceSchema: jsonSchema,
			sourceFormData: formData,
			sourceUISchema: this.props.pageConfig.sourceUISchema
        })
    }

	onStaticFormChange = (event, id) => {
		this.setState({
			staticFormData: event
        });
    }

    onSourceFormChange = (event, id) => {
		this.setState({
			sourceFormData: event
        });
    }

	render() {
        if (this.state.componentInit == false) {
            return <div> loading... </div>
        }
        if (this.state.componentError != null) {
            return <div> { this.state.componentError } </div>
        }
        let { staticFormData, staticSchema, staticUISchema, sourceFormData, sourceSchema, sourceUISchema } = this.state;
        let staticForm = null;
        if (staticSchema != null) {
            staticForm = (
                <AntdForm
                    {...this.props}
                    schema={staticSchema}
                    uiSchema={staticUISchema}
                    formData={staticFormData}
                    onChange={this.onStaticFormChange.bind(this)} >
                    <div />
                </AntdForm>
            )
        }
        let sourceForm = null;
        if (sourceSchema != null) {
            sourceForm = (
                <AntdForm
                    {...this.props}
                    schema={sourceSchema}
                    uiSchema={sourceUISchema}
                    formData={sourceFormData}
                    onChange={this.onSourceFormChange.bind(this)} >
                    <div />
                </AntdForm>
            )
        }

        let targetObj = {};
        if (staticFormData != null) {
            for (var key in staticFormData) {
                targetObj[key] = staticFormData[key]
            }
        }
        if (sourceFormData != null) {
            for (var key in sourceFormData) {
                targetObj[key] = sourceFormData[key]
            }
        }
        let config = this.props.pageConfig.component;
        config.targetObj = targetObj;
        config.targetObj.formData = _.cloneDeep(targetObj);
        config.targetObj._storeObj = this.state.storeObj;
        let childComponent = this.props.warpComponentBySchema(config, this.props, this.props.warpComponentBySchema);
		return (
            <div>
                { sourceForm }
                { staticForm }
                { childComponent }
            </div>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

const mapStateToProps = (state) => {
    return {
        storeObj: state
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeEntity: (entity) => {
            dispatch({ type: 'CHANGE_ENTITY', entity: entity})
        }
    }
}
FilterComponent = connect(mapStateToProps)(FilterComponent)

function warpComponent(schema, props, warpComponentBySchema) {
    //请求数据参数
    return <FilterComponent
              {...props}
              pageConfig={schema}
              warpComponentBySchema={warpComponentBySchema}
            />;
}

const ComponentModule = {
    warpComponent: warpComponent
};

export default ComponentModule;