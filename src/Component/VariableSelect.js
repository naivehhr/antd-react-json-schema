import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import { remapPropsToFields, transfrom } from 'Util'
import { VariableCategoryMap, VariableTypeMap, pagination } from 'Setting'
import {
    Form, Table, Input, Select, Checkbox, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal, Radio, Tabs,
} from 'antd'

const TabPane = Tabs.TabPane
const RadioGroup = Radio.Group
const transType = transfrom(VariableTypeMap)
const transCategory = transfrom(VariableCategoryMap)

export default class VariableSelect extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: this.props.value,
            view: false,
        }
    }
    componentWillReceiveProps(props) {
        this.setState({
            value: props.value,
        })
    }
    valueChange = data => {
        //console.log(data.target.value)
        // let _onChange = this.props.onChange || console.log
        // _onChange(data.target.value)
        this.setState({
            value: data.target.value
        })
    }
    onEnter = () => {
        let _onChange = this.props.onChange || console.log
        _onChange(this.state.value)
        this.setState({
            view: false
        })
    }
    onCancel = () => {
        this.setState({
            value: this.props.value,
            view: false
        })
    }
    controlView = view => () => this.setState({ view })
    render() {
        let { view, value } = this.state,
            { list = [] } = this.props,
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
        return <Row>
            <input placeholder="选择变量" className="ant-input ant-input-lg" disabled value={value || ''} />
            <Button onClick={this.controlView(true)}>选择</Button>
            <Modal title='选择变量' visible={view} onCancel={this.onCancel} onOk={this.onEnter}>
                <div style={{ position: 'absolute', bottom: 16 }}>{value ? `已选： ${value} ${transType(this.state.curType) || ''}` : '请选择变量'}</div>
                <RadioGroup onChange={this.valueChange} value={value} style={{ width: '100%' }}>
                    <Tabs onChange={() => { }} type="card">
                        {
                            filterOpt.map(({ tab, key }, i) => {
                                return <TabPane tab={tab} key={i} style={{ height: 300, overflowY: 'scroll' }}>
                                    {
                                        list.filter(({ data: { usage } }) => {
                                            return usage == key
                                        }).map(renderRadio)
                                    }
                                </TabPane>
                            })
                        }
                    </Tabs>
                </RadioGroup>
            </Modal>
        </Row>
    }
}