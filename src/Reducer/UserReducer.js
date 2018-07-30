const updateUserState = (state, action) => {
  if (action.type == 'LOGIN_USER') {
      return {...state, user: action.user, entity: null};
  }
  if (action.type == 'CHANGE_ENTITY') {
      return {...state, entity: action.entity};
  }
  if (action.type == 'INIT_USER_STATE') {
      return {...state, user: action.user, entity: action.entity};
  }
  return {...state};
}
export default updateUserState;