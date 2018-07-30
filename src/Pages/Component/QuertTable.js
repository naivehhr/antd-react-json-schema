/*
 * @Author: jiankang.zhang
 */
import React from 'react';
import {
	Icon, Tooltip, Button
} from 'antd';
import QueryTable from 'Component/QueryTable';
import { _warpDataSource, warpUrlParams, verifyDependency } from './utils';
import ActionButton from './ActionButton';

function warpComponent(schema, props, warpComponentBySchema) {
  let opt = null;
  if (schema.action_opt != null && schema.action_opt.renderitems != null && schema.action_opt.renderitems.length > 0) {
    opt = {};
    opt.title = '操作';
    opt.fixed = 'right';
    opt.width = schema.action_opt.width;
    opt.key = 'action';
    opt.render = (text, record) => {
      let actChildren = [];
      for (let i = 0; i < schema.action_opt.renderitems.length; i++) {
        let btnconfig = { ...schema.action_opt.renderitems[i],  targetObj: record}
        actChildren.push(warpComponentBySchema(btnconfig, props))
      }
      return (<span>
        { actChildren }
      </span>)
    };
  }
  return <QueryTable {...props} pageConfig={schema} opt={opt} />
}

function getSampleConfig() {
  return {
    component_type: 'QuertTable',
    queryType: 'coreUserCustomer',
    action_opt: {
      title: '操作',
      fixed: 'right',
      width: '80',
      key: 'action',
      renderitems: [
        {
          title: '查看',
          icon: 'eye-o',
          action: {
            type: 'link',
            path: '/customer/info/',
            params: ['id']
          }
        },
        {
          title: '编辑',
          icon: 'edit',
          action: {
            type: 'link',
            path: '/customer/update/',
            params: ['id']
          }
        }
      ]
    },
  };
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;