/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-07 23:11:44
 */


import React, { Component } from 'react'
import { getCustomerUpdate, updateCustomer } from 'Ajax'
import UpdateComponent from 'Component/UpdateComponent'
import Container from 'Page/Container'

class CustomerUpdate extends Component {
	render() {
		const { state } = this.props.location
		const { id} = state.params
		return (
			<Container  {...this.props}>
				<UpdateComponent
					{...this.props}
					fetchDataFun={getCustomerUpdate}
					submitFun={updateCustomer}
					fetchDataParams={id}
					pushParams={{id:id}}
					pushOnSubmit={`/customer/info`}
				/>
			</Container>
		)
	}
}

export default CustomerUpdate