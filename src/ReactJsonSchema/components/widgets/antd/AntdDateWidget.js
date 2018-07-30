import React from "react";
import PropTypes from "prop-types";

import { DatePicker, Form } from 'antd';
import moment from 'moment'
const FormItem = Form.Item
import { getErrorMsg } from './utils'
import { formItemLayout } from './constant'
import './style.scss'
function AntdDateWidget(props) {
  const { onChange } = props;
  const {
    id,
    value,
    readonly,
    disabled,
    autofocus,
    onBlur,
    onFocus,
    options,
    schema,
    formContext,
    registry,
    label,
    required,
    errors,
    ...inputProps
  } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue, getFieldsError, getFieldError, isFieldTouched } = props.formContext.myFormFun
  // const formItemLayout = {
  //   labelCol: { span: 3 },
  //   wrapperCol: { span: 5 }
  // };

  let _onChange = (event, dateStr) => {
    onChange && onChange(dateStr, id)
  }

  let errMsg = getErrorMsg(errors)(id)

  let validateStatus
  if (!errMsg && value) {
    validateStatus = 'success'
  } else if (errMsg) {
    validateStatus = 'error'
  }
  const { restrain, dependency } = schema

  const disabledDate = (current) => {
    // 有限依赖限制
    let result = true
    if (dependency && restrain) {
      let r = handleOperation(current, dependency)
      let r1 = handleOperation(current, restrain)
      let _d = moment(dependency.value)
      let _r = moment(restrain.value)
      if (restrain.operation == 'gt') {
        result = _d > current ? r : r1
      } else if (restrain.operation == 'lt') {
        // 取值区间了就
        if (dependency.operation == 'gt') {
          if(_d < current && current< _r) result = false
        } else {
          result = _d <= current ? r : r1
        }
      }
    } else if (dependency) {
      result = handleOperation(current, dependency) // 依赖
    } else if (restrain) {
      result = handleOperation(current, restrain) // 约束
    }
    return result
  }

  const handleOperation = (current, { operation, value }) => {
    if (!operation) {
      console.error('dependency or restrain 参数配置错误')
      return false
    } else if (operation == 'gt') {
      if (value) {
        let m = moment(value).endOf('day')
        return current && current <= m
      }
      return current && current <= moment()
    } else if (operation == 'lt') {
      if (value) {
        let m = moment(value).endOf('day')
        return current && current >= m
      }
      return current && current > moment()
    }
  }

  return (
    <FormItem
      colon={false}
      required={required}
      label={label}
      validateStatus={validateStatus}
      help={errMsg}
      className="form-item"
      {...formItemLayout}
    >
      <DatePicker
        id={id}
        disabled={readonly}
        disabledDate={disabledDate}
        style={{ width: "100%" }}
        value={value ? moment(value, 'YYYY-MM-DD') : undefined}
        onChange={_onChange} />
    </FormItem>
  )

  // return (
  //   <FormItem colon={false} label={label} {...formItemLayout}>
  //     {getFieldDecorator(id, {
  //       rules: [{ required: required, message: '不能为空' }],
  //       initialValue: value && moment(value, 'YYYY-MM-DD') || ''
  //     })(
  //       <DatePicker style={{width: "100%"}}/>
  //       )}
  //   </FormItem>
  // );
}

if (process.env.NODE_ENV !== "production") {
  AntdDateWidget.propTypes = {
    value: PropTypes.string,
  };
}






export default AntdDateWidget;
