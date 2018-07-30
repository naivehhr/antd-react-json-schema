/*
 * @Author: jiankang.zhang
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Steps, Select, Row, Col, Input, Icon, Button, DatePicker  } from 'antd';
import SimpleForm from './widget/SimpleForm';
import {fetchData} from 'Pages/Fetcher';
const MOCK_HOST = 'http://10.12.46.167:9527';
const Step = Steps.Step;

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

class StepPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stepsSchema: null,
      stepsData: null,
      stepIndex: null
    };
  }

  componentDidMount() {
    this.fetchStepsData();
    this.fetchStepsSchema();
  }

  fetchStepsData = async () => {
    // 获取表单数据，判断是否是来自于local
    let dataSource = this.props.schema.dataSource;
    if (dataSource.local == true) {
      let data = getLocalStoreStepData(dataSource.localkey);
      this.setState({
        stepsData: data == null ? {} : data.stepsData,
        stepIndex: data == null ? 0 : data.stepIndex
      });
      return;
    }
    let targetSourceUrl = warpLocationState(MOCK_HOST + dataSource.source.url, dataSource.source.params, this.props.location.query);
    let resp = await fetchData(targetSourceUrl);
    this.setState({
      stepsData: resp.data == null ? {} : resp.data,
      stepIndex: resp.data == null ? 0 : resp.data.stepindex
    });
  }

  fetchStepsSchema = async () => {
    let targetSourceUrl = MOCK_HOST + this.props.schema.stepsSchema.url;
    let resp = await fetchData(targetSourceUrl);
    this.setState({
      stepsSchema: JSON.parse(resp.data.stepform_schema)
    });
  }

  getStepsHeader = () => {
    let currentIndex = this.state.stepIndex;
    let stepsSchema = this.state.stepsSchema;
    let stepsui = [];
    for (var i = 0; i < stepsSchema.length; i++) {
      stepsui.push(<Step title={stepsSchema[i].title} description={stepsSchema[i].description} />);
    }
    return <Steps current={currentIndex}>
            {stepsui}
           </Steps>;
  }

  getStepButtons() {
    let buttons = [];
    if (this.state.stepIndex !== 0) {
      buttons.push(<Button onClick={this.viewPreStep.bind(this)} style={{margin: '0 10px 0 0'}}>上一步</Button>);
    }
    let nextlabel = this.state.stepIndex === (this.state.stepsSchema.length - 1) ? '完    成' : '下一步';
    buttons.push(<Button onClick={this.doCurrentStep.bind(this)}>{nextlabel}</Button>);
    return buttons;
  }

  viewPreStep() {
    this.setState({
      stepIndex: this.state.stepIndex - 1
    })
  }

  doCurrentStep = async () => {
    let postdata = this.refs.currentFrom.getFormData();
    for (let key in this.state.stepsData) {
      if (postdata[key] == null) {
        postdata[key] = this.state.stepsData[key];
      }
    }
    let dataSource = this.props.schema.dataSource;
    let dataStore = this.state.stepsSchema[this.state.stepIndex].dataStore;
    if (dataSource.local == true && (this.state.stepIndex != this.state.stepsSchema.length - 1)) {
      setLocalStoreStepData(dataSource.localkey, {stepsData: postdata, stepIndex: this.state.stepIndex + 1});
    } else {
      let resp = await fetchData(MOCK_HOST + addParamsToUrl(dataStore.url, postdata));
      //合并后端给的参数
      if (resp.data != null) {
        for (var key in resp.data) {
          postdata[key] = resp.data[key];
        }
      }
    }

    //如果没有完结，更新成下一步
    if (this.state.stepIndex != (this.state.stepsSchema.length - 1)) {
      let addParams = this.state.stepsSchema[this.state.stepIndex].addParams;
      if (addParams != null) {
        let location = this.props.router.location;
        let originParams = location.query == null ? {} : location.query;
        for (let i = 0; i < addParams.length; i++) {
          let key = addParams[i];
          if (postdata[key] != null) {
            originParams[key] = postdata[key];
          }
        }
        browserHistory.replace({
          pathname: location.pathname,
          query: originParams
        })
        return;
      }
      this.setState({
        stepIndex: this.state.stepIndex + 1,
        stepsData: postdata
      })
    } else {
      //清楚缓存
      if (dataSource.local == true) {
        cleanLocalStoreStepData(dataSource.localkey);
      }
      // 完成时候调走
      let nextstephandler = this.props.schema.finishRedirect;
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
  }

  render() {
    if (this.state.stepsData == null || this.state.stepsSchema == null) {
      return <div> loading ... </div>
    }
    if (this.state.stepIndex >= this.state.stepsSchema.length) {
      //如果已经完成的情况下，默认先rollback到最后一步吧.
      this.setState({
        stepIndex: this.state.stepsSchema.length - 1
      })
      return <div> loading ... </div>
    }
    let currentIndex = this.state.stepIndex;
    let currentStepSchema = this.state.stepsSchema[currentIndex].formSchema;
    let stepHeaderUI = this.getStepsHeader();
    let stepbuttons = this.getStepButtons();
    return <div>
              <div style={{backgroundColor: 'white', padding: '10px 5px'}}>{ stepHeaderUI }</div>
              <div style={{padding: 20, backgroundColor: 'white'}}>
                <div style={{width: 400, margin: '0 auto'}}>
                  <SimpleForm ref="currentFrom" dataObj={this.state.stepsData} schema={currentStepSchema} />
                </div>
                <Row style={{textAlign: 'center'}}>{stepbuttons}</Row>
              </div>
           </div>
  }
}


function warpComponent(schema, props) {
  //请求数据参数
  return <StepPage
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
