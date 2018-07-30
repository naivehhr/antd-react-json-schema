import React, { Component } from 'react'
import ReactJsonForm from "ReactJsonSchema";
import {
	message,
    Form
} from 'antd'
import { Link } from 'react-router';
import _ from 'lodash'
import { fetch } from 'Ajax';
import './taskHome.scss'

class TaskHome extends Component {
	state = {
        componentInit: false
	}

	componentDidMount() {
        this.fetchData();	
    }

    fetchData = async () => {
        const { schema } = this.props
		const { fetchSource } = schema
        let resp = await fetch(fetchSource.url, fetchSource.method);
        this.setState({
            componentInit: true,
            rawData: resp.value.allTask
        })
    }

    getTaskGroupPanels() {
		const { schema } = this.props
        let panels = [];
        let urlheaders = schema.url_header == null ? {} : schema.url_header;
        for (var i = 0; i < this.state.rawData.length; i++) {
            let rawItem = this.state.rawData[i];
            let linkpath = urlheaders[rawItem.title];
            if (linkpath == null) continue;
            panels.push(
                <Link to={linkpath.url} className="taskpanel">
                    <div className="tasktitle">{ rawItem.title }</div>
                    <div className="tasklink">{ rawItem.taskTotal }</div>
                </Link>
            )
        }
        return panels;
    }

	render() {
        if (this.state.componentInit != true) {
            return <div>loading</div>
        }
        let panels = this.getTaskGroupPanels();
		return (
			<div className="task-home-panels">
				{ panels }
			</div>
		)
	}
}

function warpComponent(schema, props) {
	return <TaskHome schema={schema} oprops={props} />
}

const ComponentModule = {
	warpComponent: warpComponent
};

export default ComponentModule;