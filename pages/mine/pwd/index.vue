<template>
	<view class="content">
		<view class="form">
			<view class="form-item">
				<input :password="hidePwd" type="text" v-model="oldPassword" focus placeholder="请输入旧密码" placeholder-class="fsz26">
			</view>
			<view class="form-item">
				<input :password="hidePwd" type="text" v-model="password" placeholder="请输入6-16位新密码" placeholder-class="fsz26">
			</view>
			<view class="form-item">
				<input :password="hidePwd" type="text" v-model="surePassword" placeholder="请输入6-16位新密码" placeholder-class="fsz26">
			</view>
			<view class="flex space-between fsz24 text-color-grey">
				<view>▶ 密码由6-20个字母、数字、下划线, 区分大小写</view>
				<view :class="cupIconclass" @click="hidePwd=!hidePwd"></view>
			</view>
			<view class="bottom">
				<button :class="operButtonClass" @click="fixPwdHandler" hover-class="btn-hover">修改密码</button>
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
				hidePwd: true,
				iconclass: 'iconfont',
				oldPassword: '',
				password: '',
				surePassword: '', 
				btnb: 'btn btn-c btn-square btn-all' //按钮背景
			}
		},
		computed: {
			// 动态更改登录按钮bg
			operButtonClass() {
				return this.oldPassword && this.password && this.password===this.surePassword ? this.btnb + ' btn-blue' : this.btnb;
			},
			cupIconclass() {
				return this.hidePwd ? `${this.iconclass} icon-eye` : `${this.iconclass} icon-icon-login-02`;
			}
		},
		methods: {
			//校验密码：只能输入6-16个字母、数字、下划线  
			isPasswd(s) {  
				var patrn=/^(\w){6,16}$/;  
				if (!patrn.exec(s)) return false
				return true
			},
			fixPwdHandler() {
				if(!this.isPasswd(this.password)) {
					this.$common.errorToShow('新密码不符合规则');
					return false;
				}
				if(this.password === this.oldPassword) {
					this.$common.errorToShow('新密码不能与旧密码相同');
					return false;
				}
				this.toFixPwd()
			},
			toFixPwd() {
				let data = {
					oldPassword: this.oldPassword,
					password: this.password,
				};
				
				this.$api.fixPwd(data, res => {
					if (res.state > 0) {
						uni.showToast({
							title: `修改密码成功`,
							icon: 'success'
						})
						uni.navigateBack({
							delta: 1
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
	@import '~@/static/iconfont/iconfont.css';
	@import '~@/static/css/form.scss';
</style>
