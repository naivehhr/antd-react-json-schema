import React, { Component } from 'react';
import './base-info.scss';
import { Collapse, Row, Col } from 'antd';

const Panel = Collapse.Panel;
const borderBoxWidth = '645px';
const staticContainerWidth = '258px';

class CollaspePanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _uiArray: []
        }
    }

    componentDidMount() {
        let _uiArray = [];
        for (let k in this.props.schema) {
            _uiArray.push(this.props.schema[k]);
        }
        this.setState({ _uiArray });
    }

    render() {
        if (this.state._uiArray) {
            return (
                <Collapse bordered={false}>
                    {
                        this.state._uiArray.map((item, index) => {
                            let _count = item.count;
                            return (
                                <Collapse bordered={false} defaultActiveKey={['0']}>
                                    <Panel header={item.title} key={index}>
                                        <Row>
                                            {
                                                item.list ?
                                                    item.list.map((_label, index) => {
                                                        return (
                                                            <Col span={24 / _count} key={index} style={{ display: 'flex' }}>
                                                                <div className="single_label_title" style={{ width: '30%' }}>{_label.label}</div>
                                                                <div className="single_label_content" style={{ width: '70%' }}>{_label.contnet}</div>
                                                            </Col>
                                                        )
                                                    })
                                                    :
                                                    null
                                            }
                                        </Row>
                                    </Panel>
                                </Collapse>
                            )
                        })
                    }
                </Collapse>
            )
        } else {
            return null
        }
    }
}

class CollapseBorderBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _uiArr: []
        }
    }

    componentDidMount() {
        let _uiArr = [];
        for (let k in this.props.schema.properties) {
            _uiArr.push(this.props.schema.properties[k]);
        }
        this.setState({ _uiArr });
    }

    render() {
        if (this.props.schema.type === 'object' || this.state._uiArr) {
            return (
                <div className="collaspe-border-box" style={{ width: `${borderBoxWidth}` }}>
                    <div className="title-top">{this.props.schema.title}</div>
                    <CollaspePanel schema={this.props.schema.properties} />
                </div>
            )
        } else {
            console.error('type must be object');
            return null;
        }
    }
}

class StaticObjectLayout extends Component {
    render() {
        const _properties = this.props.schema.properties;
        let _propArr = [];
        for (let k in _properties) {
            _propArr.push(_properties[k]);
        }
        return (
            <div className="static-object-container">
                {
                    _propArr.map((_v, index) => {
                        console.log(_v);
                        return (
                            <div className="single-object">
                                <div className="title-and-description">
                                    {(_v.title) ? <div className="single-object-title">{_v.title}</div> : null}
                                    {(_v.description) ? <div className="single-object-description">{_v.description}</div> : null}
                                </div>
                                {
                                    _v.list.map((item, index) => {
                                        return (
                                            <Row key={index}>
                                                <Col span={12}><div className='label-title'>{item.label}</div></Col>
                                                <Col span={12}><div className="label-content">{item.content}</div></Col>
                                            </Row>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

class StaticArrayLayout extends Component {
    render() {
        const _list = this.props.schema.list;
        console.log(_list);
        return (
            <div className="static-array-container">
                {
                    _list.map((_v, index) => {
                        return (
                            <Row>
                                <Col span={12}><div className="label-title">{_v.label}</div></Col>
                                <Col span={12}><div className="label-content">{_v.content}</div></Col>
                            </Row>
                        )
                    })
                }
            </div>
        )
    }
}

function renderStaticUi(schema) {
    if (schema.layout === 'StaticObjectLayout') {
        return <StaticObjectLayout schema={schema} />
    } else if (schema.layout === 'StaticArrayLayout') {
        return <StaticArrayLayout schema={schema} />
    }
}

class StaticContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    render() {
        if (this.props.schema.type === 'object') {
            let objArr = [],
                arrArr = [];
            for (let k in this.props.schema.properties) {
                let _item = this.props.schema.properties[k];
                // console.log(this.props.schema.properties[k]);
                if (_item.type === 'object') {
                    objArr.push(_item);
                } else if (_item.type === 'array') {
                    arrArr.push(_item);
                }
                else {
                    console.error(`StaticContainer's properties' type must be object or array`);
                }
            }
            return (
                <div className="static-box">
                    {
                        this.props.title ? <div className="static-title-top">{this.props.title}</div> : null
                    }
                    {
                        objArr.map((_v, index) => {
                            return (
                                <div className="child-static-container">
                                    <div className="static-top-title">{_v.title}</div>
                                    {
                                        renderStaticUi(_v)
                                    }
                                </div>
                            )
                        })
                    }
                    {
                        arrArr.map((_v, index) => {
                            return (
                                <div className="child-static-container">
                                    <div className="static-top-title">{_v.title}</div>
                                    {
                                        renderStaticUi(_v)
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            )
        } else {
            console.error(`StaticContainer's type must be object`);
            return null;
        }
    }
}

export class BaseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    receiveData() {
        let schema = {
            title: '查看基本信息',
            type: 'object',
            properties: {
                regist_info: {
                    title: '注册信息',
                    type: 'object',
                    layout: 'CollapseBorderContainer',
                    properties: {
                        base_info: {
                            title: '基础信息',
                            type: 'array',
                            count: 3,
                            list: [
                                { label: '客户名称', contnet: '北京财富管理公司' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '注册资本', contnet: '10,000,000.00元' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' }
                            ]
                        },
                        agent_info: {
                            title: '代理人信息',
                            type: 'array',
                            count: 1,
                            list: [
                                { label: '客户名称', contnet: '北京财富管理公司' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '注册资本', contnet: '10,000,000.00元' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' }
                            ]
                        }
                    }
                },
                input_info: {
                    title: "录入信息",
                    type: 'object',
                    layout: 'CollapseBorderContainer',
                    properties: {
                        base_info: {
                            title: '基础信息',
                            type: 'array',
                            count: 2,
                            list: [
                                { label: '客户名称', contnet: '北京财富管理公司' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '注册资本', contnet: '10,000,000.00元' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' }
                            ]
                        },
                        agent_info: {
                            title: '代理人信息',
                            type: 'array',
                            count: 2,
                            list: [
                                { label: '客户名称', contnet: '北京财富管理公司' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '注册资本', contnet: '10,000,000.00元' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' }
                            ]
                        },
                        customer_relation: {
                            title: '客户关系',
                            type: 'array',
                            count: 2,
                            list: [
                                { label: '客户名称', contnet: '北京财富管理公司' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '行业类别', contnet: '个体户' },
                                { label: '注册资本', contnet: '10,000,000.00元' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' },
                                { label: '注册地址', contnet: '北京朝阳区霄云路1号' }
                            ]
                        }
                    }
                },
                credit_summary: {
                    title: null,
                    type: 'object',
                    layout: 'StaticContainer',
                    properties: {
                        credit_result: {
                            title: '信用及授信结果',
                            type: 'object',
                            layout: 'StaticObjectLayout',
                            properties: {
                                credit_score: {
                                    title: null,
                                    description: null,
                                    type: 'array',
                                    list: [
                                        { label: '信用评分', content: '92分' }
                                    ]
                                },
                                loop_quota: {
                                    title: '可循环额度',
                                    description: '（有效期至2017-08-08）',
                                    type: 'array',
                                    list: [
                                        { label: '总额度（元）', content: '1,000,000,000.00' },
                                        { label: '已用额度', content: '100,000,000.00' },
                                        { label: '剩余额度', content: '900,000,000.00' }
                                    ]
                                },
                                unloop_quota: {
                                    title: '不可循环额度',
                                    description: '（有效期至2017-08-08）',
                                    type: 'array',
                                    list: [
                                        { label: '剩余额度', content: '100,000,000.00' },
                                        { label: '剩余额度', content: '100,000,000.00' },
                                        { label: '剩余额度', content: '0.00' }
                                    ]
                                }
                            }
                        },
                        credit_recommend: {
                            title: '推荐信用及授信',
                            type: 'array',
                            layout: 'StaticArrayLayout',
                            list: [
                                { label: '信用评分', content: '92分' },
                                { label: '可循环额度', content: '300,000,000.00元' },
                                { label: '不可循环额度', content: '100,000,000.00元' }
                            ]
                        }
                    }
                },
                chase: {
                    title: '用款跟踪',
                    type: 'array',
                    layout: 'StaticListLayout',
                    list: [
                        { date: '2017-08-10', state: '正在分配资金。', order_num: '用款订单号：201708091232344' },
                        { date: '2017-08-09', state: '创建用款订单。', order_num: '用款订单号：201708091232344' }
                    ]
                }
            }
        }
        this.setState({ schema });
    }

    componentDidMount() {
        this.receiveData();
    }

    render() {
        if (this.state.schema) {
            let _obj = this.state.schema.properties;
            let collaspeArr = [],
                staticArr = [],
                staticList = [];
            for (let k in _obj) {
                if (_obj[k].layout === 'CollapseBorderContainer') {
                    collaspeArr.push(_obj[k]);
                } else if (_obj[k].layout === 'StaticContainer') {
                    staticArr.push(_obj[k]);
                } else if (_obj[k].layout === 'StaticListLayout') {

                }
                else {
                    console.error(`the property ${k}'s layout type is error`);
                }
            }
            return (
                <div className="base-info-container">
                    <div className="collaspe-contaienr-inner">
                        {
                            collaspeArr.map((_v, index) => {
                                return <CollapseBorderBox schema={_v} />
                            })
                        }
                    </div>
                    <div className="static-container-inner" style={{ width: `${staticContainerWidth}`, marginLeft: '30px' }}>
                        {
                            staticArr.map((_v, index) => {
                                return <StaticContainer schema={_v} />
                            })
                        }
                    </div>
                </div>
            )
        } else {
            return null
        }
    }
}

export default BaseInfo;
