<template>
	<view class="goods">
		<xw-empty :isShow="emptyShow" text="暂无相关商品数据" textColor="#777777"></xw-empty>
		<navigator url="/pages/goods/index/creat" v-if="emptyShow">
			<button type="primary" plain="true" class="fz12 creat-goods" >创建商品</button>
		</navigator>
		<template v-if="!emptyShow">
			<uni-swipe-action >
			    <uni-swipe-action-item v-for="(obj, key) in list" :key="key" :options="options" @click="swipeClick($event,key,obj)">
					<view class="flex contWrap">
						<view class="circleBox" @click.stop="inp(obj.id)">
							<image :src="`/static/bbh-shopCar/icon/${obj.check ? 'circleCacheef' : 'circleCachee'}.png`" class="circle"></image>
						</view>
						<view class="goodBox">
							<view class="flex">
								<image :src="obj.mast_image ? obj.mast_image.url : '/static/image/touxiang.png'"></image>
								<view>
									<view>{{obj.name}}</view>
									<view class="fz12 text-color-grey">{{obj.brief}}</view>
								</view>
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
			<uni-load-more :status="status"  :icon-size="16" />
			<view class="allBox">
				<view>
					<view @click="all()">
						<image :src="`/static/bbh-shopCar/icon/${flag ? 'circleCacheef' : 'circleCachee'}.png`"></image>
						<text>全选</text>
					</view>
				</view>
				<view class="del" @click="arrDel()">删除</view>
				<!-- #ifdef MP-WEIXIN -->
					<navigator class="add" url="/page/goods/index/create">
						新增
					</navigator>
				<!-- #endif -->
			</view>
		</template>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				emptyShow: false ,//true显示，false隐藏
				options:[
					{
						text: '编辑',
						style: {
							backgroundColor: '#0099ff',
						}
					}, {
						text: '删除',
						style: {
							backgroundColor: '#ff0900'
						}
					}
				],
				flag  : false,				//判断是否全选
				num   : 0,                  //删除数据后，用来判断是否全选
				status: 'more',
				page_num: 1,
				total_num: ""
			}
		},
		onLoad() {
			// location.reload()
		},
		onShow() {
			//刷新页面
			this.list = []
			this.page_num = 1
			this.total_num = ''
			this.status = "more"
			this.flag = false
			this.num = 0
			this.getList(this.page_num)
		},
		onNavigationBarButtonTap(e) {
			uni.navigateTo({
				url: '/pages/goods/index/create'
			})
		},
		onReachBottom() {
			if(this.status == 'more') {
				this.page_num ++;
				this.getList(this.page_num);
			}
		},
		methods: {
			getList(num) {
				this.status = 'loading';
				this.$api.goodsList({page:num}, res => {
					this.total_num = res.data.last_page
					let newData = res.data.data
					newData.forEach((item,key) => {
						this.$set(item,'check',false)
					})
					this.list = this.list.concat(newData)
					
					this.status = this.total_num == this.page_num ? 'noMore' : 'more'
					this.list.length > 0 ? this.emptyShow = false : this.emptyShow = true
				})
			},
			inp(index) { //商品选择
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].id == index) {
						this.list[i].check = !this.list[i].check;
						if (this.list[i].check == false) {	  		 //如果有条数据没选择，就取消全选
							this.flag = false;
							this.num -= 1;
						} else {
							this.num += 1;
							if (this.num == this.list.length) {		//如果全部选中了
								this.flag = true;
							}
						}
						this.$emit("refresh",this.list);
					}
				}
				
			},
			removeM(id) { //商品删除
				var _this = this;
				for(var i = 0; i < this.list.length; i++) {
					var obj = this.list[i];
					if (obj.id == id) {
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
			swipeClick(e,index,obj) {
				let {
					content
				} = e
				if (content.text === '删除') {
					uni.showModal({
						title: '提示',
						content: '是否删除',
						success: (res) => {
							if (res.confirm) {
								let data = [obj.id]
								this.toDelGoods(data)
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				} else if (content.text === '编辑') {
					uni.navigateTo({
						url: '/pages/goods/index/create?goods_id=' + obj.id
					});
				} else {
					uni.showToast({
						title: `点击了${e.content.text}按钮`,
						icon: 'none'
					})
				}
			},
			arrDel() {
				let data = []
				this.list.forEach((item,key) => {
					if(item.check) data.push(item.id)
				})
				console.log(data,'data')
				this.toDelGoods(data)
			},
			toDelGoods(data) {
				if(data.length === 0) {
					this.$common.errorToShow('请选择商品')
					return false
				}else{
					this.$api.goodsDel({id:data}, res => {
						//刷新页面
						this.list = []
						this.page_num = 1
						this.total_num = ''
						this.status = "more"
						this.flag = false
						this.num = 0						this.getList(this.page_num)
						
						this.$common.successToShow("删除成功")
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	.goods {
		padding-bottom: 100upx;
	}
	.creat-goods {
		width: 200upx;
	}
	.contWrap {
		flex: 1;
		padding: 20upx;
		font-size: 28upx;
		border-bottom: 2upx solid $eee;
	}
	/* input选项 */
	.circleBox{
		padding: 0 60upx 0 20upx;
	}
	.circle{
		width: 48upx;
		height:48upx;
	} 
	/* 主体内容 */
	.goodBox{
		flex: 1 1 auto;
		image {
			width: 100upx;
			height:100upx;
			margin-right: 20upx;
		}
	}
	/* 底部样式 */
	.allBox {
		width: 100%;
		height: 98upx;
		position: fixed;
		bottom: var(--window-bottom);
		left: 0upx;
		display: flex;
		z-index: 201;
		border: 1upx solid $eee;
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
	.allBox>.del {
		width: 25%;
		height: 100%;
		line-height: 98upx;
		text-align: center;
		color: white;
		font-size: 32upx;
		font-weight: bold;
		background: #ff0900;
	}
	.allBox>.add {
		width: 25%;
		height: 100%;
		line-height: 98upx;
		text-align: center;
		color: white;
		font-size: 32upx;
		font-weight: bold;
		background: #0099ff;
	}
</style>