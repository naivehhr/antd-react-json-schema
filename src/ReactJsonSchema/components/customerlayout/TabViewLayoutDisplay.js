import React, { Component } from 'react';
import { Tabs, Form } from 'antd';
import ReactJsonForm from "ReactJsonSchema";
import WrappedHorizontalLoginForm from '../Form';
import './tabViewLay.scss';

const AntdForm = Form.create()(ReactJsonForm)
const TabPane = Tabs.TabPane;

class TabViewLayoutDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }
    render() {
        let { schema, uiSchema, formData } = this.props;
        // console.log(uiSchema);
        return (
            <div className="tab-view-layout-display">
                <div className="tab-view-title">{this.props.schema.title}</div>
                <div className="tab-view-body">
                    <Tabs animated={false}>
                        {
                            Object.keys(schema.properties).map((_v, index) => {
                                let propArr = schema.properties[_v];
                                return (
                                    <TabPane key={index} tab={propArr.title}>
                                        {
                                            <WrappedHorizontalLoginForm
                                                schema={propArr}
                                                uiSchema={(uiSchema[_v]) ? uiSchema[_v] : {}}
                                                formData={(formData[_v]) ? formData[_v] : {}}
                                            />
                                        }
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>
                </div>
            </div>
        )
    }
}

export default TabViewLayoutDisplay;
