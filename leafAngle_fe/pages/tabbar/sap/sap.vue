<template>
	<view>
		<canvas canvas-id="VZHnwcnZBDfJReexkmUlXXkiQPaATSBx" id="VZHnwcnZBDfJReexkmUlXXkiQPaATSBx" class="charts"
			@touchend="tap" />

		<canvas canvas-id="apZIxxsdrIenIBWNDRKiBEmmDUkkqRhx" id="apZIxxsdrIenIBWNDRKiBEmmDUkkqRhx" class="charts"
			@touchend="tap" />
		<view class="fc">
			<text>皮尔逊相关系数为：<text style="color: red;">0.97532456236781</text> </text>
		</view>
		<view class="control_btn">
			<button class="uni-button real" size="mini">真实值上传</button>
			<button class="uni-button compare" size="mini">相关性比较</button>
		</view>
	</view>
</template>

<script>
	import uCharts from './u-charts.js';
	import {
		preData,
		realData
	} from './data.js'
	import pearson from './perason.js'

	//模拟服务器返回数据，如果数据格式和标准格式不同，需自行按下面的格式拼接
	let lt30 = 0,
		lt35 = 0,
		lt40 = 0,
		gt40 = 0
	preData.forEach(data => {
		if (data < 30) lt30++
		else if (data < 35) lt35++
		else if (data < 40) lt40++
		else gt40++
	})
	const res1 = {
		series: [{
			data: [{
				"name": "<30°",
				"value": lt30
			}, {
				"name": "31°~35°",
				"value": lt35
			}, {
				"name": "36°~40°",
				"value": lt40
			}, {
				"name": ">=40°",
				"value": gt40
			}]
		}]
	};

	// 拼接数据
	const pre_real_data = []
	for (let i = 0; i < preData.length; i++) {
		pre_real_data.push([preData[i], realData[i]])
	}

	const res2 = {
		series: [{
			name: "模型预测值与真实值相关性比较",
			data: pre_real_data
		}, ]
	}

	const uChartsInstance = {};
	const baseConfig = {
		color: ["#5fb585", "#91CB74", "#FAC858", "#EE6666"],
		padding: [15, 10, 0, 15],
		animation: true,
		enableScroll: false,
		//这里的 750 对应 css .charts 的 width
		//这里的 500 对应 css .charts 的 height
		width: uni.upx2px(700),
		height: uni.upx2px(450),
	}

	export default {
		data() {
			return {
				cWidth: 700,
				cHeight: 450,
				r: pearson(preData, realData)
			};
		},
		onReady() {
			const canvasConfig1 = {
				...baseConfig,
				type: "pie",
				context: uni.createCanvasContext('VZHnwcnZBDfJReexkmUlXXkiQPaATSBx', this),
				categories: res1.categories,
				series: res1.series,
				xAxis: {
					disableGrid: true
				},
				yAxis: {
					gridType: "dash",
					dashLength: 2
				},
				extra: {
					pie: {
						activeOpacity: 0.5,
						activeRadius: 10,
						offsetAngle: 0,
						labelWidth: 15,
						border: true,
						borderWidth: 3,
						borderColor: "#FFFFFF",
						linearType: "custom"
					}
				}
			}
			const canvasConfig2 = {
				...baseConfig,
				type: "scatter",
				context: uni.createCanvasContext('apZIxxsdrIenIBWNDRKiBEmmDUkkqRhx', this),
				series: res2.series,
				dataLabel: false,
				xAxis: {
					disableGrid: false,
					gridType: "dash",
					splitNumber: 5,
					boundaryGap: "justify",
					min: 28
				},
				yAxis: {
					disableGrid: false,
					gridType: "dash"
				},
			}
			this.getServerData('VZHnwcnZBDfJReexkmUlXXkiQPaATSBx', res1, canvasConfig1);
			this.getServerData('apZIxxsdrIenIBWNDRKiBEmmDUkkqRhx', res2, canvasConfig2)
		},

		methods: {
			getServerData(canvasId, res, config) {
				//模拟从服务器获取数据时的延时
				setTimeout(() => {
					uChartsInstance[canvasId] = new uCharts(config);
				}, 500);
			},
			tap(e) {
				uChartsInstance[e.target.id].touchLegend(e);
				uChartsInstance[e.target.id].showToolTip(e);
			}
		}
	};
</script>

<style scoped>
	.charts {
		width: 700rpx;
		height: 450rpx;
	}

	.control_btn {
		padding: 20rpx 80rpx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.uni-button {
		padding: 10rpx 30rpx;
		color: aliceblue;
		background-color: #5fb585;
	}

	.fc {
		display: flex;
		justify-content: center;
		margin: 20rpx 0;
	}
</style>
