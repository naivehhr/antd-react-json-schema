/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-07 19:46:17
 */


import React, { Component } from 'react'
import { getCreactCustomerSchema, addCustomer } from 'Ajax'
import CreateComponent from 'Component/CreateComponent'
import Container from 'Page/Container'
export default class CustomerCreate extends Component {
	render() {
		return (
			<Container  {...this.props}>
				<CreateComponent
					{...this.props}
					fetchDataFun={getCreactCustomerSchema}
					submitFun={addCustomer}
					pushOnSubmit={'/customer/list'}
				/>
			</Container>
		)
	}
}