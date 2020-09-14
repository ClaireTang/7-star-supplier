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
		<swiper :current="tabCurrentIndex" :class="tabCurrentIndex === 0 ? 'wait-delivered swiper-box' : 'swiper-box'" duration="300" @change="changeTab">   
			<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
				<xw-empty :isShow="tabItem.loaded === true && tabItem.orderList.length === 0" text="暂无相关订单数据" textColor="#777777"></xw-empty>
				<scroll-view class="list-scroll-content" scroll-y @scrolltolower="scrolltolower">
					<view class="every" v-for="(obj,key) in tabItem.orderList" :key="obj.order_id">
						<view class="flex space-between top">
							{{key+1}}
							<text>订单编号：{{obj.order_id}}</text>
							<button class="mini-btn" type="primary" plain="true" size="mini" @click="copy(obj.order_id)">复制</button>
						</view>
						<view class="flex space-between bottom" @click="goDetail(obj)">
							<view class="circleBox" @click.stop="inp(obj.order_id)" v-if="tabCurrentIndex===0">
								<image :src="`/static/bbh-shopCar/icon/${obj.check ? 'circleCacheef' : 'circleCachee'}.png`" class="circle"></image>
							</view>
							<view class="middle">
								<view class="content">
									<text class="text-color-grey">状态：</text>
									<!-- <text class="blue">【{{formatPayStatus(obj.pay_status)}}】</text> -->
									<text class="red" v-if="obj.confirm === 2">【{{formatConfirmStatus(obj.confirm)}}】</text>
									<text class="red" v-else>【{{formatShipStatus(obj.ship_status)}}】</text> 
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
				<view class="allBox" v-if="tabCurrentIndex === 0 && tabItem.orderList.length > 0">
					<view>
						<view @click="all()">
							<image :src="`/static/bbh-shopCar/icon/${flag ? 'circleCacheef' : 'circleCachee'}.png`"></image>
							<text>全选</text>
						</view>
					</view>
					<view class="red" @click="cancelOrder(tabItem.orderList)">驳回</view>
					<view class="blue" @click="deliver(tabItem.orderList)">发货</view>
				</view>
				<neil-modal :show="show" @close="closeModal" title="请输入驳回原因" @cancel="bindBtn('cancel')" @confirm="bindBtn('confirm',tabItem.orderList)">
				    <textarea placeholder="原因" style="box-sizing:border-box;padding: 20px;height: 100px;width: 100%;overflow: hidden;" v-model="cause"/>
				</neil-modal>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	
	// status      订单状态 1=正常 2=完成 3=取消 4=已驳回
	export default {
		data() {
			return {
				// items: ['待发货','已发货','未付款','全部'],
				tabCurrentIndex: 0,
				navList: [{
						state: 0,
						text: '待发货',
						loadingType: 'noMore',
						orderList: []
					},
					{
						state: 1,
						text: '已发货',
						loadingType: 'noMore',
						orderList: []
					},
					{
						state: 2,
						text: '全部',
						loadingType: 'more',
						orderList: []
					}
				],
				page: 1,
				last_page: 1,
				flag  : false,				//判断是否全选
				num   : 0,                  //修改数据后，用来判断是否全选
				show  : false,
				cause : ''
			}
		},
		onLoad(options){			
			// // 待发货
			// let params = {ship_status: 1}
			// this.loadData('', params)
		},
		onShow() {
			// if(uni.getStorageSync("to")) {
			// 	uni.removeStorage({
			// 	    key: 'to',
			// 	    success: function (res2) {
			// 	        console.log('success');
			// 	    }
			// 	});
			// 	let params = {ship_status: 1}
			// 	this.loadData('', params)
			// }
			this.resetState()
			this.depend()
		},
		methods: {
			//获取订单列表,,,全部订单会分页加载，其他状态订单一次性加载完
			loadData(source,params){
				//这里是将订单挂载到tab列表下
				let index = this.tabCurrentIndex;
				let navItem = this.navList[index];
				console.log(navItem.orderList)
				// if(source === 'tabChange' && navItem.loaded === true){
				// 	//tab切换只有第一次需要加载数据
				// 	return false;
				// }
				if(index === 2) {
					if(navItem.loadingType === 'loading'){
						//防止重复加载
						return false;
					}
					navItem.loadingType = 'loading';
				}
				this.$api.allOrderList(params, res => {
					let result = res.data
					if(this.tabCurrentIndex === 2) {
						this.last_page = result.last_page
						result.data.forEach(item=>{
							navItem.orderList.push(item);
						})
						//判断是否还有数据， 有改为 more， 没有改为noMore
						navItem.loadingType = (result.current_page === this.last_page) ? 'noMore' : 'more';
						if(result.current_page <= this.last_page) this.page++
					}else{
						this.$set(navItem,'orderList',result)
					}
					//loaded新字段用于表示数据加载完毕，如果为空可以显示空白页
					this.$set(navItem, 'loaded', true);
				})
			}, 
			//顶部tab点击
			tabClick(index){
				this.tabCurrentIndex = index;
				this.resetState()
			},
			//swiper 切换
			changeTab(e){
				this.tabCurrentIndex = e.target.current;
				this.resetState()
				this.depend()
			},
			//根据tabCurrentIndex确定传参
			depend() {
				let params = {}
				switch (this.tabCurrentIndex) {
					case 0:
						params = {ship_status: 1}
						break;
					case 1:
						params = {ship_status: 3,confirm: 1}
						break;
					case 2:
						params = Object.assign({},{page: this.page})
						break;
					default:
						break;
				}
				this.loadData('',params)
			},
			//切换到全部时，重置页码和数据列表
			resetState() {
				if(this.tabCurrentIndex === 2) {
					this.page = 1
					this.$set(this.navList[this.tabCurrentIndex],'orderList',[])
					this.$set(this.navList[this.tabCurrentIndex],'loadingType','more')
				}
			},
			//滚动到底
			scrolltolower() {
				if(this.tabCurrentIndex === 2) {
					if(this.page <= this.last_page) {
						let params = Object.assign({},{page: this.page})
						this.loadData('',params)
					}
				}
			},
			//订单选择check
			inp(index,data) { 
				let orderList = this.navList[this.tabCurrentIndex].orderList
				for (var i = 0; i < orderList.length; i++) {
					if (orderList[i].order_id == index) {
						this.$set(orderList[i],'check',!orderList[i].check)
						if (orderList[i].check == false) {	  		 //如果有条数据没选择，就取消全选
							this.flag = false;
							this.num -= 1;
						} else {
							this.num += 1;
							if (this.num == orderList.length) {		//如果全部选中了
								this.flag = true;
							}
						}
					}
				}
				
			},
			//全选
			all() { 
				let orderList = this.navList[this.tabCurrentIndex].orderList
				this.flag = !this.flag;
				if (this.flag) {
					for (var i = 0; i < orderList.length; i++) {
						orderList[i].check = true;
					}
					this.num = orderList.length;
				} else {
					for (var i = 0; i < orderList.length; i++) {
						orderList[i].check = false;
					}
					this.num = 0;
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
				// uni.setStorage({
				// 	key: 'to',
				// 	data: 'detail',
				// })
				uni.navigateTo({
					url: '/pages/order/detail/detail?order_id=' + obj.order_id
				})
				
			},
			//提交前整理数据
			makeOrderIds(list) {
				let order_ids = []
				list.forEach((item,key) => {
					if(item.check ) order_ids.push(item.order_id)
				})
				if(order_ids.length === 0) {
					this.$common.errorToShow('请选择订单！')
				}
				return order_ids
			},
			//发货
			deliver(list) {
				let order_ids = this.makeOrderIds(list)
				if(order_ids.length > 0) {
					this.useDeliverApi({order_ids:order_ids})
				}
			},
			//调用发货接口
			useDeliverApi(data) {
				this.$api.shipments(data, res => {
					let params = {ship_status: 1}
					this.loadData('',params)
				})
			},
			//驳回
			cancelOrder(list) {
				let order_ids = this.makeOrderIds(list)
				if(order_ids.length > 0) {
					this.show = true
				}
			},
			//关闭驳回弹框
			closeModal(type) {
			    this.show = false
			},
			//点击驳回弹框按钮
			bindBtn(type,list) {
				if(type==='confirm') {
					let order_ids = this.makeOrderIds(list)
					this.useTurnDownApi({order_ids:order_ids,cause:this.cause})
				} else {
					this.$common.errorToShow('已取消驳回')
				}
			},
			//调用驳回接口
			useTurnDownApi(data) {
				this.$api.turnDown(data, res => {
					let params = {ship_status: 1}
					this.loadData('',params)
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
