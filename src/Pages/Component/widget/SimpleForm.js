import React, { Component } from 'react';
import { Row, Col, Input, Button, DatePicker  } from 'antd';
import Moment from 'moment';

class SimpleForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formObj: this.mergeFormState(props.dataObj, props.schema)
    }
  }

  componentWillReceiveProps (nextProps) {
		this.setState({
			formObj: this.mergeFormState(nextProps.dataObj, nextProps.schema)
		})
	}

  mergeFormState(dataObj, schema) {
    for (let i = 0; i < schema.length; i++) {
      let value = dataObj[schema[i].name];
      if (schema[i].type === 'date' && value != null) {
        //TODO,修改value为moment类型
        value = Moment(value * 1000);
      }
      schema[i].value = value;
    }
    return schema;
  }

  getFormData() {
    let data = {};
    for (var i = 0; i < this.state.formObj.length; i++) {
      let item = this.state.formObj[i];
      if (item.type === 'date') {
        if (item.value != null) {
          data[item.name] = item.value.valueOf();
          data[item.name] = parseInt(data[item.name] / 1000);
        }
      } else {
        data[item.name] = item.value;
      }
    }
    return data;
  }

  //更新column字段
  handleColumnChange (index, event) {
    let formObj = this.state.formObj;
    let value = event;
		if (event.target != null) {
			value = event.target.value;
		} else if (event.format != null) {
      value = event;
    }
    formObj[index].value = value;
    this.setState({
      formObj: formObj
    });
  }

  getInputColumns() {
    let formObj = this.state.formObj;
    let inputRows = [];
    for (let i = 0; i < formObj.length; i++) {
      let formitem = formObj[i];
      let value = formitem.value;
      let readyOnly = this.props.dataObj[formitem.name] != null && formitem.changeable === false;
      let UIcons = null;
      if (formitem.type == 'string') {
        UIcons = Input;
      } else if (formitem.type == 'date') {
        UIcons = DatePicker;
      } else if (formitem.type == 'number') {
        UIcons = Input;
      }
      inputRows.push(<Row className='item-title'>
                      <Col span="8">{formitem.label}</Col>
                      <Col span="16"><UIcons disabled={readyOnly} value={this.state.formObj[i].value} onChange={this.handleColumnChange.bind(this, i)} /></Col>
                    </Row>);
    }
    return inputRows;
  }

  render() {
    let inputRows = this.getInputColumns();
    return <div>{inputRows}</div>;
  }
}

export default SimpleForm;