import React, { Component } from 'react';
import { fetch } from 'Ajax';
import { warpParams, verifyDependency } from './utils'

class ConditionsComponent extends Component {
	constructor(props) {
		super(props)
		this.state = {
            componentInit: false,
            componentError: null,
            targetObject: props.pageConfig.targetObj
		}
	}

	componentDidMount() {
        this._fetchPageSchema();
    }

    componentWillReceiveProps(nextProps) {
		if (nextProps.pageConfig.targetObj != null) {
            this.setState({
                targetObject: nextProps.pageConfig.targetObj
            }) 
        }
	}

    _fetchPageSchema = async() => {
        if (this.props.pageConfig.targetObj != null) {
            this.setState({
                componentInit: true
            })
            return;
        }
        let fetchSource = this.props.pageConfig.source;
        let locationQuery = this.props.router == null ? null : this.props.router.location.query;
        let params = warpParams(this.props.pageConfig.targetObj, locationQuery, fetchSource.params);
        let result = await fetch(fetchSource.url, fetchSource.method, params);
        if (result.code !== 200) {
            this.setState({
                componentInit: true,
                componentError: '数据请求错误'
            })
			return;
        }
        let { jsonSchema, formData} = result.value;
        this.setState({
            componentInit: true,
			targetObject: result.value
        })
    }

    getItemUIs () {
        let warpComponentBySchema = this.props.warpComponentBySchema;
        let items = this.props.pageConfig.items;
        let targetObject = this.state.targetObject;
        let itemsUI = [];
        for (var i = 0; i < items.length; i++) {
            let itemconfig = items[i];
            if (itemconfig.conditions != null) {
                let mathconditions = true;
                for (let j = 0; j < itemconfig.conditions.length; j++) {
                  mathconditions = verifyDependency(targetObject, itemconfig.conditions[j]);
                  if (mathconditions == false) {
                    break;
                  }
                }
                if (mathconditions == false) {
                  continue;
                }
            }
            itemconfig.targetObj = targetObject;
            let itemUI = warpComponentBySchema(itemconfig, this.props, warpComponentBySchema);
            if (itemUI != null) {
                itemsUI.push(itemUI);
            }
        }
        return itemsUI;
    }

	render() {
        if (this.state.componentInit == false) {
            return null;
        }
        if (this.state.componentError != null) {
            return null;
        }
        let itemsUI = this.getItemUIs();
        if (itemsUI.length == 0) return null;
        if (itemsUI.length == 1) return itemsUI[0];
        return <div> {itemsUI} </div>;
	}
}

function warpComponent(schema, props, warpComponentBySchema) {
    //请求数据参数
    return <ConditionsComponent
              {...props}
              pageConfig={schema}
              warpComponentBySchema={warpComponentBySchema}
            />;
}

const ComponentModule = {
    warpComponent: warpComponent
};

export default ComponentModule;