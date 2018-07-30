import {
  UPDATE_ROUTER
} from 'Action/action_type'
let initialState = {
  "router": {},
  "sider": {},
  "header": {}
}

export default function RouterConfig(state = initialState, action) {
  switch (action.type) {
    case UPDATE_ROUTER:
      return {
        ...state,
        ...action.data
      }
    default:
      // console.log('default action', action)
      return state;
  }
}
