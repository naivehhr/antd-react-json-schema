import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'antd';
import { Link } from 'react-router';
import { warpComponentBySchema } from '../PageComponent';
import "./currentAccount.scss";

class CurrentAccount extends Component {
    getAdminInfo() {
        return <div>管理员</div>;
    }

    getCoreComponentInfo() {
        let sourceId = 'agent_check_core_company_info';
        let schema = {
            "components": [
                {
                    "component_type": "SchemaDisplay",
                    "title": "核心企业基本信息",
                    "targetObj": {
                        "id": this.props.entity.entityId
                    },
                    "source": {
                        "fetchSource": {
                            "url": "/scmserver/enterprise-web-oapi/platform/func/getByEntityId/",
                            "method": "post",
                            "params": {
                                "staticParams": {
                                    "sourceId": sourceId
                                },
                                "urlParams": [
                                    "id"
                                ]
                            }
                        }
                    },
                    "uiSchema": {
                        "business_license_info": {
                            "customer_layout": "CollapsePanelDisplay",
                            "options": {
                                "per_line": 2,
                                "disabled": false
                            }
                        },
                        "bank_account_info": {
                            "customer_layout": "CollapsePanelDisplay",
                            "options": {
                                "per_line": 2,
                                "disabled": false
                            }
                        },
                        "status": {
                            "ui:widget": "hidden"
                        }
                    }
                }
            ]
        };
        let components = schema.components.map((componentConfig, index) => {
            return warpComponentBySchema(componentConfig, this.props)
        });
        return components;
    }

    getChainCompanyInfo() {
        let sourceId = 'agent_check_chain_company_info';
        let schema = {
            "components": [
                {
                    "component_type": "SchemaDisplay",
                    "title": "链属企业基本信息",
                    "targetObj": {
                        "id": this.props.entity.entityId
                    },
                    "source": {
                        "fetchSource": {
                            "url": "/scmserver/enterprise-web-oapi/platform/func/getByEntityId/",
                            "method": "post",
                            "params": {
                                "staticParams": {
                                    "sourceId": sourceId
                                },
                                "urlParams": [
                                    "id"
                                ]
                            }
                        }
                    },
                    "uiSchema": {
                        "business_license_info": {
                            "customer_layout": "CollapsePanelDisplay",
                            "options": {
                                "per_line": 2,
                                "disabled": false
                            }
                        },
                        "bank_account_info": {
                            "customer_layout": "CollapsePanelDisplay",
                            "options": {
                                "per_line": 2,
                                "disabled": false
                            }
                        },
                        "status": {
                            "ui:widget": "hidden"
                        }
                    }
                }
            ]
        };
        let components = schema.components.map((componentConfig, index) => {
            return warpComponentBySchema(componentConfig, this.props)
        });
        return components;
    }

    getIndCompanyInfo() {
        let sourceId = 'ind_check_individual_info';
        let schema = {
            "components": [
                {
                    "component_type": "SchemaDisplay",
                    "title": "链属企业基本信息",
                    "targetObj": {
                        "id": this.props.entity.entityId
                    },
                    "source": {
                        "fetchSource": {
                            "url": "/scmserver/enterprise-web-oapi/platform/func/getByEntityId/",
                            "method": "post",
                            "params": {
                                "staticParams": {
                                    "sourceId": sourceId
                                },
                                "urlParams": [
                                    "id"
                                ]
                            }
                        }
                    },
                    "uiSchema": {
                        "business_license_info": {
                            "customer_layout": "CollapsePanelDisplay",
                            "options": {
                                "per_line": 2,
                                "disabled": false
                            }
                        },
                        "bank_account_info": {
                            "customer_layout": "CollapsePanelDisplay",
                            "options": {
                                "per_line": 2,
                                "disabled": false
                            }
                        },
                        "status": {
                            "ui:widget": "hidden"
                        }
                    }
                }
            ]
        };
        let components = schema.components.map((componentConfig, index) => {
            return warpComponentBySchema(componentConfig, this.props)
        });
        return components;
    }

    render() {
        if (this.props.entity.roleId == '1') {
            return (
                <div>当前没有已认证实体</div>
            )
        }
        let roleInfo = null;
        let hasChangeLink = this.props.user.accessList.length > 1;

        let roleUI = null;
        if (this.props.entity.roleId == '2') {
            roleUI = this.getAdminInfo();
        } else if (this.props.entity.roleId == '3') {
            roleUI = this.getCoreComponentInfo();
            // roleUI = <div>11111</div>
        } else if (this.props.entity.roleId == '4') {
            roleUI = this.getChainCompanyInfo();
        } else if (this.props.entity.roleId === '5') {
            roleUI = this.getIndCompanyInfo();
        }
        return (
            <div className="current-account" style={{ backgroundColor: '#FFFFFF' }}>
                <div className="customer-title">查看账户基本信息</div>
                <div style={{ marginTop: '10px' }}>
                    {/* <span>账户信息</span> */}
                    <span style={{ fontSize: "13px" }}>当前账户: <strong style={{ fontWeight: '500', color: 'rgb(255,111,138)', marginLeft: '10px' }}>{this.props.entity.userGroupName}</strong></span>
                    {hasChangeLink ? (<Link to='/account/changeentity' style={{ marginLeft: '20px' }}>切换角色</Link>) : null}
                </div>
                {roleUI}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user.user,
        entity: state.user.entity
    }
};

CurrentAccount = connect(mapStateToProps)(CurrentAccount)
export default CurrentAccount;