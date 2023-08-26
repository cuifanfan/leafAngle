import {
	testAccount,
	testPassword,
	testCheckCode
} from '@/utils/testInfo.js'

export function testLoginInfo(account, password, passwordAgain, checkCode, serverCheckCode) {
	const results = [testAccount(account), testPassword(password, passwordAgain)]
	for (const result of results) {
		if (!result.valid) {
			uni.showToast({
				title: result.msg,
				icon: 'error'
			})
			return false
		}
	}
	return true
}

export function testRegistInfo(account, password, passwordAgain, checkCode, serverCheckCode) {
	const results = [testAccount(account), testPassword(password, passwordAgain), testCheckCode(checkCode, serverCheckCode)]

	for (const result of results) {
		if (!result.valid) {
			uni.showToast({
				title: result.msg,
				icon: 'error'
			})
			return false
		}
	}
	return true
}

export const testForgetPasswordInfo = testRegistInfo
