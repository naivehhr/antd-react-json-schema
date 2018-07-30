import React, { Component } from 'react';
import { fetch } from '../../Ajax';
import './entityManage.scss';

const styles = {
    entity_manage_container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
    },
    entity_manager_inner: {
        width: '75%',
        border: '1px solid rgba(242,242,242,1)',
        marginBottom: '40px'
    },
    title: {
        fontSize: '18px',
        lineHeight: '35px',
        boxSizing: 'border-box',
        padding: '10px 20px',
        backgroundColor: 'rgba(242,242,242,1)',
        position: 'relative'
    },
    plus_btn: {
        fontSize: '30px',
        color: '#0af',
        position: 'absolute',
        right: '20px',
        cursor: 'pointer'
    },
    entity_sub_list: {
        boxSizing: 'border-box',
        // padding: '10px 20px', 
    },
    sub_list_line: {
        display: 'flex',
        width: '100%',
        justifyContent: 'space-between',
        fontSize: '14px',
        lineHeight: '40px',
        padding:'5px 40px',
        borderBottem:'1px dashed rgb(245,245,245)'
    }
}

class EntityManage extends Component {
    constructor(props) {
        super(props);
        console.log(this.props.schema.jumpMap);
        this.state = {
            jsonSchema: {}
        }
    }

    _fetchPageSchema = async () => {
        let result = await fetch('/scmserver/enterprise-web-oapi/platform/func/getTaskGroup/', 'post')
        if (result.code !== 200) {
            this.setState({
                componentInit: true,
                componentError: '数据请求错误'
            })
            return;
        }
        let _result = result.value;
        this.setState({ jsonSchema: _result });
    }


    componentDidMount() {
        this._fetchPageSchema();
    }

    handleClickChange(path) {
        this.props.router.push(path);
    }

    checkClick(id, role) {
        let _str = `${this.props.schema.jumpMap[role]}?id=${id}`;
        this.props.router.push(_str);
    }

    render() {
        const { rolesMap, colorMap, links } = this.props.schema;
        const jsonSchema = this.state.jsonSchema;
        return (
            <div className="entity-manage">
                {
                    Object.keys(jsonSchema).map((_v, index) => {
                        if (jsonSchema[_v] == null)
                            return null;
                        return (
                            <div className="entity-manage-container">
                                <div className="entity-manage-inner">
                                    <div className="title">
                                        {rolesMap[_v]}
                                        <span className="plus-btn" onClick={this.handleClickChange.bind(this, links[_v])}>+</span>
                                    </div>
                                    {
                                        jsonSchema[_v].length !== 0 ?
                                            <div className="entity-sub-list">
                                                {
                                                    jsonSchema[_v].map((_single, index) => {
                                                        return (
                                                            <div className="sub-list-line">
                                                                <div style={{ display: 'flex' }}>
                                                                    <div className="company-name" style={{color:"black"}}>
                                                                        {_single.name}
                                                                    </div>
                                                                    <div className="verify-state" style={{ marginLeft: '20px', color: colorMap[_single.state], fontSize: '12px' }}>
                                                                        {_single.state}
                                                                    </div>
                                                                </div>
                                                                <div className="check-btn" style={{ alignSelf: "flex-end", color: "#0af", cursor: 'pointer' }} onClick={this.checkClick.bind(this, _single.id, _v)}>
                                                                    查看
                                                        </div>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div> :
                                            <div className="entity-sub-list-empty">
                                                暂无数据
                                            </div>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

function warpComponent(schema, props) {
    let nprops = { ...props, schema: schema }
    return <EntityManage {...nprops} />
}

const ComponentModule = {
    warpComponent: warpComponent
};


export default ComponentModule;
