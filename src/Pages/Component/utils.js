/*
 * @Author: jiankang.zhang
 */
import { Row, Col, Input, Button, message  } from 'antd';
import { post, get } from 'Ajax/method';
import { fetch } from 'Ajax';
import { browserHistory } from 'react-router'
import { showSchemaDialog } from './widget/SchemaDialog';
import _ from "lodash";
import ConfigureStore from '../../ConfigureStore'
let store = ConfigureStore()

export const _warpDataSource = (source) => {
  if (source.method == "post") {
    return post(source.url);
  }
  return get(source.url)
}

// search.hello
function getPathValues (pieces, val, format) {
  let data = {};
  if (pieces.length > 1) {
    data[pieces[0]] = getPathValues(pieces.splice(1), val, format);
  } else {
    if (format == 'number') {
      data[pieces[0]] = parseFloat(val);
    } else if (format == 'int') {
      data[pieces[0]] = parseInt(val);
    } else {
      data[pieces[0]] = val;
    }
  }
  return data;
}

export const warpUrlParams = (queryParams, urlParams) => {
	let newparams = {};
	if (queryParams == null || !(queryParams.length > 0) || urlParams == null) {
		return {};
	}
	for (var i = 0; i < queryParams.length; i++) {
      let querykey = queryParams[i];
      if (typeof querykey == 'string') {
        newparams[querykey] = urlParams[querykey];
      } else if (typeof querykey == 'object') {
        let targetkey = querykey['target_key'];
        let key =  querykey['key'];
        let keypieces = targetkey.split(".");
        let tmpparam = getPathValues(keypieces, urlParams[key]);
        for (var key in tmpparam) {
          newparams[key] = tmpparam[key];
        }
      }
    }
    return newparams;
}

export const verifyDependency = (record, conditionItem) => {
  let key = conditionItem.key;
  let relation = conditionItem.relation;
  let val = conditionItem.val;
  let valuepaths = key.split(".");
  let recordvalue = record;
  //支持通过store里面的信息来判断逻辑
  if (valuepaths[0] == "_store_") {
    let storestate = store.getState();
    valuepaths.shift();
    recordvalue = storestate;
  }
  
  do {
    let pathkey = valuepaths.shift();
    recordvalue = recordvalue[pathkey];
  } while (recordvalue != null && valuepaths.length > 0)
  

  if (relation == "=") {
    return val == recordvalue;
  } else if (relation == "!=") {
    return val != recordvalue;
  } else if (relation == ">") {
    return val > recordvalue;
  } else if (relation == ">=") {
    return val >= recordvalue;
  } else if (relation == "<") {
    return val < recordvalue;
  } else if (relation == "<=") {
    return val <= recordvalue;
  } else if (relation == "in") {
    if (val != null && typeof val != "string" && val.length > 0) {
      for (var i = 0; i < val.length; i++) {
        if (val[i] == recordvalue) {
          return true;
        }
      }
    }
    return false;
  } else if (relation == "notin") {
    if (val != null && typeof val != "string" && val.length > 0) {
      for (var i = 0; i < val.length; i++) {
        if (val[i] == recordvalue) {
          return false;
        }
      }
    }
    return true;
  }
  return true;
}

export const warpParams = (obj, urlQuery, paramConfig) => {
  let params = {};
  if (paramConfig == null) {
    return params;
  }
  if (paramConfig.staticParams != null) {
    params = paramConfig.staticParams;
  }
  if (paramConfig.urlParams != null && urlQuery != null) {
    for (var i = 0; i < paramConfig.urlParams.length; i++) {
      let item = paramConfig.urlParams[i];
      let key,targetkey;
      if (typeof item == 'string') {
        key = item;
        targetkey = item;
        if (urlQuery[key] != null) {
          params[targetkey] = urlQuery[key];
        }
      } else {
        key = item.key;
        targetkey = item['target_key'];
        let keypieces = targetkey.split(".");
        let tmpparam = getPathValues(keypieces, urlQuery[key], item.format);
        for (let key in tmpparam) {
          if (params[key] != null) {
            params[key] = _.merge(params[key], tmpparam[key])
          } else {
            params[key] = tmpparam[key];
          }
        }
      }
    }
  }
  if (paramConfig.objParams != null) {
    obj = obj == null ? {} : obj;
    for (var i = 0; i < paramConfig.objParams.length; i++) {
      let item = paramConfig.objParams[i];
      let key,targetkey;
      if (typeof item == 'string') {
        key = item;
        targetkey = item;
        if (obj[key] != null) {
          params[targetkey] = obj[key];
        }
      } else {
        key = item.key;
        targetkey = item.target_key;

        let recordvalue = obj;
        let valuepaths = key.split(".");
        //支持通过store里面的信息来判断逻辑
        if (valuepaths[0] == "_store_") {
          let storestate = store.getState();
          valuepaths.shift();
          recordvalue = storestate;
        }

        do {
          let pathkey = valuepaths.shift();
          recordvalue = recordvalue[pathkey];
        } while (recordvalue != null && valuepaths.length > 0)

        let keypieces = targetkey.split(".");
        let tmpparam = getPathValues(keypieces, recordvalue, item.format);
        for (var key in tmpparam) {
          if (params[key] != null) {
            params[key] = _.merge(params[key], tmpparam[key])
          } else {
            params[key] = tmpparam[key];
          }
        }
      }
    }
  }
  return params;
}

export const warpPath = (obj, urlQuery, pathparams) => {
  if (pathparams == null || !(pathparams.length > 0)) return "";
  let pathPieces = [];
  for (var i = 0; i < pathparams.length; i++) {
    let piececonfig = pathparams[i];
    if (piececonfig.type == 'obj') {
      let recordvalue = obj;
      let valuepaths = piececonfig.key.split(".");
      do {
        let pathkey = valuepaths.shift();
        recordvalue = recordvalue[pathkey];
      } while (recordvalue != null && valuepaths.length > 0)
      pathPieces.push(recordvalue);
    } else if (piececonfig.type == 'url') {
      pathPieces.push(urlQuery[piececonfig.key]);
    } 
  }
  return pathPieces.join("/") + "";
}

export const handleCallback = async (obj, urlQuery, config, props) => {
  if(!config) return 
  if (config.type == 'link') {
    let url = config.url;
    let params = warpParams(obj, urlQuery, config.params);
    browserHistory.push({
      pathname: url,
      query: params
    })
  } else if (config.type == 'ajax') {
    let url = config.url;
    let params = warpParams(obj, urlQuery, config.params);
    let result = await fetch(url, obj.method, params);
    if (result.code != 200) {
      message.error(result.msg);
      return;
    }
    if (typeof result.value == 'object') {
      for (var key in result.value) {
        obj[key] = result.value[key];
      }
    }
    handleCallback(obj, urlQuery, config.callback);
  } else if (config.type == 'schemadialog') {
    config.targetObj = obj;
    showSchemaDialog(config, props)
  } else if (config.type == 'reload') {
    window.location.reload();
  } else if (config.type == 'back') {
    window.history.back()
  } else if (config.type == 'outlink') {
    let url = config.url;

    //添加path信息
    let addpath = warpPath(obj, urlQuery, config.pathparams);
    url = url + addpath;
    //添加param信息s
    let addParams = warpParams(obj, urlQuery, config.params);
    let keyparams = [];
    for (var key in addParams) {
      keyparams.push(key + "=" + encodeURIComponent(addParams[key]));
    }
    if (keyparams.length > 0) {
      url = url + (url.indexOf("?") == -1 ? "?" : "&") + keyparams.join("&");
    }

    window.open(url, '_blank');
  }
}