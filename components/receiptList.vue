<template>
	<swiper :current="tabCurrentIndex" class="swiper-box" duration="300" @change="changeTab">
		<swiper-item class="tab-content" v-for="(tabItem,tabIndex) in navList" :key="tabIndex">
			<xw-empty :isShow="tabItem.loaded === true && tabItem.orderList.length === 0" text="暂无相关订单数据" textColor="#777777"></xw-empty>
			<scroll-view class="list-scroll-content" scroll-y @scrolltolower="scrolltolower">
				<view class="every" v-for="(obj,key) in tabItem.orderList" :key="key">
					<view class="flex space-between top">
						<text>订单编号：{{obj.order_id}}</text>
						<text class="blue">{{formatPayStatus(obj.pay_status)}}</text>
						<text class="red">{{formatShipStatus(obj.ship_status)}}</text>
						<button class="mini-btn" type="primary" plain="true" size="mini" @click="copy(obj.order_id)">复制</button>
					</view>
					<view class="flex space-between bottom" @click="goDetail(obj)">
						<view class="middle">
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
</template>

<script>
export default {
	name: 'ReceiptList',
	props: {
		tabCurrentIndex: {
			type: Number,
			default: 0
		},
		navList: {
			type: Array,
			default: []
		},
		page: {
			type: Number,
			default: 1,
		},
		lastPage: {
			type: Number,
			default: 1,
		}
	},
	data() {
		return {
			
		}
	},
	onLoad(options){	
	},
	onShow() {
	},
	methods: {
		//swiper 切换
		changeTab(e){
			this.tabCurrentIndex = e.target.current;
			let params = {}
			switch (this.tabCurrentIndex) {
				case 0:
					params = {pay_status: 1,page:tis.page}
					this.loadData('tabChange',params)
					break;
				case 1:
					params = {pay_status: 2,page:tis.page}
					this.loadData('tabChange',params)
					break;
				case 2:
					params = {page: this.page}
					this.loadData('tabChange',params)
					break;
				default:
					break;
			}
		},
		//滚动到底
		scrolltolower() {
			debugger
			if(this.page <= this.last_page) {
				let params ={pay_status: 1,page:this.page}
				this.loadData('',params)
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
				// url: '/pages/order/index/detail?order_id=' + obj.order_id
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
				if(value === 3) {
					//查询过滤条件为已发货，未确认收货
					val.name = '未送达'
				}
				return val.key === value
			})
			return item.name
		}
	}
}
</script>

<style>
	@import '~@/static/css/common.scss';
	.nodata {
		background-color: #fff;
	}
	.every {
		margin-top: 10px;
		background-color: #fff;		
	}
	.every .top {
		padding: 10px;
		border-bottom: 1px solid #eee;
	}
	.every .bottom {
		padding: 0 10px;
		border-bottom: 1px solid #eee;
	}
	.every .content {
		margin: 10px 0;
	}
	.every .middle {
		flex: 1;
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
		color: #0099FF;
	}
	.red {
		color: #FF0900;
	}
</style>
