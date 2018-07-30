/*
 * @Author					: vincent.zhang 
 * @Date					: 2017-08-17 13:41:12 
 * @overview				: 
 * @Last Modified time		: 2017-08-17 13:41:12 
 */
import React, { Component } from 'react'
import { Select,Row,Col } from 'antd'

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
                    let rows = this.props.list.map(item => {
                        let nodesList = this.props.nodes || [], selected,branches

                        branches = this.props.branches
                        selected = item.next || branches && branches[0].to || nodesList && nodesList.length && nodesList[0].key
                        item.next = selected
                        return <Row className="segment-row">
                            <Col span={12}>{item.name}</Col>
                            <Col span={12}>{item.range || item.expr}</Col>
                        </Row>
                    })
                    rows.unshift(<Row className="segment-header"><Col span={12}>分段名称</Col><Col span={12}>分段详情</Col></Row>)
                    return rows
                })() : <p style={{ textAlign: 'center' }}>无分段</p>
            }
        </div>
    }
}