<template>
	<view>
		<view class="user">
			<view class="userAvatar">
				<image mode="aspectFit" :src="userAvatar">
			</view>
			<view class="userInfo">
				<view class="userName">
					<text>{{userName}}</text>
				</view>
				<view class="accountAndSex">
					<uni-icons class="user_detail_icon" custom-prefix="iconfont" type="icon-nan" size="16" color="#fff"
						v-if="!userSex">
					</uni-icons>
					<uni-icons class="user_detail_icon" custom-prefix="iconfont" type="icon-nv" size="16" color="#fff"
						v-else>
					</uni-icons>
					<text class="userSex">{{userSex ? '女' : '男'}}</text>
					<uni-icons class="user_detail_icon" custom-prefix="iconfont" type="icon-zhanghaoxinxiuser" size="16"
						color="#fff">
					</uni-icons>
					<text class="userAccount">{{account}}</text>
				</view>
				<view>
					<uni-icons class="user_detail_icon" custom-prefix="iconfont" type="icon-qianming" size="16"
						color="#fff"></uni-icons>
					<text class="userDesc">{{userDesc}}</text>
				</view>
			</view>
		</view>
		<view class="userMenu">
			<uni-list :border="false">
				<uni-list-item class="userMenuItem" title="信息修改" clickable showArrow :border="false"
					@click="toUserInfo">
				</uni-list-item>
				<uni-list-item class="userMenuItem" title="数据管理" clickable showArrow to="/pages/data/data?userDetails"
					:border="false">
				</uni-list-item>
				<uni-list-item class="userMenuItem" title="设置" clickable showArrow to="/pages/setting/setting"
					:border="false">
				</uni-list-item>
				<uni-list-item class="userMenuItem" title="清理缓存" clickable :border="false" @click="clearCash">
				</uni-list-item>
				<uni-list-item class="userMenuItem" title="无痕浏览" :border="false" :showSwitch="true"
					@switchChange="incognito">
				</uni-list-item>
			</uni-list>
		</view>
		<view class="exit" @click="exit">
			<text>退出登录</text>
		</view>
	</view>

</template>

<script>
	import {
		getUserInfo
	} from '../../../api/user'

	export default {
		data() {
			return {
				account: '',
				password: '',
				userName: '',
				userAvatar: '',
				userDesc: '',
				userSex: '',
				email: '',
			}
		},
		onLoad() {
			this.account = uni.getStorageSync('account')
			this.password = uni.getStorageSync('account')
			// 加载用户信息
			getUserInfo({
				account: this.account,
				success: (user) => {
					this.userName = user.Uname
					this.userAvatar = user.Uavatar
					this.userDesc = user.Udesc
					this.userSex = user.Usex
					this.email = user.email
					this.tel = user.tel

					// 更新用户账号状态
					uni.setStorageSync('userState', !!user.state)
				}
			})
		},
		onShow() {
			this.userName = getApp().globalData.userName
			this.userSex = getApp().globalData.userSex
		},
		methods: {
			// 修改信息
			toUserInfo() {
				getApp().globalData.userName = this.userName
				getApp().globalData.userSex = this.userSex
				getApp().globalData.email = this.email
				getApp().globalData.tel = this.tel
				uni.navigateTo({
					url: `/pages/userInfo/userInfo`
				})
			},

			// 清空缓存
			clearCash() {
				uni.showModal({
					title: '清空缓存',
					content: '确认清空？',
					success: (res) => {
						if (res.confirm) {
							uni.clearStorageSync()
							setTimeout(() => {
								uni.showToast({
									title: '清理完毕',
									icon: 'success'
								})
							}, 500)
						}
					}
				})
			},

			// 退出登录
			exit() {
				// 删除token 
				uni.removeStorageSync('token')
				// 删除用户账号状态
				uni.removeStorageSync('userState')
				uni.showToast({
					title: '退出成功',
					icon: 'success'
				})
				setTimeout(() => {
					uni.reLaunch({
						url: '/pages/login/login'
					})
				}, 500)
			},

			// 无痕浏览
			incognito(e) {
				// 保存无痕浏览信息到全局
				getApp().globalData.inprivate = e.value
			}
		}
	}
</script>

<style lang="less">
	@import "@/static/css/iconfont.css";
	@import '@/static/css/base.less';
	@import '@/static/css/user.less';
</style>
