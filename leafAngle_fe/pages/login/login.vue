// An highlighted block
<template>
	<view class="content">
		<view class="avatorWrapper">
			<image class="img" mode="widthFix" src="/static/img/hzau.png"></image>
		</view>

		<view class="form">
			<view class="inputWrapper">
				<view class="input">
					<input class="baseInput loginInput" type="text" placeholder="请输入手机号/邮箱" v-model="account"
						@focus="inputFocus(account)" @blur="inputBlur(account)" />
				</view>
			</view>
			<view class="inputWrapper">
				<view class="input">
					<input class="baseInput loginInput" type="password" maxlength="15" placeholder="请输入密码"
						v-model="password" v-show="!passwordShow" @focus="inputFocus(password)"
						@blur="inputBlur(password)" />
					<input class="baseInput loginInput" type="text" maxlength="15" v-model="password"
						v-show="passwordShow" placeholder="请输入密码" @focus="inputFocus(password)"
						@blur="inputBlur(password)" />

					<view class="inputRightTips" @click="passwordShow = !passwordShow">
						<uni-icons size="24" color="#888" :type="!passwordShow ? 'eye-slash' : 'eye'"></uni-icons>
					</view>
				</view>
			</view>
			<view class="btn" @click="signIn">
				<text>登录</text>
			</view>
			<view class="loginTool">
				<view @click="toRegist()">注册账号</view>
				<view @click="toLost()">找回密码</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		login
	} from '@/api/login'
	import {
		testLoginInfo
	} from '@/api/login/loginInfo'
	export default {
		data() {
			return {
				account: '',
				password: '',
				passwordShow: false
			}
		},
		onShow() {
			this.account = uni.getStorageSync('account')
			this.password = uni.getStorageSync('password')
		},
		methods: {
			// 输入框焦点控制
			inputFocus(value) {
				switch (value) {
					case this.account:
						if (this.account !== uni.getStorageSync('account')) break
						this.account = ''
						break
					case this.password:
						if (this.password !== uni.getStorageSync('password')) break
						this.password = ''
						break
				}
			},
			inputBlur(value) {
				switch (value) {
					case this.account:
						this.account = this.account || uni.getStorageSync('account')
						break
					case this.password:
						this.password = this.password || uni.getStorageSync('password')
						break
				}
			},
			signIn() {
				// 检查输入
				if (!testLoginInfo(this.account, this.password)) return
				login({
					account: this.account,
					password: this.password,
					success(data) {
						// 登录成功，保存token和用户账号状态
						uni.setStorageSync('token', data.token)
						uni.setStorageSync('userState', true)
						// 保存登录信息到本地（账号、密码），方便下次登录
						uni.setStorageSync('account', this.account)
						uni.setStorageSync('password', this.password)
						setTimeout(() => {
							uni.switchTab({
								url: '/pages/tabbar/angle/angle',
							})
						}, 500)
					}
				})
			},
			toRegist() {
				uni.navigateTo({
					url: '/pages/login/register',
				})
			},
			toLost() {
				uni.navigateTo({
					url: '/pages/login/lost'
				})
			}
		}
	}
</script>

<style lang="less">
	@import '../../static/css/base.less';

	.form {
		box-sizing: border-box;
		padding: 0 25rpx;

		.inputRightTips {
			margin: 5rpx 30rpx;
		}

		.loginInput {
			height: 85rpx !important;
			border-radius: 38rpx !important;
			background-color: red;
		}

		.loginTool {
			display: flex;
			justify-content: space-around;
			margin-top: 50rpx;
			color: #666;

			view {
				padding: 10rpx 20rpx;
			}
		}
	}
</style>
