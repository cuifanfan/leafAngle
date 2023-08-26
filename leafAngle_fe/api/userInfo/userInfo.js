import {
	testTel,
	testEmail,
	testPassword,
	testUserName,
	testCheckCode
} from '@/utils/testInfo.js'

export function testUserInfo({
	userName,
	tel,
	email,
	password,
	passwordAgain,
	checkCode,
	serverCheckCode
}) {

	const results = [testUserName(userName), testTel(tel), testEmail(email), testPassword(password,
		passwordAgain)]
	if (checkCode) results.push(testCheckCode(checkCode, serverCheckCode))

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
