const nodemailer = require('nodemailer')

module.exports.sendCode = function ({ from, subject, to, success, fail, code }) {
  /**
   * @param from {String} 发件人
   * @param to {String} 收件人
   * @param subject {String} 邮件主题 
   * @param success {Function} 成功回调
   * @param fail {Function} 失败回调
   */
  const html = `<p>您好！</p>
                <p>您的验证码为：<strong style="color:orangered">${code}</strong></p>
                <p>如果不是本人操作，请忽略该邮件。</p>`
  nodemailer.createTransport({
    service: 'qq', port: 465, secure: true,
    auth: { user: '1695251128@qq.com', pass: 'azkgvylwjjmjfcge' }
  }).sendMail({ from, subject, to, html }, (err, info) => {
    if (info) return success && success(info)
    fail && fail(err)
  })
}


// 生成验证码
module.exports.isEmail = function (account) {
  return isNaN(-account)
}