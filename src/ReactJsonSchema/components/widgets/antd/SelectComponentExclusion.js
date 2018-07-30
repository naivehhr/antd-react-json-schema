import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import { remapPropsToFields, transfrom } from 'Util'
import { VariableCategoryMap, VariableTypeMap, pagination } from 'Setting'
import {
    Form, Table, Input, Select, Checkbox, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal, Radio, Tabs,
} from 'antd'
import ReactJsonForm from "ReactJsonSchema";
import _ from 'lodash';

const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const transType = transfrom(VariableTypeMap)
const transCategory = transfrom(VariableCategoryMap)
import { listForScenario, getVariableList, addSubdivision } from 'Ajax'
class SelectComponentExclusion extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            view: false,
            list: [],
            formData: {
                "ysbl": {
                    "ysblLabel": 'foo',
                }
            }
        }
    }


    componentDidMount() {
        this.fetchData()

    }

    componentWillReceiveProps(props) {
        this.setState({
            value: props.value,
        })
    }

    fetchData = async () => {
        const list = (await listForScenario({ objectType: 'Subdivision' })).data
        this.setState({ list }, () => {
            // this.props.form.setFieldsValue({
            //     segments: [
            //         voidList,
            //         { name: '其他', range: 'other' }
            //     ]
            // })
        })
    }

    valueChange = value => {
        // console.log('====================================');
        // console.log(value);
        // console.log('====================================');
        // let _onChange = this.props.onChange || console.log
        // _onChange(data.target.value)
        this.setState({
            value: value
        })
    }

    onChange = (event, id) => {
        console.log('selectcomponent change', event)
        // console.log('id', id.split('.'))
        let arr = id.split('.')
        arr.shift()
        let newStr = `formData.${arr.join('.')}`
        // console.log('newStr', newStr)
        let tempObj = getText(event)
        let formData = {}
        _.set(formData, newStr, _.get(tempObj, newStr));
        this.setState(formData)
    }
    // onEnter = () => {
    //     let _onChange = this.props.onChange || console.log
    //     _onChange(this.state.value)
    //     this.setState({
    //         view: false
    //     })
    // }
    onCancel = () => {
        this.setState({
            value: this.props.value,
            view: false
        })
    }
    controlView = view => () => this.setState({ view })
    render() {
        let { view, value, list } = this.state,
            // { list = [] } = this.props,
            fmap = {},
            filterOpt = []
        list.map(elem => {
            let { data: { usage } } = elem
            if (!fmap[usage]) {
                fmap[usage] = true
                filterOpt.push({
                    tab: transCategory(usage),
                    key: usage
                })
            }
        })
        let renderRadio = ({ data: { key, type } }, i) => <Radio key={i} style={{ margin: 8, display: 'block' }} value={key} onClick={() => { this.setState({ curType: type }) }}>{`${value === key ? '（已选）' : ''}\t${key}\t[${transType(type)}]`}</Radio>
        const schema = {
            "type": "object",
            "title": "选择变量",
            "layout": "Tabs",
            "properties": {
                "ysblLabel": {
                    "orderBy": "usage",
                    "type": "boolean",
                    "tabsTitles": {
                        "衍生变量":"Derived",
                        "输入变量":"Number",
                    },
                    "enumNames": [
                        "证书",
                        "精度长度",
                        "测试评价"
                    ],
                    "enum": [
                        {
                            "id": "a96cb70d93b411e7a74c667815ab6318",
                            "data": {
                                "key": "证书",
                                "type": "Number",
                                "precision": 20,
                                "length": null,
                                "usage": "Derived",
                                "expr": "3/43"
                            }
                        },
                        {
                            "id": "ba2e42168ec311e7ba67667815ab6318",
                            "data": {
                                "key": "精度长度",
                                "type": "Number",
                                "precision": 20,
                                "length": null,
                                "usage": "Derived",
                                "expr": "11111111"
                            }
                        },
                        {
                            "id": "512d3bdc8a3811e7b02b54ee7546abff",
                            "data": {
                                "key": "测试评价",
                                "type": "String",
                                "precision": null,
                                "length": 1024,
                                "usage": "Output",
                                "expr": ""
                            }
                        },
                    ]
                },
            }
        }
        // let formData = {
        //     "ysbl": {
        //         "ysblLabel": 'foo',
        //     }
        // }
        let btn = (
            <div style={{ marginLeft: 20, paddingBottom: 20 }}>
                <Button type="button" onClick={this.cancel}>取消</Button>
                <Button style={{ marginLeft: 10 }} htmlType="submit" type="primary">确定</Button>
            </div>
        )
        return (
            <div>
                <input placeholder="选择变量" className="ant-input ant-input-lg" style={{ width: '290px', marginRight: '5px' }} disabled value={value || ''} />
                <Button onClick={this.controlView(true)}>选择</Button>
                <Modal
                    title='选择变量'
                    visible={view}
                    onCancel={this.onCancel}
                    onOk={this.onEnter}
                    footer={[]}
                >
                    <AntdForm
                        schema={schema}
                        formData={this.state.formData}
                        onSubmit={this.valueChange}
                        onChange={this.onChange}
                        children={btn}
                    />
                </Modal>
            </div>
        )
        // return <Row>
        //     <input placeholder="选择变量" className="ant-input ant-input-lg" style={{width:'290px',marginRight: '5px' }} disabled value={value || ''} />
        //     <Button onClick={this.controlView(true)}>选择变量</Button>
        //     <Modal title='选择变量' visible={view} onCancel={this.onCancel} onOk={this.onEnter}>
        //         <div style={{ position: 'absolute', bottom: 16 }}>{value ? `已选： ${value} ${transType(this.state.curType) || ''}` : '请选择变量'}</div>
        //         <RadioGroup onChange={this.valueChange} value={value} style={{ width: '100%' }}>
        //             <Tabs onChange={() => { }} type="card">
        //                 {
        //                     filterOpt.map(({ tab, key }, i) => {
        //                         return <TabPane tab={tab} key={i} style={{ height: 300, overflowY: 'scroll' }}>
        //                             {
        //                                 list.filter(({ data: { usage } }) => {
        //                                     return usage == key
        //                                 }).map(renderRadio)
        //                             }
        //                         </TabPane>
        //                     })
        //                 }
        //             </Tabs>
        //         </RadioGroup>
        //     </Modal>
        // </Row>
    }
}
const getText = (formData) => {
    // console.log('formData', formData)
    let str = JSON.stringify({ formData })
    return JSON.parse(str)
    // let values = Object.values(formData)
    // let keys = Object.keys(formData)
    // console.log('keys',keys)
    // let result = values.map((v, i) => {
    //     console.log(v)
    // })
    // return result

}
const AntdForm = Form.create({
    onFieldsChange(props, fields) {
        // console.log(fields)
        // props.dispatch({ type: 'orderAdd/changeForm', payload: {nihao: 136} });
    },

    onValuesChange(props, values) {
        // console.log(values)
    }
})(ReactJsonForm)
export default SelectComponentExclusion 
