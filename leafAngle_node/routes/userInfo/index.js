const express = require('express')
const User = require('../../models/user')
const md5 = require('blueimp-md5')

const router = express.Router()

router.post('/', (request, response) => {
  const { Uname, Usex, password, tel, email, account } = request.body
  const pwd = md5(md5(password)), Uid = md5(md5(account))

  User.findOneAndUpdate({ Uid }, { $set: { Uname, Usex, pwd, email, tel } }, (err) => {
    if (err) return response.status(500).json({
      code: 10,
      mag: '修改失败'
    })
    return response.status(200).json({
      code: 9,
      msg: '修改成功'
    })
  })
})

module.exports = router 