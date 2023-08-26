<template>
	<view class="body">
		<view class="img_test">
			<view class="img_select">
				<view class="img_text" @click="selectImage" v-if="imgHide">
					<span>选择图片</span>
				</view>
				<view class="img_src" v-else>
					<image mode="aspectFill" :src="imgPath" @click="previewImage(imgPath)" @longtap="deleteImage">
				</view>
			</view>
			<view class="img_answer">
				<image mode="aspectFill" :src="resultImgPath" @click="previewImage(resultImgPath)">
			</view>
		</view>


		<view class="form">
			<view class="inputWrapper">
				<view class="inputTip">
					<text>测量地点：</text>
				</view>
				<view class="input">
					<input class="baseInput input_color" type="text" placeholder="请输入测量地点" v-model="location" />
				</view>
			</view>
			<view class="inputWrapper">
				<view class="inputTip">
					<text>测量部位：</text>
				</view>
				<view class="input">
					<input class="baseInput input_color" type="text" placeholder="请输入测量部位" v-model="apart" />
				</view>
			</view>
		</view>

		<view class="control_menu">
			<button class="mini-btn" type="primary" @click="getAngle">开始测量</button>
			<button class="mini-btn" type="primary" @click="save">保存结果</button>
		</view>

		<view class="test_answer">
			<text>平台本次测试的叶夹角为：</text><text class="num_answer">{{leafAngle}}°</text>
		</view>
	</view>
</template>

<script>
	import {
		uploadImg,
		chooseImg,
		previewImg,
		deleteImg
	} from '@/api/angle'

	import {
		pathToBase64,
		base64ToPath
	} from "@/utils/imageTools.js"
	export default {
		data() {
			return {
				imgPath: '', // 选择的图片路径
				imgHide: true, // 控制图片显示组件显示与隐藏
				leafAngle: 0, // 叶夹角大小
				imgBase64: '', // 后端返回的base64
				resultImgPath: '',
				location: '',
				apart: '',
			}
		},
		methods: {
			selectImage() {
				// 选择图片 
				chooseImg({
					success: (res) => {
						this.imgPath = res.tempFilePaths[0]
						this.imgHide = false
					}
				})
			},

			previewImage(path) {
				previewImg(path)
			},

			deleteImage() {
				deleteImg({
					success: (res) => {
						if (res.confirm) {
							this.imgPath = ''
							this.imgHide = true
							this.leafAngle = 0
							this.imgBase64 = ''
							this.resultImgPath = ''
						}
					}
				})
			},
			getAngle() {
				uploadImg({
					filePath: this.imgPath,
					success: ({
						leafAngle,
						resultImgPath
					}) => {
						this.leafAngle = leafAngle
						this.resultImgPath = resultImgPath

						getApp().globalData.cornInfo = {
							angle: leafAngle,
							path: resultImgPath,
							location: this.location,
							apart: this.apart
						}
					}
				})
			},
			save() {
				setTimeout(() => {
					uni.showToast({
						title: "保存成功",
						icon: 'success'
					})
				}, 300)
			}
		}
	}
</script>

<style lang="less">
	@import "@/static/css/base.less";
	@import "@/static/css/angle.less";

	.form {
		width: 88%;
		margin: 10rpx;
	}

	.input_color {
		border: #888 1px solid !important;
		box-sizing: border-box;
	}
</style>
