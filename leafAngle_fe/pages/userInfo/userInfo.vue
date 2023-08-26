// An highlighted block
<template>
	<view class="content">
		<view class="form">
			<view class="inputWrapper">
				<view class="inputTip">
					<text>用户名：</text>
				</view>
				<view class="input">
					<input type="text" class="baseInput" v-model="userName" @focus="inputFocus(userName)"
						@blur="inputBlur(userName)" />
				</view>
			</view>

			<view class="inputWrapper">
				<view class="inputTip">
					<text>性别：</text>
				</view>
				<view class="input">
					<picker class="baseInput picker" :value="sexIndex" :range="sex"
						@change="sexIndex = $event.detail.value">
						<text>{{ sex[sexIndex] }}</text>
					</picker>
				</view>
			</view>

			<view class="inputWrapper">
				<view class="inputTip">
					<text>绑定手机：</text>
				</view>
				<view class="input">
					<input class="baseInput" :type="telType" v-model="tel" :disabled="telDisabled"
						@focus="inputFocus(tel)" @blur="inputBlur(tel)" />
				</view>
			</view>

			<view class="inputWrapper">
				<view class="inputTip">
					<text>绑定邮箱：</text>
				</view>
				<view class="input">
					<input class="baseInput" type="text" v-model="email" :disabled="emailDisabled"
						@focus="inputFocus(email)" @blur="inputBlur(email)" />
				</view>
			</view>
			<view class="inputWrapper">
				<view class="inputTip">
					<text>修改密码：</text>
				</view>
				<view class="input">
					<input class="baseInput" type="password" maxlength="15" :class="{passwordInput}"
						v-show="!passwordShow" v-model="password" @input="passwordInputEvent"
						@focus="inputFocus(password)" @blur="inputBlur(password)" />
					<input class="baseInput" maxlength="15" type="text" :class="{passwordInput}" v-show="passwordShow"
						v-model="password" @input="passwordInputEvent" @focus="inputFocus(password)"
						@blur="inputBlur(password)" />
					<view class="inputRightTips " @click="passwordShow = !passwordShow">
						<uni-icons size="24" color="#888" :type="!passwordShow ? 'eye-slash' : 'eye'"></uni-icons>
					</view>
				</view>
			</view>

			<view class="inputWrapper">
				<view class="inputTip">
					<text>确认密码：</text>
				</view>
				<view class="input">
					<input class="baseInput" maxlength="15" type="password" v-show="!passwordAgainShow"
						:class="{passwordInput:passwordAgainInput}" v-model="passwordAgain" @input="passwordInputEvent"
						@focus="inputFocus(passwordAgain + 'again')" @blur="inputBlur(passwordAgain + 'again')" />
					<input class="baseInput" maxlength="15" type="text" v-show="passwordAgainShow"
						:class="{passwordInput:passwordAgainInput}" v-model="passwordAgain" @input="passwordInputEvent"
						@focus="inputFocus(passwordAgain + 'again')" @blur="inputBlur(passwordAgain + 'again')" />
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
						<text>{{ seconds ? seconds + 's' : "获取" }}</text>
					</view>
				</view>
			</view>
			<view class="btn" @click="updateUserInfo">
				<text>完成修改</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		testUserInfo
	} from "@/api/userInfo/userInfo.js";
	import {
		updateUserInfo
	} from "@/api/userInfo";
	import {
		sendCheckCode
	} from '@/api/checkCode'
	import {
		setInputBlur
	} from '@/utils/inputControl.js'
	export default {
		data() {
			return {
				account: "",
				password: "",
				passwordAgain: "",
				checkCode: "",
				serverCheckCode: '',
				userName: "",
				sex: ["男", "女"],
				sexIndex: 0,
				email: "",
				tel: "",
				seconds: 0,
				telDisabled: false,
				emailDisabled: false,
				passwordDisabled: false,
				passwordShow: false,
				passwordAgainShow: false,
				passwordInput: false, // 添加缩进样式类
				passwordAgainInput: false,
				telType: "text",
				// 页面onshow过来的初始信息
				userBaseInfo: {
					userName: '',
					tel: '',
					email: '',
					password: '',
					passwordAgain: '',
				}
			};
		},
		onShow() {
			// 获取当前小程序的页面栈
			const {
				userName,
				userSex,
				email,
				tel
			} = getApp().globalData;
			this.account = uni.getStorageSync("account");
			this.password = uni.getStorageSync("password");
			this.passwordAgain = uni.getStorageSync("password");
			this.userName = userName || '小白的猫';
			this.sexIndex = userSex || 0;
			this.telDisabled = !!Number(tel);
			this.emailDisabled = !!email;
			this.email = email ? email : "未绑定邮箱";
			this.tel = Number(tel) ? tel : "未绑定手机号";

			// 更新用户初始信息
			this.userBaseInfo.userName = this.userName
			this.userBaseInfo.tel = this.tel
			this.userBaseInfo.email = this.email
			this.userBaseInfo.password = this.password
			this.userBaseInfo.passwordAgain = this.password
		},
		methods: {
			// 添加密码输入框缩进样式
			passwordInputEvent() {
				this.passwordInput = this.password.length > 13
				this.passwordAgainInput = this.passwordAgain.length > 13
			},
			// 输入框添加动画样式
			inputFocus(value) {
				switch (value) {
					case this.userName:
						if (this.userName !== this.userBaseInfo.userName) break;
						this.userName = "";
						break;
					case this.tel:
						if (this.tel !== this.userBaseInfo.tel) break;
						this.tel = "";
						this.telType = "number";
						break;
					case this.email:
						if (this.email !== this.userBaseInfo.email) break;
						this.email = "";
						break;
					case this.password:
						if (this.password !== this.userBaseInfo.password) break;
						this.password = "";
						break;
					case this.passwordAgain + "again":
						if (this.passwordAgain !== this.userBaseInfo.password) break;
						this.passwordAgain = "";
						break;
				}
			},
			inputBlur(value) {
				switch (value) {
					case this.userName:
						this.userName = this.userName || this.userBaseInfo.userName;
						break;
					case this.tel:
						this.telType = "text";
						this.tel = this.tel || this.userBaseInfo.tel;
						break;
					case this.email:
						this.email = this.email || this.userBaseInfo.email;
						break;
					case this.password:
						this.password = this.password || this.userBaseInfo.password;
						break;
					case this.passwordAgain + "again":
						this.passwordAgain = this.passwordAgain || this.userBaseInfo.password;
						break;
				}
			},

			sendCode() {
				// 发送验证码
				sendCheckCode([!testUserInfo({
					userName: this.userName,
					tel: this.tel,
					email: this.email,
					password: this.password,
					passwordAgain: this.passwordAgain
				})], {
					account: this.account,
					success: ({
						checkCode
					}) => {
						this.serverCheckCode = checkCode
					}
				}, () => {
					// 修改计时器秒数
					this.seconds = 60
					const secondsID = setInterval(() => {
						if (this.seconds === 0) return clearInterval(secondsID)
						this.seconds--
					}, 1000)
				})
			},
			updateUserInfo() {
				// 检查输入信息
				if (
					!testUserInfo({
						userName: this.userName,
						tel: this.tel,
						email: this.email,
						password: this.password,
						passwordAgain: this.passwordAgain,
						checkCode: this.checkCode,
						serverCheckCode: this.serverCheckCode
					})
				)
					return;
				// 提交修改信息
				updateUserInfo({
					userName: this.userName,
					userSex: this.sexIndex,
					tel: this.tel,
					email: this.email,
					password: this.password,
					account: this.account,
					success: () => {
						// 修改全局信息(user页面需要)
						getApp().globalData.userName = this.userName
						getApp().globalData.userSex = this.sexIndex
						getApp().globalData.email = this.email
						getApp().globalData.tel = this.tel

						setTimeout(() => {
							uni.switchTab({
								url: `/pages/tabbar/user/user?userName=${this.userName}&userSex=${this.sexIndex}`
							})
						}, 500)
					}
				})
			},
		},
	};
</script>

<style lang="less">
	@import "@/static/css/base.less";

	.content {
		padding: 10rpx 0;
	}
</style>
