<template>
	<view class="">
		<view class="plant_search">
			<view class="search_input">
				<uni-icons type="search" size="20" class="search-icon"></uni-icons>
				<input class="uni-input" confirm-type="search" focus placeholder="搜索植株" v-model="search" />
			</view>
			<view class="search_camera">
				<uni-icons type="image-filled" size="38"></uni-icons>
			</view>
		</view>

		<view class="search_list" v-if="corns.length">
			<ul>
				<li v-for="(item, index) in corns" :key="index">
					<view class="plant_img">
						<image :src="item.imgSrc" mode="aspectFit"></image>
					</view>
					<view class="plant_detail">
						<view class="">
							<text class="fz">叶夹角: {{item.angle}}°</text>
						</view>
						<view class="plant_detail_below">
							<text>id:{{item.id}}</text>
							<text>地点:{{item.location}} </text>
							<text>时间:{{item.time}}</text>
						</view>
					</view>
				</li>

			</ul>
			<view class="has_result">
				<text>查找到 {{corns.length}} 条记录</text>
				<text class="end_result">-- end --</text>
			</view>
		</view>
		<view class="no_result" v-else>
			<text>没有查找到任何植株</text>
			<text class="end_result">-- end --</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				search: '',
				checkedIndexArray: [],
				corns: [{
						imgSrc: '../../../static/img/(75).jpg',
						angle: '31.64184361987',
						id: 1,
						location: '华农',
						time: '2023.1.2'
					},

					{
						imgSrc: '../../../static/img/(61).jpg',
						angle: '37.462874116',
						location: '四教',
						id: 97,
						time: '2023.3.9'
					},
					{
						imgSrc: '../../../static/img/(68).jpg',
						angle: '35.56346523524',
						location: '华农',
						id: 27,
						time: '2023.5.18'
					},
					{
						imgSrc: '../../../static/img/(52).jpg',
						angle: '29.312624719',
						location: '三田',
						id: 101,
						time: '2023.4.12'
					},
					{
						imgSrc: '../../../static/img/(102).jpg',
						angle: '35.318763712',
						location: '南湖',
						id: 63,
						time: '2023.5.19'
					},
					{
						imgSrc: '../../../static/img/(34).jpg',
						angle: '33.462374623',
						location: '华农',
						id: 45,
						time: '2023.6.7'
					},
				],
				baseCorns: [{
						imgSrc: '../../../static/img/(75).jpg',
						angle: '31.64184361987',
						id: 1,
						location: '华农',
						time: '2023.1.2'
					},

					{
						imgSrc: '../../../static/img/(61).jpg',
						angle: '37.462874116',
						location: '四教',
						id: 97,
						time: '2023.3.9'
					},
					{
						imgSrc: '../../../static/img/(68).jpg',
						angle: '35.56346523524',
						location: '华农',
						id: 27,
						time: '2023.5.18'
					},
					{
						imgSrc: '../../../static/img/(52).jpg',
						angle: '29.312624719',
						location: '三田',
						id: 101,
						time: '2023.4.12'
					},
					{
						imgSrc: '../../../static/img/(102).jpg',
						angle: '35.318763712',
						location: '南湖',
						id: 63,
						time: '2023.5.19'
					},
					{
						imgSrc: '../../../static/img/(32).jpg',
						angle: '33.462374623',
						location: '华农',
						id: 45,
						time: '2023.6.7'
					},
				]
			}
		},
		onShow() {
			const cornInfo = getApp().globalData.cornInfo
			const imgSrc = cornInfo.path
			const angle = cornInfo.angle
			const location = cornInfo.location
			const id = '125'
			const time = '2023.6.8'
			this.corns.unshift({
				imgSrc,
				angle,
				location,
				id,
				time
			})
		},
		methods: {

		}
	}
</script>

<style lang="less">
	.plant_search {
		display: flex;
		justify-content: space-between;
		padding: 30rpx 40rpx;
		// background-color: #5fb585;

		.search_input {
			display: flex;
			align-items: center;
			flex: 1;
			padding: 15rpx 30rpx;
			border-radius: 20rpx;
			// background-color: #fff;
			border: 1px solid #5fb585;

			.search-icon {
				margin-right: 15rpx;
			}
		}

		.search_camera {
			margin-left: 30rpx;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}

	.no_result,
	.has_result {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 50rpx;

		.end_result {
			margin-top: 10rpx;
			color: gray;
		}
	}

	.has_result {
		margin-top: 0rpx;
	}

	.search_list {

		ul {
			padding: 50rpx;
		}

		li {
			position: relative;
			margin-bottom: 30rpx;
			padding: 20rpx 40rpx;
			list-style: none;
			border: 1px solid #5fb585;
			border-left: 0;
			border-radius: 15rpx;
			overflow: hidden;
			display: flex;

			.plant_img {
				display: flex;
				justify-content: center;
				align-items: center;
				width: 100rpx;
				height: 100rpx;
				overflow: hidden;

				image {
					width: 100%;
				}
			}

			.plant_detail {
				flex: 1;
				margin-left: 40rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;

				text {
					font-size: 28rpx;
					margin-right: 10rpx;
				}
			}
		}

		li::before {
			position: absolute;
			top: 0;
			left: 0;
			display: block;
			content: '';
			width: 15rpx;
			height: 140rpx;
			background-color: #5fb585;
		}
	}
</style>
