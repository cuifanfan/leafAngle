export function setInputBlur(value, baseInfo, keysConfig) {
	/**
	 * @param obj {Object} 给输入框绑定值的对象
	 * @param value {String | Number} 当前正在失去焦点的输入框 所对应的值
	 * @param keysConfig {Array} obj中添加失去焦点功能的键的配置信息组成的数组
	 * @param baseValue {Object} obj中添加失去焦点功能的键 的初始值
	 * 		@param key {String} obj中添加失去焦点功能的键 
	 * 		@param extr {String | Number} 判断obj[key]对应的值和value相等时的附加值
	 * 		@param callback {Function} 当前键对应的输入框触发blur事件时执行的回调
	 */
	for (const config of keysConfig) {
		const extr = config.extr || (typeof value === 'string' ? '' : 0)
		if (this[config.key] === value + extr) {
			config.callback && config.callback.call(obj)
			this[config.key] = this[config.key] || baseInfo[config.key]
			break
		}
	}
}
