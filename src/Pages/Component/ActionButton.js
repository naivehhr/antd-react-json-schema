import React, { Component } from 'react';
import { message, Button } from 'antd'
import { fetch } from 'Ajax';
import { handleCallback, verifyDependency } from './utils';
import { formatAmountValue } from '../../Util'

class ActionButton extends Component {
	constructor(props) {
        super(props)
    }

    onClick() {
        let config = this.props.config;
        let targetObj = this.props.config.targetObj;
        const { pageConfig } = this.props
        let staticSchema = pageConfig && pageConfig.staticSchema || null
        // format amount value
        if(staticSchema) formatAmountValue(staticSchema, targetObj)
        let locationQuery = this.props.router == null ? null : this.props.router.location.query;
        handleCallback(targetObj, locationQuery, config.action, this.props);
    }

	render() {
        let config = this.props.config;
        let conditions = config.conditions;
        if (conditions != null) {
            let mathconditions = true;
            let targetObj = config.targetObj == null ? {} : config.targetObj;
            for (let j = 0; j < conditions.length; j++) {
                mathconditions = verifyDependency(targetObj, conditions[j]);
                if (mathconditions == false) {
                break;
                }
            }
            if (mathconditions == false) {
                return null;
            }
        }
        return (
            <Button onClick={this.onClick.bind(this)} type={config.type} style={config.style}>{ config.title }</Button>
        );
	}
}

function warpComponent(schema, props) {
    //请求数据参数
    return <ActionButton
              {...props}
              config={schema}
            />;
}


/*
{
    "component_type": "ActionButton",
    "style": {
        width: "100px"
    },
    "action": {
        "type": "link",
        "url": "/core/list",
        "params"...
    }
}

{
    "component_type": "ActionButton",
    "style": {
        width: "100px"
    },
    "action": {
        "type": "ajax",
        "url": "/core/list",
        "method": "post",
        "params"...,
        "callback"...
    }
}


*/

const ComponentModule = {
    warpComponent: warpComponent
};

export default ComponentModule;