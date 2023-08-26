const express = require('express')
const multer = require('multer')
const Request = require('request')
const path = require('path')
const { getDate } = require('../../utils/getDate')
const Corn = require('../../models/corn')

const { uploadFile } = require('../../utils/uploadFile')
const { saveBase64AsImg } = require('../../utils/saveBase64AsImg')
const md5 = require('blueimp-md5')
const { log } = require('console')
const router = express.Router()

// 模型服务地址
const baseModelUrl = 'http://localhost:3000'
// 本机存储用户上传的图像的路径
const baseUploadImgPath = "../../public/uploadImages/"
// 本机存储模型返回的图像的路径
const baseModelImgPath = '../../public/modelImages/'
// 本机用户上传的图像的网络地址
const baseUploadImgUrl = 'http://localhost:5000/uploadImg/'
// 本机模型返回的图像的网络地址
const baseModelImgurl = 'http://localhost:5000/modelImg/'
// 设置临时目录，存放上传的文件
const upload = multer({ dest: 'tempImages/' })
router.post('/uploadImg', upload.single('file'), (request, response) => {
  const file = request.file // 上传的资源 
  const extensionName = path.extname(file.originalname) // 文件扩展名
  // 接收上传的文件
  uploadFile(baseUploadImgPath, file, extensionName, (fileName) => {
    // 上传的文件在本地的网络地址
    const uploadFilePath = baseUploadImgUrl + fileName + extensionName
    const url = '/getAngle'
    // 向算法模型发起请求
    Request({
      url: baseModelUrl + url,
      method: 'POST',
      json: true,
      headers: { 'content-type': 'application/json' },
      body: { filePath: uploadFilePath }
    }, (err, rep, body) => {
      if (body) {
        // 算法模型成功返回数据
        const { leafAngle, base64 } = body
        // 保存测量结果
        // 将base64保存为本地图片 
        saveBase64AsImg(baseModelImgPath, base64, fileName,
          extensionName, (modelFileName) => {
            // 保存成功
            // 模型保存的文件地址
            const modelFilePath = baseModelImgurl + modelFileName + extensionName
            return response.status(200).json({
              code: 14,
              msg: '预测成功',
              data: {
                resultImgPath: modelFilePath,
                leafAngle: leafAngle
              }
            })
            //           const Pid = md5(md5(fileName + modelFileName)),
            //             Uip = uploadFilePath, Mip = modelFilePath,
            //             time = getDate(), angle = leafAngle


            //           new Corn({ Pid, Uip, Mip, time, angle, location, apart }).save()
            //             .then(() => {
            //               // 存储为测量记录
            //               User.findOneAndUpdate({ Uid }, { $push: { Mcorns: Pid } }, (err) => {
            // })
            //             })
          })
      }
    })
  })
})

router.post('/')

module.exports = router