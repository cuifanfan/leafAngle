// An highlighted block
<template>
	<view class="content">
		<view class="avatorWrapper">
			<image class="img" mode="widthFix" src="/static/img/hzau.png"></image>
		</view>
		<view class="form">
			<view class="inputWrapper">
				<view class="inputTip">
					<text>电话/邮箱：</text>
				</view>
				<view class="input">
					<input class="baseInput" type="text" placeholder="请输入电话/邮箱" v-model="account" />
				</view>
			</view>
			<view class="inputWrapper">
				<view class="inputTip">
					<text>密码：</text>
				</view>
				<view class="input">
					<input class="baseInput" maxlength="15" type="password" placeholder="请输入密码" v-show="!passwordShow"
						:class="{passwordInput}" v-model="password" @input="passwordInputEvent" />
					<input class="baseInput" maxlength="15" type="text" placeholder="请输入密码" v-show="passwordShow"
						:class="{passwordInput}" v-model="password" @input="passwordInputEvent" />
					<view class="inputRightTips" @click="passwordShow = !passwordShow">
						<uni-icons size="24" color="#888" :type="!passwordShow ? 'eye-slash' : 'eye'"></uni-icons>
					</view>
				</view>
			</view>
			<view class="inputWrapper">
				<view class="inputTip">
					<text>确认密码：</text>
				</view>
				<view class="input">
					<input class="baseInput" type="password" maxlength="15" placeholder="请确认密码"
						v-show="!passwordAgainShow" :class="{passwordInput:passwordAgainInput}" v-model="passwordAgain"
						@input="passwordInputEvent" />
					<input class="baseInput" type="text" maxlength="15" placeholder="请确认密码" v-show="passwordAgainShow"
						:class="{passwordInput:passwordAgainInput}" v-model="passwordAgain"
						@input="passwordInputEvent" />
					<view class="inputRightTips" @click="passwordAgainShow = !passwordAgainShow">
						<uni-icons size="24" color="#888" :type="!passwordAgainShow ? 'eye-slash' : 'eye'"></uni-icons>
					</view>
				</view>
			</view>
			<view class="inputWrapper">
				<view class="inputTip">
					<text>验证码：</text>
				</view>
				<view class="input">
					<input class="baseInput" type="number" maxlength="6" v-model="checkCode" />
					<view class="inputRightTips" @click="sendCode">
						<text>{{seconds ? seconds + 's': '获取'}}</text>
					</view>
				</view>
			</view>
			<view class="btn" @click="register">
				<text>完成注册</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		regist
	} from '@/api/login'
	import {
		testLoginInfo,
		testRegistInfo,
	} from '@/api/login/loginInfo.js'
	import {
		sendCheckCode
	} from '@/api/checkCode'

	export default {
		data() {
			return {
				account: '',
				password: '',
				passwordAgain: '',
				passwordShow: false,
				passwordAgainShow: false,
				passwordInput: false, // 添加缩进样式类
				passwordAgainInput: false,
				checkCode: '',
				seconds: 0,
				serverCheckCode: '', // 服务端发送过来的验证码
			}
		},
		methods: {
			// 添加密码输入框缩进样式
			passwordInputEvent() {
				this.passwordInput = this.password.length > 13
				this.passwordAgainInput = this.passwordAgain.length > 13
			},
			// 发送验证码
			sendCode() {
				// 验证条件
				const testResults = [this.seconds > 0, !testLoginInfo(this.account, this.password, this.passwordAgain)]

				// 给后台发送验证码
				sendCheckCode(testResults, {
					account: this.account,
					success: ({
						checkCode
					}) => {
						this.serverCheckCode = checkCode
					}
				}, () => {
					// 计时器秒数
					this.seconds = 60
					const secondsID = setInterval(() => {
						if (this.seconds === 0) return clearInterval(secondsID)
						this.seconds--
					}, 1000)
				})
			},

			// 注册
			register() {
				// 检查输入
				if (!testRegistInfo(this.account, this.password, this.passwordAgain, this.checkCode, this.serverCheckCode))
					return
				regist({
					account: this.account,
					password: this.password,
					success() {
						setTimeout(() => {
							uni.navigateTo({
								url: `/pages/login/login?account=${this.account}&password=${this.password}`
							})
						}, 500)
						// 保存账号信息到本地，方便下次登录
						uni.setStorageSync('account', this.account)
						uni.setStorageSync('password', this.password)
					},
				})
			},
		}
	}
</script>

<style lang="less">
	@import '@/static/css/base.less';
</style>
