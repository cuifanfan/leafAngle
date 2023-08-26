const getModel = require('../api/getModel')

const structure = {
  Uid: {
    type: String,
    required: true
  },
  Uname: {
    type: String,
    default: '小白的猫'
  },
  pwd: {
    type: String,
    required: true
  },
  Usex: {
    type: Number,
    enum: [0, 1], // 0 表示男 1表示女
    default: 0
  },
  Uavatar: {
    type: String,
    default: '/static/img/hzau.png',
  },
  Udesc: {
    type: String,
    default: '这个用户很神秘，什么都没留下...'
  },
  email: {
    type: String,
  },
  tel: {
    type: Number,
    default: 0
  },
  state: {
    type: Number,
    enum: [0, 1],
    default: 1 // 0表示禁用 1表示启用
  },
  Mcorns: {
    // 测量记录
    type: Array,
    default: []
  },
  Scorns: {
    type: Array,
    default: []
  }
}


module.exports = getModel('leafAngle', 'users', structure)