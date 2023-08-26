import request from '../request'

export function login(params) {
	request({
		url: '/login',
		method: 'POST',
		data: {
			account: params.account,
			password: params.password
		},
	}).then(res => {
		params.success && params.success(res)
	}).catch(err => {
		params.fail && params.fail(err)
	})
}

export function regist(params) {
	request({
		url: '/login/register',
		method: 'POST',
		data: {
			account: params.account,
			password: params.password,
		}
	}).then(res => {
		params.success && params.success(res)
	}).catch(err => {
		params.fail && params.fail(err)
	})
}

export function forgetPassword(params) {
	console.log(1);
	request({
		url: '/login/forgetPassword',
		method: 'POST',
		data: {
			account: params.account,
			password: params.password,
		}
	}).then(res => {
		params.success && params.success(res)
	}).catch(err => {
		params.fail && params.fail(err)
	})
}
