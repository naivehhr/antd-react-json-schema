import React, { Component } from 'react';
import { Collapse, Row, Col, Modal } from 'antd';
import './colPanDisplay.scss';
import { _format } from '../../../Util'

import SERVER_URL from '../../../Ajax/Url'
const Panel = Collapse.Panel;

class CollapsePanelDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            modelSrc: null,
            title: ''
        }
    }

    showModal(src, title) {
        this.setState({ modelSrc: src, visible: true, title });
    }

    render() {
        const { schema, uiSchema, formData } = this.props;
        let num = 24 / uiSchema.options.per_line;
        return (
            <div className="collpase-panel-container">
                <Collapse bordered={false} defaultActiveKey={["1"]}>
                    <Panel header={schema.title} key="1" disabled={uiSchema.options.disabled}>
                        <Row>
                            {
                                Object.keys(schema.properties).map((_v, index) => {
                                    let weigetConfig = schema.properties[_v]
                                    let _view
                                    // console.log(weigetConfig)
                                    switch (weigetConfig.format) {
                                        case 'image':
                                            _view = (
                                                <Col span={num} style={{ display: 'flex' }}>
                                                    <div
                                                        className="single-title"
                                                        style={{
                                                            width: "30%"
                                                        }}
                                                    >
                                                        {schema.properties[_v].title}
                                                    </div>
                                                    <div
                                                        className="single-content"
                                                        style={{
                                                            width: "70%"
                                                        }}
                                                    >
                                                        <a onClick={this.showModal.bind(this, formData[_v], schema.properties[_v].title)}> 查看图片 </a>
                                                    </div>
                                                </Col>
                                            )
                                            break;
                                        case 'bank-card':
                                            _view = (
                                                <Col span={num} style={{ display: 'flex' }}>
                                                    <div
                                                        className="single-title"
                                                        style={{
                                                            width: "30%"
                                                        }}
                                                    >
                                                        {schema.properties[_v].title}
                                                    </div>
                                                    <div
                                                        className="single-content"
                                                        style={{
                                                            width: "70%"
                                                        }}
                                                    >
                                                    {
                                                        _format.formatValue(weigetConfig, formData[_v])
                                                    }
                                                    </div>
                                                </Col>
                                            )
                                            break;
                                        default:
                                            _view = (
                                                <Col span={num} style={{ display: 'flex' }}>
                                                    <div
                                                        className="single-title"
                                                        style={{
                                                            width: "30%"
                                                        }}
                                                    >
                                                        {schema.properties[_v].title}
                                                    </div>
                                                    <div
                                                        className="single-content"
                                                        style={{
                                                            width: "70%"
                                                        }}
                                                    >
                                                        {formData[_v]}
                                                    </div>
                                                </Col>
                                            )
                                    }
                                    return _view
                                })
                            }
                        </Row>
                    </Panel>
                </Collapse>
                <Modal
                    className="photo-modal"
                    title={this.state.title}
                    visible={this.state.visible}
                    onCancel={() => {
                        this.setState({ visible: false });
                    }}
                    cancelText="取消"
                >
                    < img src={this.state.modelSrc} />
                </Modal>
            </div>
        )
    }
}

export default CollapsePanelDisplay;