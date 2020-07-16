<template>
	<view class="content">
		<view class="form">
			<view class="form-item">
				<input type="number" v-model="mobile" :maxlength="11" placeholder="请输入新手机号码" placeholder-class="fsz26">
			</view>
			<view class="flex space-between flex-wrap form-item">
				<input class="flex-1" placeholder-class="fsz26" type="text" v-model="code" placeholder="请输入验证码" />
				<view :class="sendCodeBtn" @click="sendCode" v-if="verification">发送验证码</view>
				<view class="btn btn-g" v-if="!verification">{{ timer }} 秒后重新获取</view>
			</view>
			<view class="bottom">
				<button :class="operButtonClass" @click="toFixTel" hover-class="btn-hover">修改手机号</button>
			</view>
		</view>
	</view>
</template>
<script>
	import { baseUrl } from '@/config/config.js';
	import { goBack, jumpBackPage } from '@/config/mixins.js';
	export default {
		data() {
			return {
				mobile: '',
				code: '', // 短信验证码
				verification: true, // 通过v-show控制显示获取还是倒计时
				timer: 60, // 定义初始时间为60s
				btnb: 'btn btn-c btn-square btn-all' //按钮背景
			}
		},
		computed: {
			// 动态更改登录按钮bg
			operButtonClass() {
				return this.mobile && this.mobile.length === 11 && this.code ? this.btnb + ' btn-blue' : this.btnb;
			},
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
			// 动态修改发送验证码按钮
			sendCodeBtn() {
				let btn = 'btn btn-g';
				if (this.mobile.length === this.maxMobile && this.rightMobile().status) {
					return btn + ' btn-blue';
				} else {
					return btn;
				}
			},
		},
		onShow() {
			let _this = this;
			// let userToken = _this.$db.get('userToken');
			// if (userToken && userToken != '') {
			// 	uni.switchTab({
			// 		url: '/pages/mine/index/index'
			// 	});
			// 	return true;
			// }
			_this.timer = parseInt(_this.$db.get('timer_fix_tel'));
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
						// state 等于 0 注册 state 等于 1 忘记密码 state 等于 2 修改手机号
						this.$api.sms({ mobile: this.mobile, state: 2 }, res => {
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
						key: 'timer_fix_tel',
						data: this.timer,
						success: function() {}
					});
					if (this.timer <= 0) {
						this.verification = true; // 60s时间结束还原v-show状态并清除定时器
						clearInterval(auth_timer);
					}
				}, 1000);
			},
			fixTelHandler() {
				if (this.mobile && this.mobile.length === 11 && this.code) {
					if (!this.rightMobile().status) {
						this.$common.errorToShow(this.rightMobile().msg);
					} else {
						this.toFixTel();
					}
				}
			},
			toFixTel() {
				let data = {
					mobile: this.mobile,
					code: this.code
				};
				
				this.$api.fixTel(data, res => {
					console.log(res)
					if (res.state > 0) {
						uni.showToast({
							title: `修改手机号成功`,
							icon: 'success'
						})
						this.$db.del('userToken');
						uni.reLaunch({
							url: '/pages/login/index/index'
						})
					} else {
						this.$common.errorToShow(res.msg)
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/form.scss';
	
</style>
