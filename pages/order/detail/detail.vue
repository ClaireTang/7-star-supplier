<template>
	<view class="detail">
		<uni-list class="basic">
			<uni-list-item :title="`订单编号: ${info.order_id}`" :show-arrow="false"></uni-list-item>
			<uni-list-item :title="`收货人: ${info.ship_name}`" :show-arrow="false">
				<template v-slot:right="">
					{{info.ship_mobile}}
				</template>
			</uni-list-item>
			<uni-list-item :title="`配送地址: ${info.address}`" :show-arrow="false"></uni-list-item>
			<uni-list-item :title="`下单时间: ${$common.timeToDate(info.utime)}`" :show-arrow="false"></uni-list-item>
		</uni-list>
		<view class="goods-list">
			<view class="line">货品清单(4种)</view>
			<table class="full-table">
				<tr>
					<th>商品名称</th>
					<th>规格</th>
					<th>单位</th>
					<th>单价(元)</th>
					<th>数量</th>
					<th>小计(元)</th>
				</tr>
				<tr v-for="(obj,key) in info.product">
					<td>{{obj.name}}</td>
					<td>{{obj.spes_desc}}</td>
					<td>{{obj.unit}}</td>
					<td>{{obj.costprice}}</td>
					<td>{{obj.nums}}</td>
					<td>{{obj.amount}}</td>
				</tr>
			</table>
			<view class="line money">金额: <text class="red">￥{{info.goods_amount}}</text></view>
			<view class="line">买家备注: {{info.memo}}</view>
			<template v-if="info.pay_status === 2">
				<view class="line">打款备注: {{info.remit_descr}}</view>
				<view class="line">打款时间: {{info.remit_time}}</view>
				<view class="line">发票信息: {{formatTax(info.tax_type)}}</view>
			</template>
			
		</view>
		<button type="primary" class="btn-block" @click="openTax(info.order_id)" v-if="info.pay_status === 2 && info.is_right === 0">开发票</button>
		<view class="flex space-between oper" v-if="info.ship_status==1">
			<view class="bt" @click="cancelOrder(info)">驳回</view>
			<view class="bt blue" @click="deliver(info)">发货</view>
		</view>
		<neil-modal :show="show" @close="closeModal" title="请输入驳回原因" @cancel="bindBtn('cancel')" @confirm="bindBtn('confirm',info)">
		    <textarea placeholder="原因" style="box-sizing:border-box;padding: 20px;height: 100px;width: 100%;overflow: hidden;" v-model="cause"/>
		</neil-modal>
	</view>
</template>

<script>
	export default {
		data () {
			return {
				info: {},
				show: false,
				cause: ''
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			this.getData(option)
		},
		methods: {
			getData(option) {
				this.$api.allOrderDetail({order_id: option.order_id}, res => {
					this.info = res.data
				})
			},
			// changeDate(value) {
			// 	return this.$common.timeToDate(value)
			// },
			//提交前整理数据
			makeOrderIds(obj) {
				let order_ids = []
				order_ids.push(obj.order_id)
				return order_ids
			},
			//发货
			deliver(obj) {
				let order_ids = this.makeOrderIds(obj)
				if(order_ids.length > 0) {
					this.useDeliverApi({order_ids:order_ids})
					uni.navigateBack({
						url: '/pages/order/index/index'
					})
				}
			},
			//调用发货接口
			useDeliverApi(data) {
				this.$api.shipments(data, res => {
					uni.navigateBack({
						url: '/pages/order/index/index'
					})
				})
			},
			//驳回
			cancelOrder(obj) {
				let order_ids = this.makeOrderIds(obj)
				if(order_ids.length > 0) {
					this.show = true
				}
			},
			//关闭驳回弹框
			closeModal(type) {
			    this.show = false
			},
			//点击驳回弹框按钮
			bindBtn(type,obj) {
				if(type==='confirm') {
					let order_ids = this.makeOrderIds(obj)
					this.useTurnDownApi({order_ids:order_ids,cause:this.cause})
				} else {
					this.$common.errorToShow('已取消驳回')
				}
			},
			//调用驳回接口
			useTurnDownApi(data) {
				this.$api.turnDown(data, res => {
					uni.switchTab({
						url: '/pages/order/index/index'
					})
				})
			},
			//开发票
			openTax(orderId) {
				this.$api.openTax({"order_id":orderId}, res => {
					uni.navigateBack({
						url: '/pages/order/receipt/index'
					})
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
			},
			//格式化发票信息
			formatTax(value) {
				let Tax_status = [
					{
						key: 1,
						name: "不需要发票"
					},
					{
						key: 2,
						name: "个人发票"
					},
					{
						key: 3,
						name: "公司发票"
					},
				]
				let item = Tax_status.find((val,key) => {
					return val.key === value
				})
				return item.name
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	.detail {
		background-color: $eee;
		padding: 10px 0 0;
		> view{
			margin-bottom: 20upx;
			&.oper {
				margin-bottom: 0;
			}
		}
	}
	.goods-list {
		background-color: #fff;
		.line {
			padding: 20upx 24upx;
			border-bottom: 2upx solid $eee;
			color: #3b4144;
			&.money {
				text-align: right;
			}
			.red {
				color: $red;
			}
		}
	}
	.full-table {
		width: 100%;
		text-align: center;
		th,td {
			padding: 10upx 8upx;
			border-bottom: 2upx solid $eee;
		}
		td {
			color: #777;
		}
	}
	.oper {
		position: fixed;
		bottom: 0;
		z-index: 98;
		width: 100%;
		text-align: center;
		margin-top: 20upx;
		box-shadow: inset 0px 6px 3px -6px $eee;
		.bt {
			flex: 1;
			line-height: 3;
			font-size: $fz18;
			&.blue {
				color: #fff;
				background-color: $theme-color;
			}
		}
	}
	
</style>
