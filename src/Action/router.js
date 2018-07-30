import {
	UPDATE_ROUTER
} from 'Action/action_type'

export const updateRouter = (data) => {
	return {
			type: UPDATE_ROUTER,
			data: data,
	}
}