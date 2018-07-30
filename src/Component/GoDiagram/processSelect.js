import './processSelect.scss'
import React, { Component } from 'react'
import { Modal, Button, Tabs, Radio, Spin, Alert } from 'antd'
import { getScorecardList, getGrantcardList } from 'Ajax'

const RadioGroup = Radio.Group
const TabPane = Tabs.TabPane

export class ProcessSelect extends Component {
    constructor(props) {
        super(props)
        this.optionMap = {}
        this.state = {
            showError: false,
            errorMsg: '',
            loading: true,
            activeKey: "1",
            visible: false,
            value: '',
            params: null,
            data: null
        }
    }

    fetchData = async () => {
        //var rst = (await getScorecardList())
        let [rst1, rst2] = (await Promise.all([getScorecardList(), getGrantcardList()]))
        this.setState({
            loading: false,
            data: {
                scorecardList: rst1.data,
                grantcardList: rst2.data
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
        this.setState({
            showError: false,
            value: e.target.value
        })
    }

    onTabChange = (activeKey) => {
        this.setState({ activeKey })
    }

    showModal = data => {
        let panes = this.state.panes
        this.optionMap = {}
        this.setState({
            value: '',
            params: data,
            activeKey: "1",
            showError:false,
            visible: true,
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
        this.setState({
            visible: false,
        })
        // console.log('====================================');
        // console.log(this.state.value);
        // console.log(this.optionMap);
        // console.log(this.optionMap[this.state.value]);
        // console.log('====================================');
        this.props.onChange && this.props.onChange({
            data: this.optionMap[this.state.value] || null
        })
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
        })
    }
    render() {
        let panes
        if (this.state.data) {
            let setValue = (list, item) => {
                let idx = -1
                for (let i = 0, len = list.length; i < len; i++) {
                    if (list[i].value == item.id) {
                        idx = i
                        break
                    }
                }
                if (idx != -1) {
                    let obj = list.splice(idx, 1)
                    obj[0].disabled = true
                    obj[0].label = `(已选)${obj[0].label}`;
                    list.unshift(obj[0])
                }
            }
            let getPanes = (list, name, key) => {
                return {
                    title: name, content: (() => {
                        let options

                        list = list || []
                        this.getOptionMap(list)
                        options = list.map(item => ({ label: item.data.name, value: item.id }))
                        if (this.state.params && this.state.params.data) {
                            setValue(options, this.state.params.data.components[0])
                        }
                        return (<div>
                            {<RadioGroup options={options} onChange={this.radioGroupChange} value={this.state.value} />}
                        </div>)
                    })(),
                    key: key
                }
            }
            panes = [
                getPanes(this.state.data.scorecardList, '评分卡', 1),
                getPanes(this.state.data.grantcardList, '授信策略', 2),
            ]
        } else {
            panes = []
        }

        return (
            <Modal
                title={`编辑节点(${this.state.params && this.state.params.node.text || '未选择'})`}
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
                className="process-select"
            >
                <div className="card-container">
                    {
                        this.state.loading ? (<div className="loading">
                            <Spin />
                        </div>
                        ) : (<div>
                            <p style={{margin:"4px 0"}}>请选择一个组件</p>
                            <Tabs
                                type="card"
                                onChange={this.onTabChange}
                                activeKey={this.state.activeKey}>
                                {panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
                            </Tabs>
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