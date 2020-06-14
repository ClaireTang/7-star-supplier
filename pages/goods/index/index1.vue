<template>
	<view>
		<xw-empty :isShow="emptyShow" text="暂无相关商品数据" textColor="#777777"></xw-empty>
		<navigator url="/pages/goods/index/creat" v-if="emptyShow">
			<button type="primary" plain="true" class="fz12 creat-goods" >创建商品</button>
		</navigator>
		<template v-if="!emptyShow">
			<uni-swipe-action class="goods">
			    <uni-swipe-action-item class="item-wrap" v-for="(obj, key) in list" :key="key" :options="options" @click="onClick" @change="change">
					<view class="contBox">
						<view class="circleBox" @click.stop="inp(obj.ID)">
							<image src="~@/static/bbh-shopCar/icon/circleCachee.png"  class="circle"  v-if="!obj.check"></image>
							<image src="~@/static/bbh-shopCar/icon/circleCacheef.png" class="circle"  v-if="obj.check"></image>
						</view>
						
						<view class="goodBox">
							<view class="flex">
								<image src="/static/image/camera.png" style="width: 50px;height:50px;margin-right: 10px;"></image>
								<view>{{obj.name}}</view>
								<view class="fz12 text-color-grey">{{obj.brief}}</view>
							</view>
							<!-- <view class="fz12 text-color-grey guige">
								<template v-if="obj.product.length>0">
									<view v-for="(item,i) in obj.product" :key="i+'1'">【{{item.spes_desc}}】：（￥{{item.costprice}}）</view>
								</template>
								<template v-else>
									<view>单位【{obj.unit}】：（￥{obj.costprice}）</view>
								</template>
							</view> -->
						</view>
					</view>
			    </uni-swipe-action-item>
			</uni-swipe-action>
			<view class="allBox">
				<view>
					<view @click="all()">
						<image src="~@/static/bbh-shopCar/icon/circleCacheef.png"  v-if="flag"></image>
						<image src="~@/static/bbh-shopCar/icon/circleCachee.png"   v-if="!flag"></image>
						<text>全选</text>
					</view>
				</view>
				<view @click="goPay()">删除</view>
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [
					// {ID:0,name:"苹果",check:false,price:12,count:1,stock:5,danwei:"斤",desc:"好吃"},
					// {ID:1,name:"香蕉",check:false,price:30,count:1,stock:15,danwei:"斤",desc:"好吃"},
					// {ID:2,name:"橘子",check:false,price:20,count:1,stock:3,danwei:"斤",desc:"好吃"},
					// {ID:3,name:"葡萄",check:false,price:5,count:1,stock:2,danwei:"斤",desc:"好吃"},
					// {ID:4,name:"火龙果",check:false,price:10,count:1,stock:6,danwei:"斤",desc:"好吃"}
				],
				emptyShow: false ,//true显示，false隐藏
				options:[
					{
						text: '编辑',
						style: {
							backgroundColor: '#007aff',
							borderRadius: '16rpx 0px 0px 16rpx'
						}
					}, {
						text: '删除',
						style: {
							backgroundColor: '#ff0900'
						}
					}
				],
				flag  : false,				//判断是否全选
				num   : 0 					//删除数据后，用来判断是否全选
			}
		},
		onLoad() {
			this.$api.goodsList({}, res => {
				this.list = res.data.data
				this.list.length > 0 ? this.emptyShow = false : this.emptyShow = true
			})
		},
		onShow() {
			
		},
		methods: {
			inp(index) { //商品选择
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].ID == index) {
						this.list[i].check = !this.list[i].check;
						if (this.list[i].check == false) {	  		 //如果有条数据没选择，就取消全选
							this.flag = false;
							this.num -= 1;
							
							this.$emit("refresh",this.list);
						} else {
							this.num += 1;
							
							if (this.num == this.list.length) {		//如果全部选中了
								this.flag = true;
							}
							this.$emit("refresh",this.list);
						}
					}
				}
			},
			removeM(id) { //商品删除
				var _this = this;
				for(var i = 0; i < this.list.length; i++) {
					var obj = this.list[i];
					if (obj.ID == id) {
						uni.showModal({
							title: '',
							content: '确定删除,不再看看吗',
							confirmText: '确定',
							success: function(res) {
								if (res.confirm) {
									_this.list.splice(i, 1);
									_this.$emit("refresh",_this.list);
									if (obj.check) {			//如果选中状态下删除
										_this.num--;
										_this.total();
									}
									if (_this.num == 0) {		//删除后还需要判断下当前的num是否跟当前的数据长度相同，是否显示全选
										_this.flag = false;
									} else {
										if (_this.num == _this.list.length) {
											_this.flag = true;
										}
									}
								}
							}
						});
						break;
					}
				}
			},
			all(index) { //全选
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
				this.$emit("refresh",this.list);
			},
			onClick(e){
				console.log('当前点击的是第'+e.index+'个按钮，点击内容是'+e.content.text)
			},
			change(open){
				console.log('当前开启状态：'+ open)
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	.goods {
		padding: 10upx;
		.item-wrap {
			margin-top: 20upx;
		}
	}
	.creat-goods {
		width: 200upx;
	}
	.contBox{
		width: 100%;
		height: 140upx;
		position: relative;
		z-index: 1;
		box-sizing: border-box;
		background:rgba(255,255,255,1);
		border-radius:16upx;
	}
	/* input选项 */
	.circleBox{
		width:88upx;
		height: 100%;
		display: flex;
		align-items: center;
		position: absolute;
		top: 0upx;
		left: 40upx;
		z-index: 2;
	}
	.circle{
		width: 48upx;
		height:48upx;
	} 
	/* 主体内容 */
	.goodBox{
		width: 700upx;
		height: 140upx;
		padding-left: 90upx;
		padding-top: 10upx;
		padding-bottom: 10upx;
		box-sizing: border-box;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
		/* background: #f5f5f5; */
		margin: 0 auto;
		border-radius: 16upx;
		border: 1upx solid #eeeeee;
		box-shadow: #eee 0 0 6upx 2upx;
	}
	/* 底部样式 */
	.allBox {
		width: 100%;
		height: 98upx;
		position: fixed;
		bottom: 0upx;
		left: 0upx;
		display: flex;
		z-index: 1001;
		border: 2upx solid #e0e0e0;
	}
	.allBox image {
		width: 44upx;
		height: 44upx;
		margin-right:12upx;
		vertical-align: middle;
		margin-top: -8upx;
	}
	.allBox>view:nth-of-type(1) {
		flex-grow: 1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 32upx;
		font-weight: 300;
		color: rgba(20, 23, 30, 1);
		padding: 0upx 46upx 0upx 42upx;
		background: white;
	}
	.allBox>view:nth-of-type(2) {
		width: 260upx;
		height: 100%;
		line-height: 98upx;
		text-align: center;
		color: white;
		font-size: 32upx;
		font-weight: bold;
		background: #ff0900;
	}
</style>