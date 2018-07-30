/*
 * @Author					: vincent.zhang 
 * @Date					: 2017-08-17 13:41:12 
 * @overview				: 
 * @Last Modified time		: 2017-08-17 13:41:12 
 */
import React, { Component } from 'react'
import { Select } from 'antd'

const Option = Select.Option
export class Segments extends Component {
    constructor(props) {
        super(props)
    }
    handleChange(item, value) {
        item.next = value
    }
    render() {
        return <div>
            {
                this.props.list && this.props.list.length ? (() => {
                    let rows = this.props.list.map((item, k) => {
                        let nodesList = this.props.nodes || [], selected, branches

                        branches = this.props.branches
                        selected = item.next || branches && branches[0].to || nodesList && nodesList[0].key
                        item.next = selected
                        return <div key={k} className="ant-row segment-row">
                            <div className="ant-col-12">{item.name}<i style={{ float: "right", marginRight: "15px" }}>--></i></div>
                            <div className="ant-col-12"><Select defaultValue={selected} style={{ width: 120 }} onChange={this.handleChange.bind(this, item)}>{nodesList.map(item2 => {
                                return <Option key={item2.key} value={item2.key}>{item2.text || item2.key}</Option>
                            })}</Select></div>
                        </div>
                    })
                    rows.unshift(<div key={Math.random()} className="ant-row segment-header"><div className="ant-col-12">分段名称</div><div className="ant-col-12">后继节点</div></div>)
                    return rows
                })() : <p style={{ textAlign: 'center' }}>无分段</p>
            }
        </div>
    }
}