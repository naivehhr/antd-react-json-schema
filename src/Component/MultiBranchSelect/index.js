import './index.scss'
import React, { Component } from 'react'
import { Menu, Icon, Breadcrumb, Alert } from 'antd'
import { Link, hashHistory } from 'react-router'
import {
    Form, Table, Input, Select, Checkbox, Button, InputNumber, Spin, Tabs,
    DatePicker, Row, Col, message, Modal, Radio
} from 'antd'

const RadioGroup = Radio.Group
const CheckboxGroup = Checkbox.Group
const TabPane = Tabs.TabPane
const FormItem = Form.Item

import { getSubdivisionList } from 'Ajax'
import { Segments } from './segments.js'
import { promiseConfirm, transfrom } from 'Util'
import { rulesMap } from 'Setting'

const rulesType = transfrom(rulesMap)

export default class BranchSelect extends Component {
    constructor(props) {
        super(props)
        this.optionMap = {}
        this.currentSegments = []
        this.checkboxvalue = {}
        this.count = 0
        this.state = {
            view: false,
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
    handleCheckboxChange = (key, value) => {
        this.checkboxvalue[key] = value;
    }
    onTabChange = (activeKey) => {
        this.setState({ activeKey })
    }
    showModal = data => {
        //初始化新节点选择
        let panes = this.state.panes, selectValue = ''
        this.optionMap = {}
        this.currentSegments = []
        this.checkboxvalue = {}
        if (data.data && data.data.subDivision && data.branches) {
            selectValue = "preSelected"
            let branches = data.branches,
                segments = data.data.subDivision.segments || [],
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
        let valueList = []
        for (let key in this.checkboxvalue) {
            valueList = valueList.concat(this.checkboxvalue[key])
        }
        if (!valueList.length) {
            this.setState({
                errorMsg: '至少选择一个组件',
                showError: true
            })
            return
        }
        let selectedList = this.state.selectedList || [];
        selectedList = selectedList.concat(valueList.map(item => this.optionMap[item]));
        this.props.onChange(selectedList)
        this.setState({
            visible: false,
            key: Math.random(),
            selectedList
        })
    }
    handleDeleteSubDivision = async idx => {
        let { selectedList } = this.state, props = this.props, valueList
        valueList = this.props.form.getFieldValue("scores")
        if (await promiseConfirm({ title: '删除', content: `确认要删除 "${selectedList[idx].data.name}" 细分吗?` })) {
            selectedList = selectedList.filter((item, i) => i !== idx)
            valueList.splice(idx, 1);//删除
            this.props.form.setFieldsValue({
                scores: valueList
            })
            this.setState({
                selectedList
            })
            this.props.onChange(selectedList.length ? selectedList : undefined)
        }
    }
    handleCancel = (e) => {
        this.setState({
            visible: false,
            key: Math.random()
        })
    }
    controlView = () => {
        this.showModal({
            node: {},
            branches: null,//节点出发的边
            otherNodes: null,//图上其它节点
            data: null
        })
    }
    componentDidMount() {
        let props = this.props;
        if (props.initialScore) {
            let selectedList = props.initialScore.map((item, i) => ({ id: i, data: item.subdivision })), map = {}
            this.getOptionMap(selectedList);

            props.initialScore.map((item, i) => {
                item.results.map((item2, j) => {
                    map[`scores[${i}][segments][${j}][score]`] = { value: item2.score }
                    map[`scores[${i}][segments][${j}][desc]`] = { value: item2.reason }
                })
            })

            this.setState({ selectedList }, function () {
                props.form.setFields(map)
            })
            props.onChange(selectedList)
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedList != this.state.selectedList) {
            this.state.selectedList.forEach((elem, i) => {
                let trs = document.querySelectorAll(`.js-th${i}`)
                let tds = trs[0].querySelectorAll("td")
                tds[0].rowSpan = trs.length;
                tds[tds.length - 1].rowSpan = trs.length;
                for (let i = 1, len = trs.length; i < len; i++) {
                    let tds = trs[i].querySelectorAll("td")
                    tds[0].style.display = "none"
                    tds[tds.length - 1].style.display = "none"
                }
            })
        }
    }
    render() {
        let { view } = this.state
        let { value, list } = this.props
        let { getFieldDecorator } = this.props.form


        let panes
        if (this.state.data) {
            let setValue = (list, item, branches) => {
                let obj = {
                    disabled: true,
                    label: `(已选)${item.name}`,
                    value: 'preSelected'
                }
                list.unshift(obj)
            }

            let getPanes = (list, name, key) => {
                return {
                    title: name, content: (() => {
                        let options
                        list = list || []
                        options = list.map(item => ({ label: item.data.name, value: item.id }))
                        if (this.state.params && this.state.params.data) {
                            setValue(options, this.state.params.data.subDivision, this.state.params.branches)
                        }
                        this.getOptionMap(list)
                        return (<Row>
                            {<CheckboxGroup options={options} onChange={this.handleCheckboxChange.bind(this, key)} />}
                        </Row>)
                    })(),
                    key: key
                }
            }

            let subdivisionList = this.state.data.subdivisionList;

            panes = [
                getPanes(this.state.data.subdivisionList.filter(item => item.data.type == "OneDimension"), '一维细分', 1),
                getPanes(this.state.data.subdivisionList.filter(item => item.data.type == "TwoDimension"), '二维细分', 2),
                getPanes(this.state.data.subdivisionList.filter(item => item.data.type == "Custom"), '自定义细分', 3)
            ]
        } else {
            panes = []
        }

        const dataSource = [];
        let dataList = this.state.selectedList
        if (dataList && dataList.length) {
            let k = 0;
            dataList.map((item, i) => {
                let segments = item.data.segments || [];
                segments.map((seg, j) => {
                    dataSource.push({
                        id: item.id,
                        idx: i,
                        key: `scores[${i}][segments][${j}]`,
                        name: item.data.name,
                        detail: seg.range,
                        segmentName: seg.name
                    })
                })
            })
        }

        const columns = [{
            title: '已添加细分',
            dataIndex: 'name',
            key: 'name',
        }, {
            title: '分段名称',
            dataIndex: 'segmentName',
            key: 'segmentName',
        }, {
            title: '分段详情/取值范围/表达式',
            dataIndex: 'detail',
            key: 'detail',
        }, {
            title: '分数',
            dataIndex: null,
            className: "input-field",
            render: data => {
                return <FormItem hasFeedback>
                    {
                        getFieldDecorator(`${data.key}[score]`, {
                            rules: [{ required: true, message: '必填' }, { pattern: rulesType("number"), message: '请输入数值' }]
                        })(<Input placeholder="数值，如+10、-10、10" />)
                    }
                </FormItem>
            }
        }, {
            title: '评分原因',
            dataIndex: '',
            className: "input-field",
            render: data => {
                return <FormItem hasFeedback>
                    {
                        getFieldDecorator(`${data.key}[desc]`, {
                            rules: [{ required: true, message: '必填' }]
                        })(<Input placeholder="文字描述" />)
                    }
                </FormItem>
            }
        }, {
            title: '操作',
            dataIndex: '',
            key: 'op',
            render: data => {
                return <Button onClick={this.handleDeleteSubDivision.bind(this, data.idx)}>删除</Button>
            }
        }];

        return <Row className="branch-select-table">
            <Button size='small' onClick={this.controlView}>添加细分</Button>
            <Table dataSource={dataSource} pagination={false} columns={columns} bordered rowClassName={(record, index) => {
                return `js-th${record.idx}`
            }} />
            <Modal
                key={this.state.key}
                title="添加细分"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                maskClosable={false}
                className="multi-branch-select">

                <Row className="card-container">
                    {
                        this.state.loading ? (<Row className="loading">
                            <Spin />
                        </Row>
                        ) : (<Row>
                            <p style={{ margin: "4px 0" }}>请选择细分</p>
                            <Tabs
                                type="card"
                                onChange={this.onTabChange}
                                activeKey={this.state.activeKey}>
                                {panes.map(pane => <TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>)}
                            </Tabs>
                        </Row>)
                    }
                </Row>
                {
                    this.state.showError ? (
                        <Alert style={{ marginTop: "20px" }} message={this.state.errorMsg} type="error" />
                    ) : ''
                }
            </Modal>
        </Row>
    }
}