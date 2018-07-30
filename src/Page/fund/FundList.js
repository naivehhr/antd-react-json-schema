/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-11-15 11:40:16
 */


import React, { Component } from 'react'
import { Link, hashHistory } from 'react-router'
import moment from 'moment'
import './style.scss';

import {
	message,
	Button,
	Row,
	Col,
	Form,
	Spin
} from 'antd'
import DisplayForm from 'Component/Schema/DisplayForm'
import { getFundListCoreUser } from 'Ajax'
import Container from 'Page/Container'
import InfoComponent from 'Component/InfoComponent'
import ReactJsonForm from "ReactJsonSchema";
let buttonStyle = {
	position: 'absolute',
	top: 15,
	right: 20
}

class FundList extends Component {
	constructor() {
		super()
		this.state = {
			jsonSchema: null,
			uiSchema: null,
			loading: true
		}
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData = async () => {
		let { code, value } = await getFundListCoreUser()
		if (code == 200) {
			let { jsonSchema, listFormData, uiSchema } = value
			this.setState({ loading: false, jsonSchema: jsonSchema, listFormData, uiSchema: JSON.parse(uiSchema) })
		}
	}

	update = id => {
		// hashHistory.push(`/fund/update/${id}`)
		const { router } = this.props;
		let params = { id }
		router.push({
			pathname: `/fund/update/`,
			state: { params }
		})
	}

	render() {
		let { listFormData = [], jsonSchema, uiSchema, loading } = this.state
		return (
			<Container  {...this.props}>
				<Row className='item-title'>
					<Col span="24">
						<h1 className="title">资金管理</h1>
						<div className="btn-box">
							<Link to='/fund/create'>
								<Button icon="plus" type="primary">新建资金</Button>
							</Link>
						</div>
					</Col>
				</Row>
				{
					loading
						? <div className="loading"><Spin /></div>
						: listFormData.map(item => {
								let jsonSchemaNew = Object.assign({}, jsonSchema)
								jsonSchemaNew.title = item.name
								// console.log(jsonSchemaNew)
								jsonSchemaNew.titleLevel = "one"
								jsonSchemaNew.layout="Block"
								delete jsonSchemaNew.properties.name
								uiSchema["ui:display"] = true
								return <AntdForm
									schema={jsonSchemaNew}
									formData={item}
									uiSchema={uiSchema}
									children={<Button style={buttonStyle} onClick={this.update.bind(this, item.id)}>编辑</Button>}
								/>
							})
				}
			</Container>
		)
	}
}
const AntdForm = Form.create()(ReactJsonForm)

export default FundList