<template>
	<view class="content">
		<view class="form">
			<view class="form-item">
				<input class="form-item-input" type="number" v-model="mobile" :maxlength="11" placeholder="请输入手机号码" placeholder-class="fsz26">
			</view>
			<view class="form-item">
				<input class="form-item-input" :password="true" type="text" v-model="password" placeholder="请输入登录密码" placeholder-class="fsz26">
			</view>
			<view class="goforgetpwd color-9 fsz24" @click="goForgetpwd"> 忘记密码 </view>
			<view class="bottom">
				<button :class="loginButtonClass" @click="loginHandler" hover-class="btn-hover">登录</button>
				<!-- <view class="color-9 fsz24 agreement">
					登录即代表你同意
					<text @click="goAgreement" class="color-o">用户协议</text>
				</view> -->
				<view class="fz12 regist" @click="toReg">注册</view>
				
			</view>
		</view>
	</view>
	
</template>

<script>
import { baseUrl } from '@/config/config.js';
import { goBack, jumpBackPage } from '@/config/mixins.js';
export default {
	mixins: [goBack, jumpBackPage],
	data() {
		return {
			mobile: '',
			password: '',
			btnb: 'btn btn-square btn-c btn-all', // 按钮bg
		}
	},
	computed: {
		// 动态更改登录按钮bg
		loginButtonClass() {
			return this.mobile && this.mobile.length === 11 && this.password ? this.btnb + ' btn-blue' : this.btnb;
		},
	},
	methods: {
		goForgetpwd() {
			uni.navigateTo({
				url: '/pages/login/resetPwd/index'
			})
		},
		rightMobile() {
			let res = {};
			if (!this.mobile) {
				res.status = false;
				res.msg = '请输入手机号';
			} else if (!/^1[3456789]{1}\d{9}$/gi.test(this.mobile)) {
				res.status = false;
				res.msg = '手机号格式不正确';
			} else if (!this.password) {
				res.status = false;
				res.msg = '请输入密码';
			} else {
				res.status = true;
			}
			return res;
		},
		loginHandler() {
			if (this.mobile && this.mobile.length === 11 && this.password) {
				if (!this.rightMobile().status) {
					this.$common.errorToShow(this.rightMobile().msg);
				} else {
					this.toLogin();
				}
			}
		},
		toLogin() {
			let data = {
				mobile: this.mobile,
				password: this.password
			};
			
			// if (this.isCaptcha) {
			// 	data.captcha = this.captcha;
			// }
			
			// 获取邀请码
			// let invicode = this.$db.get('invitecode');
			// if (invicode) {
			// 	data.invitecode = invicode;
			// }
			
			this.$api.login(data, res => {
				console.log(res)
				if (res.state > 0) {
					this.$db.set('userToken', res.data.login_token);
					this.redirectHandler();
				} else {
					this.$common.errorToShow(res.msg, () => {
						// 需要输入验证码 或者 验证码错误刷新
						// if (res.data === 10013 || res.data === 10012) {
						// 	this.isCaptcha = true;
						// }
			
						// 登录需要验证码
						// if (this.isCaptcha) {
						// 	this.getCaptchaUrl();
						// }
					});
				}
			});
		},
		// 重定向跳转 或者返回上一个页面
		redirectHandler() {
			this.$common.successToShow('登录成功!', () => {
				this.$db.set('timer', 0);
				this.handleBack();
			});
		},
		goAgreement() {
			
		},
		goPrivacy() {
			
		},
		toReg() {
			this.$common.navigateTo('/pages/login/register/index');
		}
	}
}
</script>

<style>
	@import '~@/static/css/form.scss';
	
</style>
