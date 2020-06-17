<template>
	<view class="">
		<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="text" active-color="#0099ff"></uni-segmented-control>
		<xw-empty :isShow="list.length === 0" text="暂无相关订单数据" textColor="#777777"></xw-empty>
		<view class="order" v-if="list.length > 0">
			<view v-if="current === 0">
				<wait-delivered :list="list"></wait-delivered>
			</view>
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				items: ['待发货','未送达','未付款','全部'],
				current: 0,
				// emptyShow: false ,//true显示，false隐藏
				list: [
					{sn:"UO-25453243524",id: 1},
					{sn:"UO-25453243524",id: 2}
				]
			}
		},
		methods: {
			onClickItem(e) {
				
			},
			
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	.order {
		background-color: #eee;
		padding: 20upx 0 0;
	}
	/deep/ .segmented-control {
		border-top: 2upx solid $eee;
		.segmented-control__item--text {
				margin: 0 24upx;
			}
	}
	/deep/ .order uni-button {
		padding: 0 .34em;
		line-height: 1.2;
		margin: 0;
	}
	
</style>
