import {
    UPDATE_USER
} from 'Action/action_type'

export const updateUserInfo = (data) => {
    console.log('action----user---', data);
    return {
        type: UPDATE_USER,
        data: data,
    }
}