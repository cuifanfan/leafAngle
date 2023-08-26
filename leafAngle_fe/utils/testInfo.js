export function testTel(tel) {
	const telReg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/

	const ans = {
		msg: '输入合法',
		valid: true
	}
	if (telReg.test(tel)) return ans
	ans.valid = false
	ans.msg = '请输入格式正确的手机号'
	return ans
}

export function testEmail(email) {
	const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
	const ans = {
		msg: '输入合法',
		valid: true
	}
	if (emailReg.test(email)) return ans
	ans.valid = false
	ans.msg = '请输入格式正确的邮箱'
	return ans
}

export function testAccount(account) {
	const ans = {
		msg: '输入合法',
		valid: true
	}
	const telResult = testTel(account)
	const emailResult = testEmail(account)

	if (telResult.valid || emailResult.valid) return ans
	ans.msg = isNaN(-account) ? emailResult.msg : telResult.msg
	if (!account) ans.msg = '请输入账号'
	ans.valid = false
	return ans
}

export function testPassword(password, passwordAgain) {
	passwordAgain = passwordAgain || password
	const passwordReg = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}$/
	const ans = {
		msg: '输入合法',
		valid: true
	}
	if (password === passwordAgain && passwordReg.test(password) && passwordReg.test(passwordAgain)) return ans
	ans.valid = false
	ans.msg = password !== passwordAgain ?
		'两次输入的密码不一致' : '密码必须包含大小写字母和数字长度在6-16之间'
	if (!passwordAgain) ans.msg = '请确认密码'
	if (!password) ans.msg = '请输入密码'
	return ans
}

export function testUserName(userName) {
	const userNameReg = /^[\u4E00-\u9FA5\w]{2,8}$/
	const ans = {
		msg: '输入合法',
		valid: true
	}
	if (userNameReg.test(userName)) return ans
	ans.msg = '用户名应为长度2-8的中英文字符'
	ans.valid = false
	return ans
}

export function testCheckCode(checkCode, serverCheckCode) {
	const checkCodeReg = /^[\d]{6}$/
	const ans = {
		msg: '输入合法',
		valid: true
	}
	if (checkCodeReg.test(checkCode) && serverCheckCode === checkCode) return ans

	ans.msg = checkCode ? '验证码错误' : '请输入验证码'
	ans.valid = false
	return ans
}
