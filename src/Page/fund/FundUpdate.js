/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-12 14:11:29
 */


import React, { Component } from 'react'
import { hashHistory } from 'react-router'
import moment from 'moment'
import './style.scss';

import {
	message
} from 'antd'
import NomalForm from 'Component/Schema/NomalForm'
import { getFundUpdateCoreUser, updateFundCoreUser } from 'Ajax'
import Container from 'Page/Container'
import UpdateComponent from 'Component/UpdateComponent'

class FundUpdate extends Component {


	fetchData = async () => {
		let loading = false
		const { state } = this.props.location
		if (!state) return
		const { id } = state.params
		let result = await getFundUpdateCoreUser(id)
		let { jsonSchema, formData, uiSchema } = result.value
		this.setState({ jsonSchema: jsonSchema, formData: formData, uiSchema: JSON.parse(uiSchema) })
	}

	submit = async ({ formData }) => {
		let result = await updateFundCoreUser({ "formData": formData })
		let { code } = result
		if (code == 200) {
			message.success('更新资金信息成功');
			hashHistory.push('/fund/list')
		} else {
			message.error('更新失败');
		}
	}

	render() {
		const { state } = this.props.location
		if (!state) return <div />
		const { id } = state.params
		return (
			<Container {...this.props}>
				<UpdateComponent
					{...this.props}
					fetchDataFun={getFundUpdateCoreUser}
					submitFun={updateFundCoreUser}
					fetchDataParams={id}
					pushOnSubmit={'/fund/list'}
				/>
			</Container>
		)
	}
}
export default FundUpdate