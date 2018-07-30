/*
 * @Author: jiankang.zhang
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Select, Row, Col, Input, Icon, Button, DatePicker  } from 'antd';
import SimpleForm from './widget/SimpleForm';
import {fetchData} from 'Pages/Fetcher';
const MOCK_HOST = 'http://10.20.88.77:9527';

function warpLocationState(url, params, lparams) {
  if (params == null || typeof params != 'object' || !(params.length > 0)) return url;
  if (lparams == null) return url;
  let parampieces = [];
  for (var i = 0; i < params.length; i++) {
    if (lparams[params[i]] != null) {
      parampieces.push(params[i] + '=' + encodeURIComponent(lparams[params[i]]));
    }
  }
  return url + '?' + parampieces.join('&');
}

function addParamsToUrl(url, params) {
  let parampieces = [];
  for (var key in params) {
    parampieces.push(key + '=' + encodeURIComponent(params[key]));
  }
  return url + '?' + parampieces.join('&');
}

function setLocalStoreStepData(key, json) {
  var locationkey = '_STEP_STORE_CACHE_:' + key;
  window.localStorage.setItem(locationkey, JSON.stringify(json));
}
function getLocalStoreStepData(key) {
  var locationkey = '_STEP_STORE_CACHE_:' + key;
  var jsonstr = window.localStorage.getItem(locationkey);
  if (jsonstr == null) return null;
  return JSON.parse(jsonstr);
}
function cleanLocalStoreStepData(key) {
  var locationkey = '_STEP_STORE_CACHE_:' + key;
  window.localStorage.removeItem(locationkey);
}

class StepForm extends Component {
  // props.dataSource dataSource来源，本地/远程
  // props.formSchema 表单样式
  // props.dataStore 数据存储，本地/远程  
  // props.prestep 前一步
  // props.nextstep 后一步
  constructor(props) {
    super(props);
    this.state = {
      dataReady: false,
      dataError: null,
      dataStore: null,
      formSchema: null
    };
  }

  componentDidMount() {
    this.fetchCurrentData();
    this.fetchCurrentSchema();
  }

  fetchCurrentData = async () => {
    let dataSource = this.props.schema.dataSource;
    if (dataSource.local == true) {
      let data = getLocalStoreStepData(dataSource.localkey);
      if (data == null && this.props.schema.isfirststep !== true) {
        alert('没有缓存的数据，返回');
        browserHistory.replace({
          pathname: '/',
        });
        return;
      }
      this.setState({
        dataStore: data == null ? {} : data,
        dataReady: this.state.formSchema == null ? false : true
      });
      return;
    }
    let targetSourceUrl = warpLocationState(MOCK_HOST + dataSource.source.url, dataSource.source.params, this.props.location.query);
    let resp = await fetchData(targetSourceUrl);
    if (resp.errMsg != null) {
      this.setState({
        dataError: resp.errMsg
      });
    } else {
      if (resp.data == null && this.props.schema.isfirststep !== true) {
        alert('没有缓存的数据，返回');
        browserHistory.replace({
          pathname: '/',
        });
        return;
      }
      this.setState({
        dataStore: resp.data == null ? {} : resp.data,
        dataReady: this.state.formSchema == null ? false : true
      });
    }
  }

  fetchCurrentSchema = async () => {
    let targetSourceUrl = MOCK_HOST + this.props.schema.formSchema.url;
    let resp = await fetchData(targetSourceUrl);
    if (resp.errMsg != null) {
      this.setState({
        dataError: resp.errMsg
      });
    } else {
      this.setState({
        formSchema: JSON.parse(resp.data.stepform_schema),
        dataReady: this.state.dataStore == null ? false : true
      });
    }
  }

  //查看上一步使用当前form全数据里面的状态返回
  viewPreStep() {
    let prestephandler = this.props.schema.prestep;
    let precareparams = prestephandler.params;
    let preParams = {};
    if (precareparams != null && typeof precareparams == 'object' && precareparams.length > 0) {
      for (let i = 0; i < precareparams.length; i++) {
        let key = precareparams[i];
        if (this.state.dataStore[key] != null) {
          preParams[key] = this.state.dataStore[key];
        }
      }
    }
    browserHistory.push({
			pathname: prestephandler.url,
			query: preParams
		});
  }

  doCurrentStep = async () => {
    //TODO如果是存在本地的话，那么最后一步时候要清除之前的数据
    let dataStore = this.props.schema.dataStore;
    let postdata = this.refs.currentFrom.getFormData();
    for (let key in this.state.dataStore) {
      if (postdata[key] == null) {
        postdata[key] = this.state.dataStore[key];
      }
    }
    if (dataStore.local == true) {
      setLocalStoreStepData(dataStore.localkey, postdata);
    } else {
      let resp = await fetchData(MOCK_HOST + addParamsToUrl(dataStore.source.url, postdata));
      if (resp.errMsg != null) {
        alert (resp.errMsg);
        return;
      }
      if (resp.data != null) {
        for (var key in resp.data) {
          postdata[key] = resp.data[key];
        }
      }
    }
    //当是最后一步时，需要判断之前数据是否存在缓存里面，如果是那么需要删除缓存.
    if (this.props.schema.islaststep === true) {
      let dataSource = this.props.schema.dataSource;
      if (dataSource.local == true) {
        cleanLocalStoreStepData(dataSource.localkey);
      }
    }

    let nextstephandler = this.props.schema.nextstep;
    let nextParams = {};
    let nextcareparams = nextstephandler.params;
    if (nextcareparams != null && typeof nextcareparams == 'object' && nextcareparams.length > 0) {
      for (let i = 0; i < nextcareparams.length; i++) {
        let key = nextcareparams[i];
        if (postdata[key] != null) {
          nextParams[key] = postdata[key];
        }
      }
    }
    browserHistory.push({
			pathname: nextstephandler.url,
			query: nextParams
		});
  }

  getStepButtons() {
    let buttons = [];
    if (this.props.schema.isfirststep !== true) {
      buttons.push(<Button onClick={this.viewPreStep.bind(this)} style={{margin: '0 10px 0 0'}}>上一步</Button>);
    }
    let nextlabel = this.props.schema.islaststep === true ? '完    成' : '下一步';
    buttons.push(<Button onClick={this.doCurrentStep.bind(this)}>{nextlabel}</Button>);
    return buttons;
  }

  render () {
    if (this.state.dataError === false) {
      return <div> {this.state.dataError} </div>;
    }
    if (this.state.dataReady === false) {
      return <div> loading ... </div>;
    }
    let stepbuttons = this.getStepButtons();
    return  <div style={{padding: 20, backgroundColor: 'white'}}>
              <div style={{width: 400, margin: '0 auto'}}>
                <SimpleForm ref="currentFrom" dataObj={this.state.dataStore} schema={this.state.formSchema} />
              </div>
              <Row style={{textAlign: 'center'}}>{stepbuttons}</Row>
            </div>
  }
}


function warpComponent(schema, props) {
  //请求数据参数
  return <StepForm
            {...props}
            schema={schema}
          />;
}

function getSampleConfig() {
  return {};
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;