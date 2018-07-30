import {
  SET_SYS_CONFIG
} from 'Action/action_type'


let initialState = {
  fetch: null
}


export default function SysConfig(state = initialState, action){
  switch (action.type){
    case SET_SYS_CONFIG:
    return {
        ...state,
        ...action.data 
      }
    default:
      return state;
  }
}
