import { getCreactCustomerSchema, addCustomer } from 'Ajax'
import { UPDATE_USER } from 'Reducer/UserReducer'
export const Login = () => {
  console.log('check login -------');
  return (dispatch, store) => {
    
  }
}

export const updateUserInfo = (data) => {
  return dispatch => {
    return dispatch(UPDATE_USER, {customerName: 'data'})
  }
}