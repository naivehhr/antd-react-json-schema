/*
 * @Author: jiankang.zhang
 */
import React from 'react';
import UpdateComponent from 'Component/UpdateComponent';
import { _warpDataSource } from './utils';

function warpComponent(schema, props) {
  let params = props.location.query;
  //请求数据参数
  let uiSchemeFetcher = _warpDataSource(schema.uiSchemeSource);
  let fetchParams = null;
  if (schema.uiSchemeSource.fetchParams != null) {
    let key = schema.uiSchemeSource.fetchParams;
    fetchParams = {};
    fetchParams[key] = params[key];
  }

  //提交数据参数
  let submitFetcher = _warpDataSource(schema.dataSource.pushSource);
  let subParams = null;
  if (schema.dataSource.pushSource.fetchParams != null) {
    subParams = {};
    schema.dataSource.pushSource.fetchParams.map((key, index) => {
      subParams[key] = params[key];
    });
  }

  //更新之后的回跳
  let finUrl = schema.dataSource.callbackSource.url;
  return <UpdateComponent
            {...props}
            fetchDataFun={uiSchemeFetcher}
            fetchDataParams={fetchParams}
            submitFun={submitFetcher}
            pushParams={subParams}
            pushOnSubmit={finUrl}
          />;
}

function getSampleConfig() {
  return {
          component_type: 'UpdateComponent',
          uiSchemeSource: {
            method: 'get',
            url: '/core-user/v1/customer/update',
            fetchParams: 'id'
          },
          dataSource: {
            pushSource: {
              method: 'post',
              url: '/core-user/v1/customer/updatePost'
            },
            callbackSource: {
              url: '/customer/list'
            }
          }
        };
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;
