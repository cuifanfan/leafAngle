const express = require('express')
const router = express.Router()
const { isEmail, sendCode } = require('../../utils/checkCode')

router.get('/', (request, response) => {
  const account = request.query.account
  if (!isEmail(account)) return

  const checkCode = String(Math.floor(Math.random() * 1000000)).padEnd(6, '0')
  sendCode({
    from: '叶夹角在线测量系统<1695251128@qq.com>', to: account, subject: `验证码：${checkCode}`, code: checkCode,
    success() {
      console.log('验证码发送成功')
      return response.status(200).json({
        code: 5,

        msg: '验证码获取成功',
        data: { checkCode }
      })
    },
    fail() {
      console.log('验证码发送失败')
      response.status(200).json({
        code: 6,
        msg: '验证码获取失败'
      })
    }
  })
})

module.exports = router