import request from '../request'
export function sendCode(params) {
	console.log(1);
	request({
		url: '/checkCode',
		method: 'GET',
		data: {
			account: params.account
		}
	}).then((res) => {
		params.success && params.success(res)
	}).catch((err) => {
		params.fail && params.fail(err)
	})
}

export function sendCheckCode(testResults, params, callback) {
	/**
	 * @param testResults {Array[Boolean]} 验证条件
	 * @param params {Object} 请求配置参数，见sendCode方法
	 * @param callback {Function} 回调函数
	 */
	for (const testResult of testResults) {
		if (testResult) return
	}
	sendCode(params)
	callback && callback()
}
