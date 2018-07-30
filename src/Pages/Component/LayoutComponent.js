import React, { Component } from 'react'
import { fetch } from 'Ajax'
import { warpUrlParams } from './utils'
import './layoutcomponent.scss'

class LayoutComponent extends Component {
	render() {
		let {schema, oprops, warpComponentBySchema} = this.props;
		let component = null;
		let styleObj = schema.style;
		if (schema.type == 'component') {
			if (schema.config == null) return null;
			component = warpComponentBySchema(schema.config, oprops, warpComponentBySchema);
			return <div className="lypanel" style={styleObj}>{component}</div>;
		}
		if (schema.type == 'horizontal' || schema.type == 'vertical') {
			let panels = schema.panels;
			let childcomponents = [];
			if (panels == null || !(panels.length > 0)) {
				return null;
			}
			for (var i = 0; i < panels.length; i++) {
				childcomponents.push(<LayoutComponent schema={panels[i]} oprops={oprops} warpComponentBySchema={warpComponentBySchema} />)
			}
			let className = schema.type == 'horizontal' ? 'layoutpanel_horizontal' : 'layoutpanel_vertical';
			return <div className="lypanel" style={styleObj}><div className={className}>{component}{childcomponents}</div></div>;
		}
		return null;
	}
}

function warpComponent(schema, props, warpComponentBySchema) {
  return <LayoutComponent schema={schema.config} oprops={props} warpComponentBySchema={warpComponentBySchema} />
}

function getSampleConfig() {
  return {
    component_type: 'LayoutComponent',
    config: {
	  	type: 'horizontal',
		panels: [
			{
				type: 'vertical',
				style: {
					flex: 1
				},
				panels: [
					{
						type: 'component',
						config: {}
					},{
						type: 'component',
						config: {}
					}
				]
			},
			{
				type: 'component',
				config: {}
			}
		]
	}
  };
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;