import './branchSelect.scss'
import React, { Component } from 'react'
import { Modal, Button, Tabs, Radio, Spin, Alert } from 'antd'
import { getSubdivisionList } from 'Ajax'
import { Segments } from './segments.js'

const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane

export class BranchSelect extends Component {
    constructor(props) {
        super(props)
        this.optionMap = {}
        this.currentSegments = []
        this.state = {
            showError: false,
            errorMsg: '',
            loading: true,
            activeKey: "1",
            visible: false,
            value: '',
            params: null,
            data: null,
            currentSegments: [],
            key: Math.random(),
        }
    }

    fetchData = async () => {
        let rst = (await getSubdivisionList())
        this.setState({
            loading: false,
            data: {
                subdivisionList: rst.data
            }
        })
    }

    getOptionMap(list) {
        this.optionMap = this.optionMap || {}
        list.map(item => {
            if (!this.optionMap[item.id]) {
                this.optionMap[item.id] = item
            }
        })
    }

    radioGroupChange = e => {
        let list, item = this.optionMap[e.target.value], segments = item && item.data && item.data.segments
        list = segments || []
        this.currentSegments = list.map(item => ({ ...item }))
        this.setState({
            showError: false,
            value: e.target.value
        })
    }

    onTabChange = (activeKey) => {
        this.setState({ activeKey })
    }

    showModal = data => {
        //初始化新节点选择
        let panes = this.state.panes, selectValue = ''
        this.optionMap = {}
        this.currentSegments = []
        if (data.data && data.data.subdivision && data.branches) {
            selectValue = "preSelected"
            let branches = data.branches,
                segments = data.data.subdivision.segments || [],
                list = this.currentSegments
            branches.map(item => {
                list.push({
                    name: segments[item.segmentId].name,
                    next: item.to
                })
            })
        }
        this.setState({
            value: selectValue,
            params: data,
            activeKey: "1",
            showError: false,
            visible: true
        })
        this.fetchData()
    }

    handleOk = (e) => {
        if (!this.state.value) {
            this.setState({
                errorMsg: '至少选择一个组件',
                showError: true
            })
            return
        }
        if (!(this.currentSegments && this.currentSegments.length)) {
            this.setState({
                errorMsg: '当前细分无分段，不能使用',
                showError: true
            })
            return
        }
        this.setState({
            visible: false,
            key: Math.random(),
        })
        let selectedSubDivision = this.optionMap[this.state.value] && this.optionMap[this.state.value].data || null
        console.log(selectedSubDivision)
        if (this.state.value == "preSelected") {
            selectedSubDivision = this.state.params.data.subdivision
        }
        this.props.onChange && this.props.onChange({
            data: selectedSubDivision,
            segmentsData: this.currentSegments
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            key: Math.random()
        })
    }
    render() {
        let panes
        if (this.state.data) {
            let setValue = (list, item, branches) => {
                if(!list || !list.length || !item) return;
                let obj = {
                    disabled: true,
                    label: `(已选)${item.name}`,
                    value: 'preSelected'
                }
                list.unshift(obj)
            }

            let getPanes = (list, name, key) => {
                return {
                    title: name,
                    content: (() => {
                        let options
                        list = list || []
                        options = list.map(item => ({ label: item.data.name, value: item.id }))
                        if (this.state.params && this.state.params.data) {
                            setValue(options, this.state.params.data.subdivision, this.state.params.branches)
                        }
                        this.getOptionMap(list)
                        return (<div>
                            {<RadioGroup options={options} onChange={this.radioGroupChange} value={this.state.value} />}
                        </div>)
                    })(),
                    key: key
                }
            }

            let subdivisionList = this.state.data.subdivisionList;

            panes = [
                getPanes(subdivisionList.filter(item => item.data.type == "OneDimension"), '一维细分', 1),
                getPanes(subdivisionList.filter(item=>item.data.type=="TwoDimension"), '二维细分', 2),
                getPanes(subdivisionList.filter(item=>item.data.type=="Custom"), '自定义细分', 3)
            ]
        } else {
            panes = []
        }

        return (
            <Modal
                key={this.state.key}
                title={`编辑节点(${this.state.params && this.state.params.node.text || '未选择'})`}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
                className="branch-select"
            >
                <div className="card-container">
                    {
                        this.state.loading ? (<div className="loading">
                            <Spin />
                        </div>
                        ) : (<div>
                            <p style={{ margin: "4px 0" }}>请选择一个细分</p>
                            <Tabs
                                type="card"
                                onChange={this.onTabChange}
                                activeKey={this.state.activeKey}>
                                {panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
                            </Tabs>
                            <div className="segment-box">
                                <h4 className="segment-title">分段详情</h4>
                                <div className="segment-body">
                                    <Segments key={Math.random()} list={this.currentSegments} nodes={this.state.params.otherNodes} branches={this.state.params.branches} />
                                </div>
                            </div>
                        </div>)
                    }
                </div>
                {
                    this.state.showError ? (
                        <Alert style={{ marginTop: "20px" }} message={this.state.errorMsg} type="error" />
                    ) : ''
                }
                <div className="selected-tip">
                    <p>当前选择：
                        {
                            this.optionMap[this.state.value] ? this.optionMap[this.state.value].data.name : '未选择'
                        } {
                            //this.optionMap[this.state.value] ? <a href="javascript:;">查看</a> : ''
                        }
                    </p>
                </div>
            </Modal>
        )
    }
}