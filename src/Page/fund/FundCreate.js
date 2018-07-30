/*
 * @Author: aran.hu 
 * @Date: 2017-08-24 10:58:20 
 * @Last Modified by: aran.hu
 * @Last Modified time: 2017-09-07 19:46:35
 */


import React, { Component } from 'react'
import { getFundSchemaCoreUser, addFundCoreUser } from 'Ajax'
import Container from 'Page/Container'
import CreateComponent from 'Component/CreateComponent'

class FundCreate extends Component {
	render() {
		return (
			<Container {...this.props}>
				<CreateComponent
					{...this.props}
					fetchDataFun={getFundSchemaCoreUser}
					submitFun={addFundCoreUser}
					pushOnSubmit={'/fund/list'}
				/>
			</Container>
		)
	}
}

export default FundCreate