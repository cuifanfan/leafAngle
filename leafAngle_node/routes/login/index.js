const express = require('express')
const md5 = require('blueimp-md5')

const User = require('../../models/user')
const { generateToken } = require('../../utils/login')
const { isEmail } = require('../../utils/checkCode')

const router = express.Router()


router.post('/', (request, response) => {
  const { account, password } = request.body
  const pwd = md5(md5(password)), Uid = md5(md5(account))
  User.findOne({ Uid }).then(user_id => {
    // 检查账号是否被注册
    if (!user_id) return response.status(200).json({
      code: 2,
      msg: '该账号未被注册',
    })

    // 检查密码是否正确
    User.findOne({ pwd }).then(user_pwd => {
      if (!user_pwd) return response.status(200).json({
        code: 3,
        msg: '密码错误',
      })

      // 成功登录
      const token = generateToken({ account, password })
      response.status(200).json({
        code: 4,
        msg: '登录成功',
        data: { token }
      })
    })
  })
})

router.post('/register', (request, response) => {
  const { account, password } = request.body
  const pwd = md5(md5(password)), Uid = md5(md5(account))
  let email = '', tel = ''

  if (isEmail(account)) email = account
  else tel = account

  User.findOne({ Uid }).then(user => {
    // 已经被注册过
    if (user) return response.status(200).json({
      code: 1,
      msg: `该${email ? '邮箱' : '手机号'}已被注册`,
    })

    new User({ tel, email, pwd, Uid }).save()
      .then(() => response.status(200).json({
        code: 0,
        msg: '注册成功'
      }))
      .catch(() => response.status(500).json({
        code: 500,
        msg: 'Server Error.'
      }))
  })
})

router.post('/forgetPassword', (request, response) => {
  const { account, password } = request.body
  const Uid = md5(md5(account)), pwd = md5(md5(password))
  // 未被注册
  User.findOne({ Uid }).then(user => {
    if (!user) return response.status(200).json({
      code: 2,
      msg: `该账号未被注册`,
    })

    User.findOneAndUpdate({ Uid }, { $set: { pwd } }, (err) => {
      if (err) return response.status(500).json({
        code: 12,
        msg: '找回密码失败'
      })

      return response.status(200).json({
        code: 11,
        msg: '找回密码成功'
      })
    })
  })
})
module.exports = router

