import React, { Component } from 'react';
import { Form } from 'antd';
import ReactJsonForm from "ReactJsonSchema";

const AntdForm = Form.create()(ReactJsonForm)

class FormAsyncDisplay extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false
        }
    }

    componentDidMount() {
        this.parseSchema()
    }

    parseSchema() {
        let { schema } = this.props;
        let _url = schema.source.fetchSource.url
        /*
            fetchData 返回jsonSchema,formData
        */

        ///////////////////////////////////////// MOCK //////////////
        let jsonSchema = {
            "title": "审批用款",
            "type": "object",
            "properties": {
                "cash_info": {
                    "title": "用款信息",
                    "type": "object",
                    "properties": {
                        "company_name": {
                            "type": "string",
                            "readonly": true,
                            "title": "用款企业名称",
                            "clippable": true,
                        },
                        "money_amount": {
                            "type": "string",
                            "readonly": true,
                            "title": "融资金额（元）",
                            "clippable": true,
                        },
                        "end_day": {
                            "type": "string",
                            "readonly": true,
                            "title": "融资到期日"
                        },
                        "total_day": {
                            "type": "string",
                            "readonly": true,
                            "title": "融资天数"
                        },
                        "rate": {
                            "type": "string",
                            "readonly": true,
                            "title": "融资利率"
                        },
                        "interest": {
                            "type": "string",
                            "readonly": true,
                            "title": "融资利息"
                        },
                        "actu_income": {
                            "type": "string",
                            "readonly": true,
                            "title": "实际到账金额"
                        },
                        "account_id": {
                            "type": "string",
                            "readonly": true,
                            "title": "放款账号"
                        }
                    }
                },
                "financing_party_info": {
                    "title": "融资方信息",
                    "type": "object",
                    "properties": {
                        "base_info": {
                            "type": "object",
                            "title": "基本信息",
                            "properties": {
                                "company_name": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "企业名称"
                                },
                                "business": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "行业"
                                },
                                "location": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "所在地"
                                },
                                "license_number": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "营业执照号码"
                                },
                                "expire_day": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "营业期限"
                                },
                                "type": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "类型"
                                },
                                "agent_name": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "代理人姓名"
                                },
                                "agent_mobile": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "代理人手机号码"
                                },
                                "agent_mail": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "代理人邮箱"
                                }
                            }
                        },
                        "license_photo": {
                            "type": "object",
                            "title": "证件照片",
                            "properties": {
                                "name": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "姓名"
                                },
                                "age": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "年龄"
                                },
                                "mobile": {
                                    "type": "string",
                                    "readonly": true,
                                    "title": "电话号码"
                                }
                            }
                        }
                    }
                }
            }
        }
        /////////////////////////////////////////////////
        let _uiSchema = {
            "cash_info": {
                "customer_layout": "TableLayout_KV",
                "options": {
                    "per_line": 2
                }
            },
            "financing_party_info": {
                "customer_layout": "TabViewLayoutDisplay"
            }
        };

        let _formData = {
            "cash_info": {
                "company_name": "山东精密股份",
                "money_amount": "1,000,000.00",
                "end_day": "2018-03-03",
                "total_day": "108天",
                "rate": "8.56%",
                "interest": "10,000.00",
                "actu_income": "990,000.00",
                "account_id": "436743243432123343"
            },
            "financing_party_info": {
                "base_info": {
                    "company_name": "北京蒙牛一部",
                    "business": "零售业",
                    "location": "北京市朝阳区",
                    "license_number": "23768908789098787",
                    "expire_day": "2012-01-01 至  2020-01-01",
                    "type": "个体工商户",
                    "agent_name": "李大宝",
                    "agent_mobile": "13552787038",
                    "agent_mail": "songninglee@126.com"
                },
                "license_photo": {
                    "name": "李哈哈",
                    "age": "99",
                    "mobile": "18888888888"
                }
            }
        }
        // if (schema.uiSchema) {
        //     _uiSchema = JSON.parse(schema.uiSchema);
        // }
        this.setState(
            {
                schema: jsonSchema,
                uiSchema: _uiSchema,
                formData: _formData,
                isReady: true
            }
        );
    }

    render() {
        if (this.state.isReady) {
            const { schema, uiSchema, formData } = this.state;
            return (
                <div>
                    <AntdForm
                        schema={schema}
                        uiSchema={uiSchema}
                        formData={formData}
                    >
                        <div></div>
                    </AntdForm>

                </div>
            )
        } else {
            return (
                <div>
                    loading......
                </div>
            )
        }
    }
}

function warpComponent(schema, props) {
    return (
        <FormAsyncDisplay schema={schema} />
    )
}

const ComponentModule = {
    warpComponent: warpComponent
};

export default ComponentModule;
