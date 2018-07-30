/*
 * @Author: jiankang.zhang
 */
import React from 'react';
import { post, get } from 'Ajax/method';
import 'Page/customer/style.scss';
import AccessSet from './Component/AccessSet';
import CreateComponentWarp from './Component/CreateComponent';
import ItemTitleWarp from './Component/ItemTitle';
import QuertTableWarp from './Component/QuertTable';
import StepForm from './Component/StepForm';
import StepPage from './Component/StepPage';
import StepsHeader from './Component/StepsHeader';
import InfoTable from './Component/InfoTable';
import UpdateComponentWarp from './Component/UpdateComponent';
import PageForm from './Component/PageForm';
import LayoutComponent from './Component/LayoutComponent';
import InfoBox from './Component/InfoBox';
import SchemaDisplay from './Component/SchemaDisplay';
import SchemaForm from './Component/SchemaForm';
import TabViewComponent from './Component/TabViewComponent';
import ActionButton from './Component/ActionButton';
import ConditionsComponent from './Component/ConditionsComponent';
import SubmitState from './Component/SubmitState';
import FilterComponent from './Component/FilterComponent';
import EntityManage from './Component/EntityManage';
import Task from './Component/TaskPanel'
const WarpModuleMap = {
  'ItemTitle': ItemTitleWarp,
  'QuertTable': QuertTableWarp,
  // 'CreateComponent': CreateComponentWarp, -》目前 SchemaForm 可以支持
  // 'UpdateComponent': UpdateComponentWarp, -》目前 SchemaForm 可以支持
  'StepsHeader': StepsHeader,
  'StepForm': StepForm,
  'StepPage': StepPage,
  'AccessSet': AccessSet,
  // 'InfoTable': InfoTable, -》目前 SchemaDisplay 可以支持
  'PageForm': PageForm,
  'LayoutComponent': LayoutComponent,
  // 'InfoBox': InfoBox, -》目前 SchemaDisplay 可以支持
  'SchemaDisplay': SchemaDisplay,
  'SchemaForm': SchemaForm,
  'ActionButton': ActionButton,
  'TabViewComponent': TabViewComponent,  //异步显示组件的TabView（纯显示）
  'ConditionsComponent': ConditionsComponent,
  'SubmitState': SubmitState,  //提交成功（失败）页面
  'FilterComponent': FilterComponent,
  'EntityManage': EntityManage,
  'Task': Task
}

//根据组件的schema，生成组件
export const warpComponentBySchema = (schema, props) => {
  // console.log(props);
  let warpModule = WarpModuleMap[schema.component_type];
  if (warpModule == null || warpModule.warpComponent == null) return null;
  return warpModule.warpComponent(schema, props, warpComponentBySchema);
}

//根据需要的组件，生成样例demo
export const getDemoComponentConfig = (component_type) => {
  let warpModule = WarpModuleMap[component_type];
  if (warpModule == null || warpModule.warpComponent == null) return null;
  return warpModule.getSampleConfig();
}
