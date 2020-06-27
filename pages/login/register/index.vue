<template>
	<view class="content">
		<!-- <view class="reg-t"><image class="reg-logo" :src="logoImage" mode="aspectFill"></image></view> -->
		<view class="reg-m">
			<view class="reg-item">
				<input type="number" v-model="mobile" :maxlength="maxMobile" placeholder="请输入手机号码" focus placeholder-class="fsz26" />
			</view>
			<view class="reg-item flc">
				<input class="reg-item-input" placeholder-class="fsz26" type="text" v-model="code" placeholder="请输入验证码" />
				<view :class="sendCodeBtn" @click="sendCode" v-if="verification">发送验证码</view>
				<view class="btn btn-g" v-if="!verification">{{ timer }} 秒后重新获取</view>
			</view>
			<view class="reg-item">
				<input class="login-item-input" :password="true" placeholder-class="fsz26" type="text" v-model="password" placeholder="请输入密码" />
			</view>
		</view>
		<view class="bottom">
			<button :class="regButtonClass" @click="toReg()" hover-class="btn-hover">注册</button>
			<view class="color-9 fsz24 agreement">
				注册即代表你同意
				<text @click="goAgreement()" class="color-o">用户协议</text>
				和
				<text @click="goPrivacy()" class="color-o">隐私政策</text>
			</view>
		</view>
		<view class="registered-item"><view class="btn btn-g btn-square registered" @click="toLogin">已有账号，立即登录</view></view>
	</view>
</template>

<script>
import { goBack } from '@/config/mixins.js';
export default {
	mixins: [goBack],
	data() {
		return {
			maxMobile: 11,
			mobile: '', // 用户手机号
			code: '', // 短信验证码
			password: '', // 用户密码
			verification: true, // 通过v-show控制显示获取还是倒计时
			timer: 60, // 定义初始时间为60s
			btnb: 'btn btn-c btn-square btn-all' //按钮背景
		};
	},
	onLoad(options) {
		let _this = this;
		_this.timer = parseInt(_this.$db.get('timer'));
		if (_this.timer != null && _this.timer > 0) {
			_this.countDown();
			_this.verification = false;
		}

		if (options.invitecode) {
			this.$db.set('invitecode', options.invitecode);
		}
	},
	computed: {
		// 验证手机号
		rightMobile() {
			let res = {};
			if (!this.mobile) {
				res.status = false;
				res.msg = '请输入手机号';
			} else if (!/^1[3456789]{1}\d{9}$/gi.test(this.mobile)) {
				res.status = false;
				res.msg = '手机号格式不正确';
			} else {
				res.status = true;
			}
			return res;
		},
		// 动态更改登录按钮bg
		regButtonClass() {
			return this.mobile && this.mobile.length === 11 && this.password && this.code ? this.btnb + ' btn-blue' : this.btnb;
		},
		// 动态修改发送验证码按钮
		sendCodeBtn() {
			let btn = 'btn btn-g';
			if (this.mobile.length === this.maxMobile && this.rightMobile.status) {
				return btn + ' btn-blue';
			} else {
				return btn;
			}
		},
		logoImage() {
			// return this.$store.state.config.shop_logo;
			return '@/static/image/logo2.png'
		}
	},
	onShow() {
		let _this = this;
		let userToken = _this.$db.get('userToken');
		if (userToken && userToken != '') {
			uni.switchTab({
				url: '/pages/mine/index/index'
			});
			return true;
		}
		_this.timer = parseInt(_this.$db.get('timer'));
		if (_this.timer != null && _this.timer > 0) {
			_this.countDown();
			_this.verification = false;
		}
	},
	methods: {
		// 发送短信验证码
		sendCode() {
			if (!this.rightMobile.status) {
				this.$common.errorToShow(this.rightMobile.msg);
			} else {
				this.$common.loadToShow('发送中...');
				setTimeout(() => {
					this.$common.loadToHide();
					this.$api.sms({ mobile: this.mobile, state: 0 }, res => {
						if (res.state == "200") {
							this.timer = 60;
							this.verification = false;
							this.$common.successToShow('发送成功');
							this.countDown(); // 执行验证码计时
							this.btnb = 'btn btn-square btn-all btn-blue';
						} else {
							this.$common.errorToShow(res.msg);
						}
					});
				}, 1000);
			}
		},
		// 验证码倒计时
		countDown() {
			let auth_timer = setInterval(() => {
				// 定时器设置每秒递减
				this.timer--; // 递减时间
				uni.setStorage({
					key: 'timer',
					data: this.timer,
					success: function() {}
				});
				if (this.timer <= 0) {
					this.verification = true; // 60s时间结束还原v-show状态并清除定时器
					clearInterval(auth_timer);
				}
			}, 1000);
		},
		toReg() {
			if (!this.rightMobile.status) {
				this.$common.errorToShow(this.rightMobile.msg);
			} else if (!this.code) {
				this.$common.errorToShow('请输入短信验证码');
			} else if (!this.password) {
				this.$common.errorToShow('请输入登录密码');
			} else {
				let data = {
					mobile: this.mobile,
					code: this.code,
					password: this.password
				};
				this.$api.reg(data, res => {
					console.log(res)
					if (res.state == "200") {
						this.$db.set('userToken', res.data.login_token);
						this.$common.successToShow('注册成功', () => {
							this.$db.set('userToken', res.data.login_token);
							uni.redirectTo({
								url: '/pages/mine/auth/index'
							});
						});
					} else {
						this.$common.errorToShow(res.msg);
					}
				});
			}
		},
		toLogin() {
			this.$common.navigateTo('/pages/login/index/index');
		},
		// 跳转到用户协议
		goAgreement() {
			let articleId = this.$store.state.config.user_agreement_id;
			this.$common.navigateTo('/pages/article/index?id_type=1&id=' + articleId);
		},
		// 跳转到隐私政策
		goPrivacy() {
			let articleId = this.$store.state.config.privacy_policy_id;
			this.$common.navigateTo('/pages/article/index?id_type=1&id=' + articleId);
		}
	}
};
</script>

<style lang="scss">
@import '~@/static/css/form.scss';
</style>
