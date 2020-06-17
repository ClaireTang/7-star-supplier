<template>
	<view>
		<view class="every" v-for="(obj,key) in list" :key="key">
			<view class="flex space-between top">
				<text>订单编号：UO-35645647465867</text>
				<button class="mini-btn" type="primary" plain="true" size="mini" @click="copy(obj.sn)">复制</button>
			</view>
			<view class="flex space-between bottom" @click="goDetail(obj)">
				<view class="circleBox" @click.stop="inp(obj.id)">
					<image :src="`/static/bbh-shopCar/icon/${obj.check ? 'circleCacheef' : 'circleCachee'}.png`" class="circle"></image>
				</view>
				<view class="middle">
					<view class="content"><text class="text-color-grey">商品种类：</text>4</view>
					<view class="content"><text class="text-color-grey">下单时间：</text>2020-02-02 03:03:03</view>
					<view class="content"><text class="text-color-grey">支付金额：</text>￥4</view>
				</view>
				<uni-icons class="arrowright" type="arrowright" color="#8f8f94" size="16"/>
			</view>
		</view>
		<view class="allBox">
			<view>
				<view @click="all()">
					<image :src="`/static/bbh-shopCar/icon/${flag ? 'circleCacheef' : 'circleCachee'}.png`"></image>
					<text>全选</text>
				</view>
			</view>
			<view class="red" @click="cancelOrder()">驳回</view>
			<view class="blue" @click="deliver()">发货</view>
		</view>
	</view>
</template>

<script>
	/**
	 * WaitDelivered 待付款列表
	 * @property {Array} list 列表数组
	 */
	export default {
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
				flag  : false,				//判断是否全选
				num   : 0,                  //删除数据后，用来判断是否全选
			}
		},
		methods: {
			onClickItem(e) {
				
			},
			inp(index) { //商品选择
				for (var i = 0; i < this.list.length; i++) {
					// debugger
					if (this.list[i].id == index) {
						this.$set(this.list[i],'check',!this.list[i].check)
						if (this.list[i].check == false) {	  		 //如果有条数据没选择，就取消全选
							this.flag = false;
							this.num -= 1;
						} else {
							this.num += 1;
							if (this.num == this.list.length) {		//如果全部选中了
								this.flag = true;
							}
						}
					}
				}
				
			},
			all() { //全选
				this.flag = !this.flag;
				if (this.flag) {
					for (var i = 0; i < this.list.length; i++) {
						this.list[i].check = true;
					}
					this.num = this.list.length;
				} else {
					for (var i = 0; i < this.list.length; i++) {
						this.list[i].check = false;
					}
					this.num = 0;
				}
				// this.$emit("refresh",this.list);
			},
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
			goDetail(obj) {
				uni.navigateTo({
					url: '/pages/order/index/detail?id=' + obj.id
				})
			},
			cancelOrder() {
				
			},
			deliver() {
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	.every {
		margin-bottom: 20upx;
		background-color: #fff;
		.top,.bottom {
			padding: 20upx;
			border-bottom: 2upx solid $eee;
		}
		.content {
			margin: 20upx 0;
		}
		.middle {
			flex: 1;
		}
	}
	.cart-bottom {
		/*  #ifdef  H5  */
		bottom: 50px;
		/*  #endif  */
		/*  #ifndef  H5  */
		bottom: 0;
		/*  #endif  */
		z-index: 99;
		height: 90upx;
		width: 100%;
		background-color: #fff;
		position: fixed;
	
		overflow: hidden;
		box-shadow: 0 0 20upx #ccc;
	}
	.cart-bottom-right {
		height: 90upx;
		float: right;
		overflow: hidden;
	}
	.cart-bottom-right-t {
		display: inline-block;
		height: 100%;
		line-height: 90upx;
		margin-right: 20upx;
		font-size: 28upx;
		color: #666;
	}
	.cart-bottom-right-t .red-price {
		float: none;
	}
	.btn-square {
		float: right;
	}
	.cart-bottom .cart-checkbox-c {
		color: #333;
		font-size: 30upx;
	}
</style>
