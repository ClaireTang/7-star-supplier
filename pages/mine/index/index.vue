<template>
	<view class="mine">
		<view class="flex login_status">
			<image :src="logoImg()" mode="aspectFill" class="wh130 br50"></image>
			<template v-if="hasLogin">
				<template v-if="!businessInfo.name">
					<navigator url="/pages/mine/auth/index" hover-class="navigator-hover">
						<text class="status link">未认证</text>
					</navigator>
				</template>
				<view v-else class="status">
					<text>{{businessInfo.name}}</text>
					<view>
						<text class="link fz12">{{businessInfo.state == 0 ? "待审核" : "审核通过"}}</text>
					</view>
				</view>
				
			</template>
			<template v-else>
				<navigator url="/pages/login/index/index" hover-class="navigator-hover">
					<text class="status link">未登录</text>
				</navigator>
			</template>
		</view>
		<view class="wrap first">
			<uni-list>
				<uni-list-item title="修改手机号" thumb="/static/image/fix-tel.png" @click="fixTel"></uni-list-item>
				<uni-list-item title="修改密码" thumb="/static/image/fix-pwd.png" @click="fixPwd"></uni-list-item>
			</uni-list>
		</view>
		<view class="wrap">
			<uni-list >
				<uni-list-item title="商家信息" thumb="/static/image/renzheng.png" @click="goAuth" v-if="businessInfo.state-0 === 0"></uni-list-item>
				<uni-list-item title="商家信息" thumb="/static/image/renzheng.png" note="联系平台修改信息"  :show-arrow="false" v-if="businessInfo.state-0 !== 0"></uni-list-item>
				<!-- <uni-list-item title="清除缓存" thumb="/static/image/clear-cache.png" @click="clearCache"></uni-list-item> -->
				<uni-list-item title="退出" thumb="/static/image/exit.png" v-if="hasLogin" @click="logOff"></uni-list-item>
			</uni-list>
		</view>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue'
import uniListItem from '@/components/uni-list-item/uni-list-item.vue'
export default {
	components: {
		uniList,
		uniListItem
	},
	data() {
		return {
			hasLogin: false,
			businessInfo: {}, // 商户信息
		}
	},
	computed: {},
	onLoad(e) {
		
	},
	onShow() {
		//需要刷新
		this.initData()
	},
	methods: {
		initData() {
			var _this = this
			// 获取用户信息
			if (this.$db.get('userToken')) {
				this.hasLogin = true
				this.$api.userInfo({}, res => {
					if (res.state) {
						_this.businessInfo = res.data
						_this.$store.commit('audiStatus',res.data.state)
					}
				})
			} else {
				this.hasLogin = false
				// #ifdef MP-WEIXIN
				this.getWxCode()
				// #endif
			}
		},
		getWxCode() {
			let _this = this
			uni.login({
				scopes: 'auth_user',
				success: function(res) {
					if (res.code) {
						_this.wxLoginStep1(res.code)
					} else {
						this.$common.errorToShow('未取得code')
					}
				},
				fail: function(res) {
					this.$common.errorToShow('用户授权失败wx.login')
				}
			})
		},
		wxLoginStep1(code) {
			this.$api.login1({
				code
			}, res => {
				if (res.status) {
					this.open_id = res.data
				} else {
					this.$common.errorToShow(res.msg, function() {
						uni.navigateBack({
							delta: 1
						})
					})
				}
			})
		},
		toLogin() {
			console.log('qu login')
		},
		logoImg() {
			return this.businessInfo.logo ? this.businessInfo.logo.url : '/static/image/touxiang.png'
		},
		goAuth() {
			if(!this.hasLogin){
				this.$common.errorToShow('请先登录')
				uni.navigateTo({
					url: '/pages/login/index/index'
				})
			} else {
				uni.navigateTo({
					url: '/pages/mine/auth/index'
				})
			}
		},
		fixTel() {
			this.judgeHasLogin()
			uni.navigateTo({
				url: '/pages/mine/tel/index'
			})
		},
		fixPwd() {
			this.judgeHasLogin()
			uni.navigateTo({
				url: '/pages/mine/pwd/index'
			})
		},
		judgeHasLogin () {
			if(!this.hasLogin){
				this.$common.errorToShow('请先登录')
				uni.navigateTo({
					url: '/pages/login/index/index'
				})
			}
		},
		// 清除缓存
		clearCache() {
		  // 删除地区缓存信息
		  this.$db.del('ProvinceList')
		  this.$db.del('CityList')
		  this.$db.del('AreaList')
		  setTimeout(() => {
		    this.$common.successToShow('清除成功')
		  }, 500)
		},
		// 退出登录
		logOff() {
		  this.$common.modelShow('退出', '确认退出登录吗?', () => {
		    this.$db.clear()
		    uni.reLaunch({
		      url: '/pages/mine/index/index'
		    })
		  })
		},
	},
	
	

}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	.login_status {
		padding: 60upx 20upx 110upx;
		font-size: 32upx;
		background: url('~@/static/image/mine-bg.png') no-repeat top right;
		background-size: contain;
		.status {
			padding: 20upx;
		}
		.link {
			color: $theme-color;
		}
	}
	.wh130 {
		width: 130upx;
		height: 130upx;
	}
	.br50 {
		border-radius: 50%;
	}
	.wrap {
		margin: 20upx;
		box-shadow: $eee 0px 0px 10px 3px;
	}
	.first {
		margin-top: -30upx;
	}
	
</style>
