const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
// 返回模型对象
/**
 *
 * @param {string} database 要连接的数据库名称
 * @param {object} structure 文档结构（表结构）
 * @param {string} collection 要生成的集合名称
 */
module.exports = function (database, collection, structure) {
  mongoose.connect('mongodb://localhost/' + database, { useNewUrlParser: true, useUnifiedTopology: true })
  const Schema = mongoose.Schema // 拿到图表
  // 设计文档结构
  const schema = new Schema(structure)
  // 将文档发布为模型，返回模型对象
  return mongoose.model(collection, schema) // 第一个参数为将来数据库当前文档集合的名称（会转化为小写复数）
}
