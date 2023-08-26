module.exports.getDate = function () {
  const date = new Date()
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日'
}

