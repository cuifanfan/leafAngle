const express = require('express')
const md5 = require('blueimp-md5')

const User = require('../../models/user')

const router = express.Router()
router.get('/', (request, response) => {
  const Uid = md5(md5(request.query.account))

  User.findOne({ Uid }).then(user => response.status(200).json({
    code: 8,
    msg: '个人中心',
    data: user
  }))
})


module.exports = router