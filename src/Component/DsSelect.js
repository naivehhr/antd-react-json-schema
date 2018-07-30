import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Button, InputNumber, Spin,
    DatePicker, Row, Col, message, Modal, Radio
} from 'antd'

const RadioGroup = Radio.Group

export default class DsSelect extends Component {
    constructor(props) {
        super(props)
        const { buttonView = true } = this.props
        this.state = {
            view: false,
            buttonView,
            value: [...(props.value || [])]
        }
    }
    onChange = e => () => {
        // const _onChange = this.props.onChange || console.log
        // const _validatorChange = this.props.validatorChange || console.log
        // if (this.props.value.filter(_ => _.data.name === e.data.name).length) {
        //     const value = this.props.value.filter(_ => _.data.name !== e.data.name)
        //     _onChange(value)
        //     return null
        // }
        // if (this.props.value.length >= 2) {
        //     message.error('最多只能选择两条一维细分')
        //     return null
        // }
        // const value = [...this.props.value, e]
        // _onChange(value)
        // _validatorChange(value)
        let value
        if (this.state.value.filter(_ => _.data.name === e.data.name).length) {
            value = this.state.value.filter(_ => _.data.name !== e.data.name)
        } else {
            value = [...this.state.value, e]
        }
        if (value.length > 2) {
            message.info('最多只能选择两个')
            return null
        }
        this.setState({ value })
    }
    controlView = view => () => this.setState({ view })
    handleOk = e => {
        const _onChange = this.props.onChange || console.log
        const _validatorChange = this.props.validatorChange || console.log
        if (this.state.value.length != 2) {
            message.info('请选择两个一维细分')
            return
        }
        const { value } = this.state
        _onChange(value)
        _validatorChange(value)
        this.setState({ view: false })
    }
    render() {
        let { view, buttonView, value = [] } = this.state
        let { list = [] } = this.props, selectedValue = this.props.value || []
        return <div>
            <input placeholder="选择细分" className="ant-input ant-input-lg" style={{ width: '290px', marginRight: '5px' }} disabled value={selectedValue.map(_ => _.data.name).join(', ') || ''} />
            {buttonView ? <Button style={{ marginLeft: 25 }} size='smalll' onClick={this.controlView(true)}>选择细分</Button> : null}
            <Modal title='选择一维细分' visible={view} onCancel={this.controlView(false)} onOk={this.handleOk}>
                <div style={{ maxHeight: 240, overflowY: 'auto' }}>
                    {
                        list.map((_, i) => {
                            return <Checkbox
                                onChange={this.onChange(_)}
                                style={{ margin: 8, display: 'block' }}
                                key={i}
                                checked={value.filter(e => e.data.name === _.data.name).length}>
                                {_.data.name}
                            </Checkbox>
                        })
                    }
                </div>
            </Modal>
        </div>
    }
}