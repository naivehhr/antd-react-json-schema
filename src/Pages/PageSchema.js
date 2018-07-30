/*
 * @Author: jiankang.zhang
 * @fileoverview: 模拟一部请求schema接口，其中有一些页面可能使我们后台无法配置的，那么我们就直接渲染对于的模块
 */
import RouterList from './System/RouteList';
import RouteAdd from './System/RouteAdd';
import RouteUpdate from './System/RouteUpdate';
import RoutePageSet from './System/RoutePageSet';
import ChangeEntity from './Static/EntitySelect';
// import CurrentAccount from './Static/CurrentAccount';

import { getPageConfig } from 'Pages/Fetcher';
import TaskHome from './Dissociative/TaskHome';

const HackPageSchemaMap = {
  'system/routerlist': {
    pageUI: RouterList
  },
  'system/routeradd': {
    pageUI: RouteAdd
  },
  'system/routerupdate': {
    pageUI: RouteUpdate
  },
  'system/routerpageset': {
    pageUI: RoutePageSet
  },
  'account/changeentity': {
    pageUI: ChangeEntity
  },
  // 'account/entityinfo': {
  //   pageUI: CurrentAccount
  // },
  'account/widget': {
    pageUI: TaskHome
  }
};

export const getSchemaByPath = async (pathname) => {
  let pagePathKey = pathname.replace(/^[\/]*/, '').replace(/[\/]*$/, '');
  if (HackPageSchemaMap[pagePathKey] != null) {
    return HackPageSchemaMap[pagePathKey];
  } else {
    let configResp = await getPageConfig(pathname);
    if (configResp.code == 200 && configResp.value != null && configResp.value.config != null) {
      let jsonstr = configResp.value.config.replace(/\s/g, '');
      let jsonConfig = null;
      try {
        jsonConfig = JSON.parse(jsonstr);
        if (jsonConfig != null && jsonConfig.components == null) {
          jsonConfig = null;
        }
      } catch (exp) {
        jsonConfig = null;
      }
      return jsonConfig;
    }
  }
  return null;
};