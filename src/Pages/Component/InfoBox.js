import React, { Component } from 'react';
import { Collapse, Row, Col } from 'antd';

const Panel = Collapse.Panel;

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
                <div className="collaspe-border-box">
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

function warpComponent(config, props) {
  if (config.schema.layout == 'CollapseBorderContainer') {
    return <CollapseBorderBox schema={config.schema} />
  } else if (config.schema.layout == 'StaticContainer') {
    return <StaticContainer schema={config.schema} />
  }
  return null;
}

function getSampleConfig() {
  return {};
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;
