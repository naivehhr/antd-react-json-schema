/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-12 14:03:56
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import './style.scss';

import {
	message,
	Row,
	Col
} from 'antd'
import CollapseForm from 'Component/Schema/CollapseForm'
import {
	getCreditView,
	getCreditRecommend,
	getCreditUpdate,
	updateCredit,
} from 'Ajax'
import Container from 'Page/Container'
import UpdateComponent from 'Component/UpdateComponent'
import InfoComponent from 'Component/InfoComponent'

class CreditUpdate extends Component {
	render() {
		const { state } = this.props.location
		const { id, customerId } = state.params
		return (
			<Container {...this.props}>
				<Row className='item-title'>
					<Col span="24">
						<h1 className="title">编辑授信</h1>
					</Col>
				</Row>
				<InfoComponent
					{...this.props}
					fetchDataFun={getCreditRecommend}
					fetchDataParams={customerId}
				/>
				<UpdateComponent
					{...this.props}
					fetchDataFun={getCreditUpdate}
					fetchDataParams={id}
					pushParams={{ id: customerId }}
					submitFun={updateCredit}
					pushOnSubmit={`/customer/info`}
				/>
			</Container>
		)
	}
}
export default CreditUpdate