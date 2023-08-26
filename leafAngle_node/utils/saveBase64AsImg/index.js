const path = require('path')
const fs = require('fs')
module.exports.saveBase64AsImg = function (baseFilePath, base64, fileName, extensionName, success) {
  // 模型文件存储路径
  const filePath = path.join(__dirname, baseFilePath + fileName + '_model' + extensionName)
  // 转为buffer对象
  const dataBuffer = Buffer.from(base64, 'base64')
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, dataBuffer)
  success && success(fileName + '_model')
}