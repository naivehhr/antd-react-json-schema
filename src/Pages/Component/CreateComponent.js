/*
 * @Author: jiankang.zhang
 */
import React from 'react';
import CreateComponent from 'Component/CreateComponent';
import { _warpDataSource } from './utils';

function warpComponent(schema, props) {
  let fetchSchema = _warpDataSource(schema.queryReq);
  let fetchDataParams = schema.queryReq.params == null ? null : schema.queryReq.params;
  let submitFetcher = _warpDataSource(schema.dataSource.pushSource);
  let submitDataParams = schema.dataSource.pushSource.params == null ? null : schema.dataSource.pushSource.params;
  let finUrl = schema.dataSource.callbackSource.url;
  let method = schema.dataSource.callbackSource.method;
  let uiSchema = schema.uiSchema;
  return (<CreateComponent
           {...props}
           fetchDataFun={fetchSchema}
           fetchDataParams={fetchDataParams}
           uiSchema={uiSchema}
           submitFun={submitFetcher}
           submitAddParams={submitDataParams}
           pushOnSubmitCallback={method}
           pushOnSubmit={finUrl}
         />);
}

const ComponentModule = {
  warpComponent: warpComponent
};

export default ComponentModule;