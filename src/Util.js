import { Modal } from "antd"
import _ from "lodash"

import { retrieveSchema, getDefaultFormState } from "./ReactJsonSchema/utils"
const confirm = Modal.confirm

export const remapPropsToFields = data =>
  Object.keys(data)
    .map(_ => ({ [_]: { value: data[_] } }))
    .reduce((prev, next) => ({ ...prev, ...next }), {})

export const getErrorNum = data =>
  Object.keys(data)
    .map(_ => data[_] || [])
    .map(_ => _.length)
    .reduce((a, b) => a + b, 0)

export const transfrom = map => key => map[key] || key

export const promiseConfirm = ({ title, content }) =>
  new Promise((reso, reje) => {
    confirm({
      title: title,
      content: content,
      onOk() {
        reso(true)
      },
      onCancel() {
        reso(false)
      }
    })
  })

export const endErrorsToAntdErrors = err =>
  Object.keys(err).map(_ => ({
    label: _.split(".").reduce((a, b) => a + `[${b}]`),
    errors: [err[_]]
  }))

export const makeTreeDataBase = (schema = {}) => {
  let treeData = {}
  let _schema = _.cloneDeep(schema)
  let properties = schema.properties || {}
  const makeData = (treeObject = {}, children = {}) => {
    let rootNodeKeys = Object.keys(treeObject)
    let result = {}
    for (let itemKey in treeObject) {
      if (itemKey == "setting") continue
      let item = treeObject[itemKey]
      result[itemKey] = {
        title: item.title,
        type: item.type
      }
      if (item.type == "object" || item.type == "array") {
        result[itemKey].children = makeData(item.properties)
      } else {
        // console.log('找到最后简单类型叶子节点')
      }
    }
    return result
  }
  return makeData(properties)
}

/**
 * 解析 Schema 中relation的设定 例: 三证合一
 * @param {*} schema 
 * @param {*} formData 
 * @param {*} originalSchema 
 * @example 
 * "relation": {
				"jibenitem.isUnitInput": {
					rely: { "jibenitem.is_three_certificate_unit": [true, undefined] },
					invalidHidden: true
                },
            }
 *
 * @argument relation 关键字 schema最外层object设定
 * @argument jibenitem.isUnitInput 被约束字段
 * @argument rely 约束参考字段设置
 * @argument invalidHidden 当rely中的约束字段值并未出现在true或undefined中时 字段是否隐藏
 */
export const processRely = (
  schema = {},
  formData = {},
  originalSchema = {}
) => {
  let _schema = _.cloneDeep(schema)
  _schema.relation &&
    Object.keys(_schema.relation).forEach(key => {
      let idStr = makeIdStrById(key.split("."))
      let sourceObj = _.get(_schema, idStr) //源对像
      let { rely, invalidHidden } = _schema.relation[key]
      let keys = Object.keys(rely) || [] //被关联的所有key
      let result = true // rely 是否有效
      for (let i = 0, len = keys.length; i < len && result; i++) {
        let key = keys[i], //被关联的key
          targetValue = _.get(formData, key), //被关联的值
          valueArr = rely[key] || [] //关联条件值列表
        /**
         * 是否命中rely
         * yes: result => true
         * no: result => false
         */
        if (~valueArr.indexOf(targetValue)) result = false
      }
      /**
       * 更新required约束
       */
      let idReqArr = idStr.split(".")
      let currentId = idReqArr[idReqArr.length - 1]
      let idReqStr =
        idReqArr.slice(0, idReqArr.length - 2).join(".") + ".required"
      let reqOrigArr = _.get(originalSchema, idReqStr) || []
      let reqCurrArr = _.get(_schema, idReqStr) || []
      if (result) {
        sourceObj.hidden = false
        // 恢复require为原始状态
        if (
          reqOrigArr.indexOf(currentId) != -1 &&
          reqCurrArr.indexOf(currentId) == -1
        ) {
          reqCurrArr.push(currentId)
        }
      } else {
        // debugger
        sourceObj.hidden = invalidHidden
        // 无效时要判断 invalidHidden 如果是true 去掉require 如果false 还原初始状态
        if (invalidHidden) {
          // 删除req
          _.remove(reqCurrArr, i => i == currentId)
        } else {
          // 如果原req中包含currentId则添加
          if (
            reqOrigArr.indexOf(currentId) != -1 &&
            reqCurrArr.indexOf(currentId) == -1
          ) {
            reqCurrArr.push(currentId)
          }
        }
      }
    })
  return _schema
}

/**
 * @param {id arr} idArr
 * @return idStr
 */
const makeIdStrById = idArr => {
  return `properties.${idArr.join(".properties.")}`
}

export const sleep = milliSeconds => {
  let startTime = new Date().getTime() // get the current time
  while (new Date().getTime() < startTime + milliSeconds);
}

/**
 * 根据schema配置格式化Amount数值
 * exp 倍数
 * @param {*} schema
 * @param {*} formData
 * @param {*} pathStr
 */
export const formatAmountValue = (
  schema = {},
  formData = {},
  pathStr = "",
  type = "string"
) => {
  schema.properties &&
    Object.keys(schema.properties).forEach((k, i) => {
      if (schema.properties[k].type == "object") {
        formatAmountValue(schema.properties[k], formData, k)
      } else if (schema.properties[k].type == "array") {
        formatAmountValue(
          schema.properties[k].items,
          formData,
          k,
          schema.properties[k].type
        )
      } else if (schema.properties[k].type == "number") {
        let oldV
        let newV
        if (type == "array") {
          let arr = _.get(formData, pathStr) || []
          let temStr = pathStr
          arr.forEach((item, index) => {
            pathStr = pathStr ? `${pathStr}.${index}.${k}` : k
            oldV = _.get(formData, pathStr)
            newV = oldV && oldV * Math.pow(10, schema.properties[k].exp || 0)
            _.set(formData, pathStr, newV)
            pathStr = temStr
          })
        } else {
          pathStr = pathStr ? `${pathStr}.${k}` : k
          oldV = _.get(formData, pathStr)
          newV = oldV && oldV * Math.pow(10, schema.properties[k].exp || 0)
          _.set(formData, pathStr, newV)
        }
      }
    })
}

/**
 * 转成 数字金额格式显示
 * 1,000,000
 * @param {*} num
 */
export const digitalAmountFormat = (num, schema) => {
  let result
  let _num = num + ""
  if (!num) {
    return num
  }
  if (schema.exp || schema.precision) {
    _num = digitalAmountTransformForward(schema, num)
  }
  if (_num.match(/\./g) && _num.match(/\./g).length > 1) {
    // 多次点击小小数点则不显示
    result = _toLocaleString(_num, schema.precision)
  } else if (isNaN(_num)) {
    // 非数字不能填写
    result = _num.slice(0, _num.length - 1)
  } else {
    result = _toLocaleString(_num, schema.precision)
  }
  return schema.unit ? `${result + schema.unit}` : result
}

export const _toLocaleString = (num, maximumFractionDigits = 0) => {
  let t
  let d
  let _num = num
  if (num.match(/\./g) && num.match(/\./g).length == 1) {
    t = num.slice(0, num.indexOf("."))
    d = num.slice(num.indexOf("."), num.length)
    return parseFloat(t).toLocaleString("en-US") + d
  } else if (num.match(/\./g) && num.match(/\./g).length > 1) {
    _num = parseFloat(num + "")
      .toString()
      .substring(0, num.lastIndexOf(".") + 1)
  }
  return parseFloat(_num).toLocaleString("en-US", {
    maximumFractionDigits: maximumFractionDigits
  })
}

const digitalAmountUnFormat = (num, schema) => {
  if (!num) return
  let _num = num
  if (num.match(/\./g) && num.match(/\./g).length == 1) {
    _num = (num + "").substring(
      0,
      num.indexOf(".") + 1 + (schema.precision || 2)
    )
  } else if (num.match(/\./g) && num.match(/\./g).length > 1) {
    _num = (num + "").substring(0, num.lastIndexOf("."))
  }
  let arr = _num.split("")
  _num =
    arr.length > 0 &&
    arr.reduce((p, c) => {
      if (c == "." || !isNaN(c)) {
        return p + c
      } else {
        return p
      }
    })
  return _num
}
/**
 * 后台数据转换到前台显示
 * @param schema.value 数值
 * @param schema.precision 精度
 * @param schema.exp 比值(数据除以exp展示)
 */
const digitalAmountTransformForward = (schema, value) => {
  // 先按照比率及精度转换成相应单位的数值
  const { exp = 0, precision = 0 } = schema
  let _value = (parseFloat(value) / Math.pow(10, exp)).toFixed(precision)
  // console.log('后转前的值', _value)
  return _value
}

/**
 * 前台显示数据转换给后台传递
 * @param schema.value 数值
 * @param schema.precision 精度
 * @param schema.exp 比值(数据除以exp展示)
 */
const digitalAmountTransformReverse = (schema, value) => {
  // 先按照比率及精度转换成相应单位的数值
  const { exp = 0, precision = 0 } = schema
  let _value = (value * Math.pow(10, exp)).toFixed(precision)
  // console.log('前转后的值', _value)
  return value
}

/**
 * 银行卡格式显示
 * 1111 1111 1111 1111 111
 * @param {*} str
 */
export const cardNumberFormat = str => {
  if (isNaN(str) || str.length > 19) {
    return str.slice(0, str.length - 1).replace(/(\d{4})(?=\d)/g, "$1 ")
  }
  return !str || isNaN(str) ? str : (str + "").replace(/(\d{4})(?=\d)/g, "$1 ")
}

/**
 * 手机号格式化显示
 * 111 1111 1111
 * @param {*} str
 */
export const phoneNumberFormat = str => {
  if (isNaN(str) || str.length > 11) {
    return str
      .slice(0, str.length - 1)
      .replace(/(\d{3})(?=\d)/, "$1 ")
      .replace(/(\d{4})(?=\d)/g, "$1 ")
  }
  return !str
    ? str
    : (str + "")
        .replace(/(\d{3})(?=\d)/, "$1 ")
        .replace(/(\d{4})(?=\d)/g, "$1 ")
}

export const phoneNumberUnFormat = str => {
  return !str ? str : (str + "").replace(/ /g, "")
}

const formatValue = (schema, value) => {
  let _value
  switch (schema.format) {
    case "amount":
      _value = digitalAmountFormat(value, schema)
      break
    case "mobile-num":
      _value = phoneNumberFormat(value)
      break
    case "bank-card":
      _value = cardNumberFormat(value)
      break
    default:
      _value = value
  }
  // console.log('formatValue result', _value)
  return _value
}

const unFormatValue = (schema, value) => {
  if (!value) return ""
  let _value
  switch (schema.format) {
    case "amount":
      _value = digitalAmountUnFormat(value, schema)
      break
    case "mobile-num":
    case "bank-card":
      _value = phoneNumberUnFormat(value)
      break
    default:
      _value = value
  }
  // console.log('unFormatValue result', _value)
  return _value
}
export const _format = {
  formatValue,
  unFormatValue,
  phoneNumberFormat,
  cardNumberFormat,
  digitalAmountFormat,
  _toLocaleString
}
