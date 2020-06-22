<template>
	<view class="order">
		<view class="navbar">
			<view 
				v-for="(item, index) in navList" :key="index" 
				class="nav-item" 
				:class="{current: tabCurrentIndex === index}"
				@click="tabClick(index)"
			>
				{{item.text}}
			</view>
		</view>
		<!-- tabItem.loaded === true && tabItem.orderList.length === 0 -->
		<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">   
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<xw-empty :isShow="tabItem.loaded === true && tabItem.orderList.length === 0" text="暂无相关订单数据" textColor="#777777"></xw-empty>
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="scrolltolower">
					<view class="every" v-for="(obj,key) in tabItem.orderList" :key="key">
						<view class="flex space-between top">
							<text>订单编号：{{obj.order_id}}</text>
							<button class="mini-btn" type="primary" plain="true" size="mini" @click="copy(obj.order_id)">复制</button>
						</view>
						<view class="flex space-between bottom" @click="goDetail(obj)">
							<view class="middle">
								<view class="content">
									<text class="text-color-grey">状态：</text>
									<text class="blue">【{{formatPayStatus(obj.pay_status)}}】</text>
									<text v-if="obj.confirm === 2">【{{formatConfirmStatus(obj.confirm)}}】</text>
									<text class="red" v-else>【{{formatShipStatus(obj.ship_status)}}】</text>
									<text v-if="obj.pay_status===2">【{{obj.is_right ? '已开票' : '未开票'}}】</text>
								</view>
								<view class="content"><text class="text-color-grey">商品种类：</text>{{obj.goods_type_num}}</view>
								<view class="content"><text class="text-color-grey">下单时间：</text>{{$common.timeToDate(obj.utime)}}</view>
								<view class="content"><text class="text-color-grey">商品总价：</text>￥{{obj.goods_amount}}</view>
							</view>
							<uni-icons class="arrowright" type="arrowright" color="#8f8f94" size="16"/>
						</view>
					</view>
					<template v-if="tabItem.loaded === true && tabItem.orderList.length !== 0">
						<uni-load-more :status="tabItem.loadingType"  :icon-size="16" />
					</template>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	
	// status      订单状态 1=正常 2=完成 3=取消 4=已驳回
	export default {
		data() {
			return {
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '未付款',
						loadingType: 'more',
						orderList: [],
						isShow: false
					},
					{
						state: 1,
						text: '已付款',
						loadingType: 'more',
						orderList: [],
						isShow: false
					}
					// {
					// 	state: 2,
					// 	text: '全部',
					// 	loadingType: 'more',
					// 	orderList: []
					// },
				],
				wait_page: 1,
				wait_last_page: 1,
				has_page: 1,
				has_last_page: 1,
			}
		},
		onLoad(options){
			// 待付款
			let params = {pay_status: 1,page:this.wait_page}
			this.loadData('', params)
			/**
			 * 修复app端点击除全部订单外的按钮进入时不加载数据的问题
			 * 替换onLoad下代码即可
			 */
			// // #ifndef MP
			// this.loadData('', params)
			// // #endif
			// // #ifdef MP
			// console.log(options,'oooooo')
			// if(options.state == 0){
			// 	this.loadData('', params)
			// }
			// // #endif
		},
		onShow() {
			if(uni.getStorageSync("to")) {
				uni.removeStorage({
				    key: 'to',
				    success: function (res2) {
				        console.log('success');
				    }
				});
				let params = {pay_status: 1,page:this.wait_page}
				this.loadData('', params)
			}
		},
		methods: {
			//获取订单列表
			loadData(source,params,type){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				let state = navItem.state;
				if(source === 'tabChange' && navItem.loaded === true){
					//tab切换只有第一次需要加载数据
					return false;
				}
				if(navItem.loadingType === 'loading'){
					//防止重复加载
					return;
				}
				navItem.loadingType = 'loading';
				
				this.$api.allOrderList(params, res => {
					let result = res.data
					result.data.forEach(item=>{
						navItem.orderList.push(item);
					})
					if(params.pay_status === 1) {
						this.wait_last_page = result.last_page
						//判断是否还有数据， 有改为 more， 没有改为noMore
						navItem.loadingType = (result.current_page === this.wait_last_page) ? 'noMore' : 'more';
						//页面自增
						if(result.current_page <= this.wait_last_page) this.wait_page++
					}else if(params.pay_status === 2) {
						this.has_last_page = result.last_page
						navItem.loadingType = (result.current_page === this.has_last_page) ? 'noMore' : 'more';
						if(result.current_page <= this.has_last_page) this.has_page++
					}
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
					
					// if(navItem.loaded === true && navItem.orderList.length === 0 ) {
					// 	this.$set(navItem, 'isShow', true);
					// }
					// console.log(navItem,'navItem')
				})
			}, 
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
			},
			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				let params = {}
				switch (this.tabCurrentIndex) {
					case 0:
						params = {pay_status: 1,page:this.wait_page}
						this.loadData('tabChange',params)
						break;
					case 1:
						params = {pay_status: 2,page:this.has_page}
						this.loadData('tabChange',params)
						break;
					// case 2:
					// 	params = {page: this.wait_page}
					// 	this.loadData('tabChange',params)
					// 	break;
					default:
						break;
				}
			},
			//滚动到底
			scrolltolower() {
				if(this.tabCurrentIndex === 0) {
					if(this.wait_page <= this.wait_last_page) {
						let params ={pay_status: 1,page:this.wait_page}
						this.loadData('',params)
					}
				}else if(this.tabCurrentIndex === 1) {
					if(this.has_page <= this.has_last_page) {
						let params ={pay_status: 1,page:this.has_page}
						this.loadData('',params)
					}
				}else{
					
				}
				
			},
			//复制订单号
			copy(value){
				uni.setClipboardData({
					data:value,				//要被复制的内容
					success:()=>{			//复制成功的回调函数
					  uni.showToast({		//提示
						title:'复制成功'
					  })
					}
				});
			},
			//跳转详情页
			goDetail(obj) {
				uni.setStorage({
					key: 'to',
					data: 'detail',
				})
				uni.navigateTo({
					url: '/pages/order/detail/detail?order_id=' + obj.order_id
				})
				
			},
			//格式化支付状态
			formatPayStatus(value) {
				let pay_status = [
					{
						key: 1,
						name: "未付款"
					},
					{
						key: 2,
						name: "已付款"
					},
					{
						key: 3,
						name: "部分付款"
					},
					{
						key: 4,
						name: "部分退款"
					},
					{
						key: 5,
						name: "已退款"
					},
				]
				let item = pay_status.find((val,key) => {
					return val.key === value
				})
				return item.name
			},
			//格式化发货状态
			formatShipStatus(value) {
				let ship_status = [
					{
						key: 1,
						name: "未发货"
					},
					{
						key: 2,
						name: "部分发货"
					},
					{
						key: 3,
						name: "已发货"
					},
					{
						key: 4,
						name: "部分退货"
					},
					{
						key: 5,
						name: "已退货"
					},
				]
				let item = ship_status.find((val,key) => {
					/* if(value === 3) {
						//查询过滤条件为已发货，未确认收货
						val.name = '已发货'
					} */
					return val.key === value
				})
				return item.name
			},
			//格式化是否收货
			formatConfirmStatus(value) {
				let confirm_status = [
					{
						key: 1,
						name: "未收货"
					},
					{
						key: 2,
						name: "已收货"
					},
				]
				let item = confirm_status.find((val,key) => {
					return val.key === value
				})
				return item.name
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	page,.order{
		height: 100%;
	}
	.swiper-box{
		height: calc(100% - 40px);
	}
	.list-scroll-content{
		height: 100%;
		background-color: $eee;
	}
	.wait-delivered .list-scroll-content {
		height: calc(100% - 50px);
	}
	.navbar{
		display: flex;
		height: 40px;
		padding: 0 5px;
		background: #fff;
		box-shadow: 0 1px 5px rgba(0,0,0,.06);
		position: relative;
		z-index: 10;
		.nav-item{
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 15px;
			// color: $font-color-dark;
			position: relative;
			&.current{
				color: $theme-color;
				&:after{
					content: '';
					position: absolute;
					left: 50%;
					bottom: 0;
					transform: translateX(-50%);
					width: 88upx;
					height: 0;
					border-bottom: 2px solid $theme-color;
				}
			}
		}
	}
	.every {
		margin-top: 20upx;
		background-color: #fff;
		.top,.bottom {
			padding: 20upx;
			border-bottom: 2upx solid $eee;
		}
		.bottom {
			padding: 0 20upx;
		}
		.content {
			margin: 20upx 0;
		}
		.middle {
			flex: 1;
		}
	}
	/deep/ .every uni-button {
		padding: 0 .34em;
		line-height: 1.2;
		margin: 0;
	}
	.allBox{
		bottom: 0;
	}
	.blue {
		color: $theme-color;
	}
	.red {
		color: $red;
	}
</style>
