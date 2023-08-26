const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const auth = require('./utils/login')

const loginRouter = require('./routes/login')
const userRouter = require('./routes/user')
const userInfoRouter = require('./routes/userInfo')
const checkCodeRouter = require('./routes/checkCode')
const angleRouter = require('./routes/angle')
const app = express()

// 配置跨域
app.use(cors())
// 开放图片文件夹
app.use('/uploadImg', express.static('./public/uploadImages/'))
app.use('/modelImg', express.static('./public/modelImages/'))
// 配置body-parser 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 挂载路由
app.use('/', checkCodeRouter)
app.use('/checkCode', checkCodeRouter)
app.use('/login', loginRouter)
// 注册token验证中间件
app.use("/*", auth.verifyToken)
app.use('/user', userRouter)
app.use('/updateUserInfo', userInfoRouter)
app.use('/angle', angleRouter)

app.listen(5000, () => {
  console.log('server is running at 5000...')
})

