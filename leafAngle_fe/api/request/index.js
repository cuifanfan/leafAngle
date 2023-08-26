import {
	baseConfig
} from './baseConfig'
const messageCodes = [0, 1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12]
const successCodes = [0, 4, 5, 9, 11]

function successHandler(resolve) {
	return function(res) {
		if (typeof res.data === 'string') res.data = JSON.parse(res.data)
		let {
			msg,
			code,
			data
		} = res.data

		if (res.statusCode && res.statusCode !== 200) return uni.showToast({
			title: msg,
			icon: 'error'
		})

		resolve(data)
		if (messageCodes.includes((code))) return uni.showToast({
			title: msg,
			icon: successCodes.includes(code) ? 'success' : 'error'
		})
	}
}

function failHandler(reject) {
	return function(err) {
		return uni.showToast({
			title: err,
			icon: 'error'
		})
	}
}

const request = (options) => {
	let url = baseConfig.url + options.url || '',
		method = options.method || 'GET',
		header = options.header || {},
		data = options.data || {},
		timeout = options.timeout || baseConfig.timeout,

		filePath = options.filePath || '',
		name = options.name || ''


	// 获取token
	const token = uni.getStorageSync('token')
	if (token) header['Authorization'] = token
	// 获取用户账号状态
	const userState = uni.getStorageSync('userState')
	if (token && !userState) return uni.showToast({
		title: '该账号已被禁用',
		icon: 'error'
	})
	if (method) {
		method = method.toUpperCase()
		header['content-type'] = method === 'POST' ?
			'application/x-www-form-urlencoded' : 'application/json'
		if (filePath) delete header['content-type']
	}
	return new Promise((resolve, reject) => {
		// 封装上传文件请求
		if (filePath) return uni.uploadFile({
			url,
			filePath,
			name,
			header,
			success: successHandler(resolve),
			fail: failHandler(reject)
		})

		uni.request({
			url,
			method,
			data,
			timeout,
			header,
			success: successHandler(resolve),
			fail: failHandler(reject),
		})
	})
}
export default request
