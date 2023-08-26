import request from "../request"

export function getUserInfo(params) {
	request({
		url: '/user',
		method: 'GET',
		data: params
	}).then(res => {
		params.success && params.success(res)
	}).catch(err => {
		params.fail && params.fail(err)
	})
}
