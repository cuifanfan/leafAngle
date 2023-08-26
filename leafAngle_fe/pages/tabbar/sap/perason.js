/**
 * 计算皮尔逊相关系数
 * @list1:数字列表1
 * @list2:数字列表2
 * @return number
 * */
function pearson(list1, list2) {
	let newList = [];
	let len = list1.length;
	for (let i = 0; i < len; i++) {
		newList.push(list1[i] * list2[i]);
	}
	let mean1 = mean(list1),
		mean2 = mean(list2);
	let cov = mean(newList) - mean1 * mean2;
	return cov / (std(list1, mean1) * std(list2, mean2))
}
/**
 * 计算平均值
 * @list:数字列表
 * @return number
 * */
function mean(list) {
	let sum = 0;
	list.forEach((item) => {
		sum += item
	})
	return sum / list.length;
}
/**
 * 计算标准差
 * @list:数字列表
 * @mean:列表list的平均值
 * @return number
 * */
function std(list, mean) {
	let sum = 0;
	list.forEach((item) => {
		sum += Math.pow(item - mean, 2)
	})
	return Math.sqrt(sum / list.length)
}

export default pearson
