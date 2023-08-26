const path = require('path')
const fs = require('fs')
const md5 = require('blueimp-md5')
module.exports.uploadFile = function (baseFilePath, uploadFile, extensionName, success) {
  const tempFilePath = uploadFile.path // 临时资源路径
  const fileData = fs.readFileSync(tempFilePath) // 读取上传的临时资源
  // 根据文件内容计算hash值
  const hashName = md5(md5(fileData))
  // 根据hash值重命名文件
  const fileName = hashName.slice(0, 8)
  // 上传文件存放路径
  const filePath = path.join(__dirname, baseFilePath + fileName + extensionName)

  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, fileData) // 同步保存文件
  success && success(fileName)
}