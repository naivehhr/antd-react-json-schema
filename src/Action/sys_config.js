import {
  SET_SYS_CONFIG
} from 'Action/action_type'

export const setSysConfig = (data) => {
  console.log('action----SET_SYS_CONFIG---', data);
  return {
      type: SET_SYS_CONFIG,
      data: data,
  }
}