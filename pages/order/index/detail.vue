<template>
	<view class="detail">
		<uni-list class="basic">
			<uni-list-item title="订单编号: UO-325432324" :show-arrow="false"></uni-list-item>
			<uni-list-item title="收货人: TYC" :show-arrow="false">
				<template v-slot:right="">
					19937230070
				</template>
			</uni-list-item>
			<uni-list-item title="配送地址: 驻马店市驿城区华尔大厦" :show-arrow="false"></uni-list-item>
			<uni-list-item title="下单时间: 2020-03-03 03:03:03" :show-arrow="false"></uni-list-item>
			<!-- <uni-list-item title="货品清单" :show-arrow="false"></uni-list-item> -->
		</uni-list>
		<view class="goods-list">
			<!-- <uni-section title="货品清单" type="line" subTitle="(4种)"></uni-section> -->
			<!-- <uni-list class="basic">
				<uni-list-item title="货品清单" :show-arrow="false"></uni-list-item>
			</uni-list> -->
			<view class="line">货品清单</view>
			<table class="full-table">
				<tr>
					<th>商品名称</th>
					<th>规格</th>
					<th>单位</th>
					<th>单价(元)</th>
					<th>数量</th>
					<th>小计(元)</th>
				</tr>
				<tr>
					<td>娃娃菜</td>
					<td>3个/包</td>
					<td></td>
					<td>10</td>
					<td>3</td>
					<td>30</td>
				</tr>
				<tr>
					<td>豆腐</td>
					<td></td>
					<td>斤</td>
					<td>10</td>
					<td>3</td>
					<td>30</td>
				</tr>
			</table>
			<view class="line">买家备注：多拿一个袋子</view>
			<view class="line money">金额：<text class="red">￥636</text></view>
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.detail {
		background-color: $eee;
		padding: 10px 0 0;
		> view{
			margin-bottom: 20upx;
		}
	}
	.goods-list {
		background-color: #fff;
		.line {
			// line-height: 2;
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
	
</style>
