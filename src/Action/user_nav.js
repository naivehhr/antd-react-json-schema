import {
    UPDATE_NAV
} from 'Action/action_type'

export const updateNav = (data) => {
    return {
        type: UPDATE_NAV,
        data: data,
    }
}