const getModel = require('../api/getModel')

const structure = {
  Pid: {
    type: Number,
    required: true
  },
  Uip: {
    type: String,
  },
  Mip: {
    type: String
  },
  time: {
    type: Number,
  },
  location: {
    type: String,
  },
  apart: {
    type: String,
  },
  angle: {
    type: Number,
    default: 0
  },
  state: {
    type: Number,
    enum: [0, 1], // 0表示禁用,1表示启用
    default: 1
  }
}

module.exports = getModel('leafAngle', 'corns', structure)