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
import './style.scss'
const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const transType = transfrom(VariableTypeMap)
const transCategory = transfrom(VariableCategoryMap)
import { listForScenario, getVariableList, addSubdivision } from 'Ajax'
import { valArrLength } from './utils'

const schemaOne = {
    "type": "object",
    "title": "选择变量",
    "layout": "Tabs",
    "groupsExclude": true,
    "properties": {
        "ysbl": {
            "title": "衍生变量",
            "type": "object",
            "layout": "Simple",
            "titleLevel": '1',
            "properties": {
                "ysblLabel": {
                    "type": "array",
                    "title": "",
                    "itemsExclude": true,
                    "items": {
                        "type": "string",
                        "enum": [
                            "foo",
                            "bar",
                            "fuzz"
                        ]
                    },
                }
            }
        },
        "chbl": {
            "title": "输出变量",
            "type": "object",
            "titleLevel": '1',
            "properties": {
                "scblLabel": {
                    "type": "array",
                    "title": "",
                    "itemsExclude": true,
                    "items": {
                        "type": "string",
                        "enum": [
                            "A",
                            "B",
                            "C"
                        ]
                    },
                }
            }
        }
    }
}
const formDataOne = {
    "ysbl": {
        "ysblLabel": ['foo'],
    }
}
const schemaTwo = {
    "type": "object",
    "title": "选择细分",
    "titleLevel": '0',
    "properties": {
        "multipleChoicesList": {
            "type": "array",
            "title": "",
            "maxLength": 2,
            "minLength": 1,
            "items": {
                "type": "string",
                "enum": [
                    "foo",
                    "bar",
                    "fuzz",
                    "qux",
                    "12312",
                    "asdf",
                    "fffs",
                    "fg222"
                ]
            },
        }
    }
}
const formDataTwo = {
    "multipleChoicesList": [
        "foo",
        "bar"
    ]
}
class SelectComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            view: false,
            list: [],
            schema: this.props.selcompFormSchema,
            formData: this.props.selcompFormData,
            uiSchema: this.props.selcompUiSchema,
            idArr: [],
            key: 'two'// 用来区分不同源
        }
    }

    componentWillMount() {
        // if (this.state.key == "one") {
        //     this.setState({ schema: schemaOne, formData: formDataOne })
        // } else {
        //     this.setState({ schema: schemaTwo, formData: formDataTwo })
        // }
    }

    componentDidMount() {
        this.fetchData()
    }

    componentWillReceiveProps(props) {
        this.setState({
            value: props.value,
            schema: props.selcompFormSchema,
            formData: props.selcompFormData
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

    onSubmit = value => {
        // console.log('value', value)
        let tagetV
        const { idArr } = this.state
        let arr = []
        if (this.state.schema && this.state.schema.groupsExclude) {
            // 组数据互斥
            if (idArr.length > 0) {
                let arr = this.state.idArr[0].split('.')
                let str = arr.slice(arr.length - 2, arr.length).join('.')
                tagetV = _.get(value, str)
            }
        } else {
            for (let item in value) {
                arr = arr.concat(value[item])
            }
            tagetV = arr.join(',')
        }
        // console.log('tagetV', tagetV)
        // 回调的onSelect 需要返回boolean为的是调用自定义验证
        let result = this.props.onSelect && this.props.onSelect(tagetV.toString(), idArr[0])
        if (result instanceof Promise) {
            result.then(data => {
                if (data) {
                    this.setState({
                        value: tagetV,
                        view: false
                    })
                }
            })
        } else {
            // default boolean
            if (result) {
                this.setState({
                    value: tagetV,
                    view: false
                })
            } else {
                this.setState({
                    value: tagetV
                })
            }
        }


    }

    onChange = (event, params) => {
        // console.log('selectcomponent change', event)
        // console.log('selectcomponent params', params)
        const { id, schema } = params
        // console.log('sc onChange id', id)
        if (!id) {
            console.log('get id error')
            return
        }
        const { minLength, maxLength } = schema
        // if (minLength || maxLength) {
        //     if (!valArrLength(Object.values(event)[0], schema)) {
        //         if (minLength && maxLength) {
        //             message.warning(`请选择${minLength}至${maxLength}项`)
        //         } else if (minLength) {
        //             message.warning(`请选择至少${minLength}项`)
        //         } else {
        //             message.warning(`请选择最多${maxLength}项`)
        //         }
        //         return
        //     }
        // }
        let arr = id.split('.')
        arr.shift()
        // console.log('arr', arr)
        let newId = arr.join('.') // 获取最根部id, 最后submit取值用
        // console.log('newId', newId) //variable.Output.OutputLabel
        let oldIdArr = this.state.idArr
        oldIdArr.push(newId)
        let newIdArr = _.uniq(oldIdArr);

        if (this.state.schema && this.state.schema.groupsExclude) {
            // let tempObj = getText(event)
            let data = {}
            let str = arr.slice(arr.length - 2, arr.length).join('.')
            _.set(data, str, _.get(event, str))
            // console.log('data', data)
            //如果仅取消托管 则不用去除无用ID 只需要控制formData即可
            _.remove(newIdArr, (n) => n != newId)
            this.setState({ formData: data, idArr: newIdArr })
        } else {
            this.setState(this.setState({ formData: event, idArr: newIdArr }))
        }
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
        let {
            view,
            value,
            list,
            schema,
            formData,
            uiSchema
         } = this.state
        // let renderRadio = ({ data: { key, type } }, i) => <Radio key={i} style={{ margin: 8, display: 'block' }} value={key} onClick={() => { this.setState({ curType: type }) }}>{`${value === key ? '（已选）' : ''}\t${key}\t[${transType(type)}]`}</Radio>
        let btn = (
            <div className="selectComponent-sub-btn" >
                <Button type="button" onClick={this.onCancel}>取消</Button>
                <Button style={{ marginLeft: 10 }} htmlType="submit" type="primary">确定</Button>
            </div>
        )
        return (
            <div className="selectComponent">
                <input id={this.props.id} placeholder={schema && schema.title || "请选择"} className="ant-input ant-input-lg" disabled value={value || ''} />
                <Button className="selectComponent-btn" onClick={this.controlView(true)}>{"选择"}</Button>
                <Modal
                    title={schema.title}
                    visible={view}
                    onCancel={this.onCancel}
                    footer={[]}
                >
                    <div className="form">
                        <AntdForm
                            schema={schema}
                            formData={formData}
                            onSubmit={this.onSubmit}
                            onChange={this.onChange}
                            children={btn}
                            uiSchema={uiSchema}
                        />
                    </div>
                </Modal>
            </div >
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
    let str = JSON.stringify({ formData })
    return JSON.parse(str)
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
export default SelectComponent 
