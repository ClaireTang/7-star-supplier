<template name="WaitDelivered">
	<view>
		<view class="every">
			<view class="flex space-between top">
				<text>订单编号：UO-35645647465867</text>
				<button class="mini-btn" type="primary" plain="true" size="mini">复制</button>
			</view>
			<view class="flex space-between bottom">
				<!-- <view class="circleBox" @click.stop="inp(obj.id)">
					<image :src="`/static/bbh-shopCar/icon/${obj.check ? 'circleCacheef' : 'circleCachee'}.png`" class="circle"></image>
				</view> -->
				<view class="circleBox" @click.stop="inp()">
					<image :src="`/static/bbh-shopCar/icon/circleCachee.png`" class="circle"></image>
				</view>
				<view class="middle">
					<view class="content"><text class="text-color-grey">商品种类：</text>4</view>
					<view class="content"><text class="text-color-grey">下单时间：</text>2020-02-02 03:03:03</view>
					<view class="content"><text class="text-color-grey">支付金额：</text>￥4</view>
				</view>
				<uni-icons class="arrowright" type="arrowright" color="#8f8f94" size="16"/>
			</view>
		</view>
		<view class="every">
			<view class="flex space-between top">
				<text>订单编号：UO-35645647465867</text>
				<button class="mini-btn" type="primary" plain="true" size="mini">复制</button>
			</view>
			<view class="flex space-between bottom">
				<view class="circleBox" @click.stop="inp()">
					<image :src="`/static/bbh-shopCar/icon/circleCachee.png`" class="circle"></image>
				</view>
				<view class="middle">
					<view class="content"><text class="text-color-grey">商品种类：</text>4</view>
					<view class="content"><text class="text-color-grey">下单时间：</text>2020-02-02 03:03:03</view>
					<view class="content"><text class="text-color-grey">支付金额：</text>￥4</view>
				</view>
				<uni-icons class="arrowright" type="arrowright" color="#8f8f94" size="16"/>
			</view>
		</view>
	</view>
</template>

<script>
	/**
	 * WaitDelivered 待付款列表
	 * @property {Array} list 列表数组
	 */
	export default {
		name: 'WaitDelivered',
		props: {
			list: {
				type: Array,
				default () {
					return []
				}
			}
		},
		data() {
			return {
				
			}
		},
		methods: {
			onClickItem(e) {
				
			},
			inp(index) { //商品选择
				// for (var i = 0; i < this.list.length; i++) {
				// 	if (this.list[i].id == index) {
				// 		this.list[i].check = !this.list[i].check;
				// 		if (this.list[i].check == false) {	  		 //如果有条数据没选择，就取消全选
				// 			this.flag = false;
				// 			this.num -= 1;
				// 		} else {
				// 			this.num += 1;
				// 			if (this.num == this.list.length) {		//如果全部选中了
				// 				this.flag = true;
				// 			}
				// 		}
				// 		this.$emit("refresh",this.list);
				// 	}
				// }
				
			},
		}
	}
</script>

<style>
	@import '~@/static/css/common.scss';
</style>
