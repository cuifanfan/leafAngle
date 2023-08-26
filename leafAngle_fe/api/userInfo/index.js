import request from "../request"

export function updateUserInfo(params) {
	request({
		url: '/updateUserInfo',
		method: 'POST',
		data: {
			Uname: params.userName,
			Usex: params.userSex,
			tel: params.tel,
			email: params.email,
			password: params.password,
			account: params.account
		}
	}).then(res => {
		params.success && params.success(res)
	}).catch(err => {
		params.fail && params.fail(err)
	})
}

export function sendCode(params) {
	request({
		url: '/updateUserInfo/checkCode',
		method: 'GET',
		data: {
			account: params
		}
	}).then(() => {

	}).catch((err) => {

	})
}
