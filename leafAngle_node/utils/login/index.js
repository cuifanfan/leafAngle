const jwt = require("jsonwebtoken")
const secretKey = "cuifan"

// 生成token
module.exports.generateToken = function (payload) {
  /**
   * @param payload {Object} token载荷
   * @param secretKey {String} token载荷
   * @param expiresIn {String} 有效时间
   */
  const token = "Bearer " + jwt.sign(payload, secretKey, { expiresIn: 60 * 60 })
  return token
}

// 验证token
module.exports.verifyToken = function (request, response, next) {
  const auth = request.headers.authorization
  if (!auth) return response.json({ code: 404, msg: '无token' })
  if (auth.slice(0, 6) !== 'Bearer') return response.json({ code: 404, msg: 'token无效' })
  const token = request.headers.authorization.split(" ")[1]
  jwt.verify(token, secretKey, function (err, decoded) {
    if (err) return response.json({ code: "404", msg: "token无效" })
    next()
  })
}

