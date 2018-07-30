import React, { Component } from 'react'
import { fetch } from 'Ajax'
import { warpUrlParams } from './utils'
import './infotable.scss'

class InfoTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataReady: false
		}
	}

	componentDidMount() {
	    this.fetchInfoData();
    }

    fetchInfoData = async () => {
    	let queryReq = this.props.schema.queryReq
    	let paramsdata = warpUrlParams(queryReq.fetchParams, this.props.location.query);
    	let {code, value} = await fetch(queryReq.url, queryReq.method, paramsdata);
    	let title = this.props.schema.title;
    	if (code == 200) {
    		this.setState({
    			dataReady: true,
    			schema: {title:title, ...value}
    		})
    	}
    }

	getTableUI() {
		if (this.state.schema.itemlist == null || !(this.state.schema.itemlist.length > 0)) {
			return null;
		}
		const itemlist = this.state.schema.itemlist;
		const numperline = this.state.schema.numperline;

		let linecount = parseInt((itemlist.length - 1) / numperline) + 1;
		let trlines = [];
		var j = 0;
		for (var i = 0; i < linecount; i++) {
			j = 0;
			let tdcols = [];
			for (; j < numperline; j++) {
				let index = i * numperline + j;
				let item = itemlist[index];
				if (item == null) {
					break;
				}
				tdcols.push(<td className="tlname">{item.name}</td>)
				let colspan = 1;
				if (j != numperline - 1 && itemlist[index + 1] == null) {
					colspan = (numperline - 1 - j) * 2 + 1;
				}
				tdcols.push(<td className="tlval" colSpan={colspan}>{item.value}</td>)
			}
			trlines.push(<tr>{tdcols}</tr>)
		}
		let tableclass = 'tablecol' + numperline;
		return <table className={tableclass}>
				<tbody>{trlines}</tbody>
			   </table>
	}

	render() {
		if (this.state.dataReady == false) {
			return null;
		}
		let titleUI = this.state.schema.title == null ? null : <div className="title">{this.state.schema.title}</div>;
		let descUI = this.state.schema.desc == null ? null : <div className="des">{this.state.schema.desc}</div>;
		let tableUI = this.getTableUI();
		return (
					<div className="infotable">
						{titleUI}
						{descUI}
						{tableUI}
					</div>
				)
	}
}

function warpComponent(schema, props) {
  let nprops = {...props, schema: schema}
  return <InfoTable {...nprops} />
}

function getSampleConfig() {
  return {};
}

const ComponentModule = {
  warpComponent: warpComponent,
  getSampleConfig: getSampleConfig
};

export default ComponentModule;