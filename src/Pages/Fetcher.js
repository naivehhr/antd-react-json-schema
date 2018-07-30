import sa from 'superagent';
const SYS_HOST = '/routerserver';
export const fetchMockData = (url, method, senddata) => {
	return fetchData(SYS_HOST + url, method, senddata);
};
export const fetchData = (url, method, senddata) => {
	let promise = new Promise((resolve, reject) => {
		let endfun = function(err, res) {
			if (err !== null) {
				resolve({code: 410, msg: '网络错误', value: null});
			} else {
				let resp = null;
				try {
					resp = JSON.parse(res.text);
				} catch (ex) {
				}
				if (resp == null || typeof resp != 'object') {
					resolve({code: 500, msg: 'JSON解析错误', value: null});
					return;
				}
				resolve(resp);
			}
		};
		if (method != null && method.toUpperCase() === 'POST') {
			sa.post(url).send(senddata).end(endfun);
		} else {
			sa.get(url).send(senddata).end(endfun);
		}
	});
	return promise.then((resp) => {
		return resp;
	});
}

//页面layout逻辑
let GLOBAL_PAGE_CONFIG = null;
export const getUserRouterConfig = async (entity) => {
	let response = await fetchData(SYS_HOST + '/router/getUserRouterList?rid=' + entity.roleId);
	GLOBAL_PAGE_CONFIG = response.value;
	return response;
}
export const getPageRouter = () => {
	return GLOBAL_PAGE_CONFIG;
}
export const getPageConfig = async (pathname) => {
	return await fetchData(SYS_HOST + '/router/getPageConfigByPath?path=' + encodeURIComponent(pathname));
}

//权限逻辑
export const fetchRoleList = async () => {
	return await fetchData(SYS_HOST + '/router/getRoleList');
}
export const fetchRoleAccess = async (role_id) => {
	return await fetchData(SYS_HOST + '/router/getRoleAccess?rid=' + role_id);
}
export const updateRoleAccess = async (role_id, accessList) => {
	return await fetchData(SYS_HOST + '/router/updateRoleAccess?rid=' + role_id + '&config=' + encodeURIComponent(JSON.stringify(accessList)));
}

//路由配置
export const fetchRouterList = async () => {
	return await fetchData(SYS_HOST + '/router/getRouterList');
}
export const addRoute = async (query) => {
	return await fetchData(SYS_HOST + '/router/addRoute?' + query);
}
export const getRouteDetail = async (routerId) => {
	return await fetchData(SYS_HOST + '/router/getRouteDetail?id=' + routerId);
}
export const updateRouteConfig = async (routerId, config) => {
	return await fetchData(SYS_HOST + '/router/updateRouteConfig', 'post', {id: routerId, config: config});
}
export const updateRouteBase = async (data) => {
	return await fetchData(SYS_HOST + '/router/updateRoute', 'post', data);
}
