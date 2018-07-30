/*
 * @Author: jiankang.zhang
 */
import React, { Component } from 'react'
import { browserHistory } from 'react-router'
import { Form, message } from 'antd'
import ReactJsonForm from "ReactJsonSchema";
import { _warpDataSource } from './utils';
import { fetch } from 'Ajax';

class PageForm extends Component {
  constructor(props) {
    super(props);
  }

  getSchemaInfo() {
    let schema = this.props.config.schema;
    let uiSchema = this.props.config.uiSchema;
    let formparams = this.props.config.formparams;
    let formData = {};
    const params = this.props.location.query;
    for (var i = 0; i < formparams.length; i++) {
      let key = formparams[i];
      if (params[key] != null) {
        formData[key] = params[key];
      }
    }
    return {schema, uiSchema, formData};
  }

  onSubmit = async (formData) => {
    const params = this.props.location.query;
    let config = this.props.config;
    //提交数据参数
    let submitFetcher = _warpDataSource(config.dataSource.pushSource);
    let subParams = null;
    if (config.dataSource.pushSource.fetchParams != null) {
      subParams = {};
      config.dataSource.pushSource.fetchParams.map((key, index) => {
        subParams[key] = params[key];
      });
    }
    //更新之后的回跳
    let finUrl = config.dataSource.callbackSource.url;
    let { code } = await fetch(config.dataSource.pushSource.url, config.dataSource.pushSource.method, formData);
    if (code == 200) {
      browserHistory.push({
        pathname: finUrl
      })
    }
  }

  render () {
    let { schema, uiSchema, formData } = this.getSchemaInfo();
    return <AntdForm
            schema={schema}
            uiSchema={uiSchema}
            formData={formData}
            onSubmit={this.onSubmit} />
  }
}
const AntdForm = Form.create()(ReactJsonForm)

function warpComponent(config, props) {
  return <PageForm
            {...props}
            config={config}/>
}

function getSampleConfig() {
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;