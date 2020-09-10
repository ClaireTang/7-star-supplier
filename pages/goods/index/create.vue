<template>
	<view class="create">
		<view class="form">
			<view class="flex form-item">
				<view class="form-title">商品名称</view>
				<input class="form-item-input" type="text" placeholder="名称" v-model="form.name"/>
			</view>
			<view class="flex form-item">
				<view class="form-title">商品分类</view>
				<view class="form-item-input">
					<view class="flex space-between" @tap="linkageVisibleCate=true">
						<text v-if="cate_result.value.length === 0">请选择</text>
						<text v-else>{{cate_result.result}}</text>
						<uni-icons class="arrowright" type="arrowright" color="#8f8f94" size="16"/>
					</view>
					<w-picker
						:visible.sync="linkageVisibleCate"
						mode="linkage"
						:value="defaultRegionCate"
						:options="cateList"
						:level="2"
						default-type="id"
						:default-props="defaultPropsCate"
						@confirm="onConfirmCate($event,'linkage')"
						@cancel="onCancel"
						ref="linkage" 
					></w-picker>
				</view>
			</view>
			<view class="flex form-item">
				<view class="form-title">商品类别</view>
				<view class="form-item-input">
					<view class="flex space-between" @tap="selectorVisible=true">
						<text v-if="!type_result.value">请选择</text>
						<text v-else>{{type_result.result}}</text>
						<uni-icons class="arrowright" type="arrowright" color="#8f8f94" size="16"/>
					</view>
					<w-picker
						:visible.sync="selectorVisible"
						mode="selector"
						:value="defaultRegionType"
						:options="typeList"
						default-type="name"
						:default-props="defaultPropsType"
						@confirm="onConfirmType($event,'selector')"
						@cancel="onCancel"
						ref="selector" 
					></w-picker>
				</view>
			</view>
			<view class="form-item">
				<view class="form-title">商品描述</view>
				<textarea @blur="bindTextAreaBlur" placeholder="商品简单描述" placeholder-style="font-size:12px" v-model="form.brief" class="textarea"/>
			</view>
			<view class="form-item-other">
				<view class="form-title">
					<view>商品图片<text class="text-color-grey fsz24"> （默认第一张为主图） </text></view>
					<view class="text-color-grey fsz24">照片清晰,不超过2M，最多4张</view>
				</view>
				<view class="form-image">
					<view class="img-item" v-for="(item, key) in form.images" :key="key">
						<image class="del" src="/static/image/del.png" mode="" @click="delImage(item,form.images)"></image>
						<image class="" :src="item.url" mode="" @click="clickImg(item.url)"></image>
					</view>
					<view class="upload-img" v-show="isImage(4,form.images)" @click="upImage(4,form.images)">
						<image class="icon" src="/static/image/camera.png" mode=""></image>
						<view class="">上传照片</view>
					</view>
				</view>
			</view>
			<view class="flex space-between form-item">
				<view>是否开启规格：<span class="text-color-grey fsz24">开启前需选择商品类型</span></view>
				<switch :disabled="!form.goods_type_id" :checked="switchChecked" style="transform:scale(0.7)" @change="specRelSwitch"/>
			</view>
			<template v-if="!switchChecked">
				<uni-card title="未开启规格时"  extra="">
					<view class="flex form-item">
						<view class="form-title">商品单位</view>
						<input class="form-item-input" type="text" placeholder="单位名称" v-model="form.unit"/>
					</view>
					<view class="flex form-item">
						<view class="form-title">商品销售价</view>
						<view class="flex">
							<text>￥</text>
							<input class="form-item-input" type="digit" placeholder="只填数字" v-model="form.price"/>
						</view>
					</view>
					<view class="flex form-item">
						<view class="form-title">商品成本价</view>
						<view class="flex">
							<text>￥</text>
							<input class="form-item-input" type="digit" placeholder="非必填,只填数字" v-model="form.costprice"/>
						</view>
					</view>
					<view class="flex form-item">
						<view class="form-title">商品市场价</view>
						<view class="flex">
							<text>￥</text>
							<input class="form-item-input" type="digit" placeholder="非必填,只填数字" v-model="form.mktprice"/>
						</view>
					</view>
					<view class="flex form-item no-border">
						<view class="form-title">修改库存</view>
						<input class="form-item-input" type="text" placeholder="正数时添加库存，负数时减少库存" v-model="form.fixStock"/>
					</view>
					<view class="text-right">
						还剩库存:{{form.stock}}, 冻结库存: {{form.freeze_stock}}
					</view>
				</uni-card>
			</template>
			<template v-else>
				<uni-card title="开启规格时"  extra="">
				    <view class="flex" v-for="(item1, s) in specRel" :key="item1.id">
				    	<text>{{item1.name}}</text>
				    	<helang-checkbox class="self" ref="checkbox" @change="valueChange"></helang-checkbox>
				    </view>
				    <view class="text-center">
				    	<button type="primary" size="mini" @click="makeSpecRel">生成规格</button>
				    </view>
				    <template v-if="form.product.length > 0">
				    	<view class="flex contBox" v-for="(obj, i) in form.product" :key="i">
				    		<view>
								<view>
									<view class="img-item" v-for="(item, k) in obj.images" :key="k" v-if="obj.images.length>0">
										<image class="del" src="/static/image/del.png" mode="" @click="delImage(item,obj.images)"></image>
										<image class="" :src="item.url" mode="" @click="clickImg(item.url)"></image>
									</view>
									<view class="upload-img" v-show="isImage(1,obj.images)" @click="upImage(1,obj.images)">
										<image class="icon" src="/static/image/camera.png" mode=""></image>
										<view class="">上传照片</view>
									</view>
								</view>
								<view class="flex space-around">
									<uni-icons type="checkbox" :color="obj.is_defalut == 1?'#007aff':'#8f8f94'" size="25" @click="changeDefault(form.product,i)"/>
									<uni-icons type="trash" color="#8f8f94" size="25" @click="delSpecRel(i,form.product)"/>
								</view>
				    			
				    		</view>
				    		<view class="midBox">
				    			<view class="m-b-10 text-center">{{obj.spes_desc}}</view>
								<view class="flex space-between m-b-10">
									<view class="flex">
										<text class="fsz24">销售价:￥</text>
										<input class="price" type="text" v-model="obj.price" />
									</view>
									<view class="flex">
										<text class="fsz24">成本价:￥</text>
										<input class="price" type="text" v-model="obj.costprice" />
									</view>
								</view>
				    			<view class="flex space-between m-b-10">
									<view class="flex">
										<text class="fsz24">市场价:￥</text>
										<input class="price" type="text" v-model="obj.mktprice" />
									</view>
									<view class="flex">
										<text class="fsz24">修改库存:</text>
										<input class="price" type="text" v-model="obj.fixStock" />
									</view>
								</view>
								<view class="fsz24 text-right">
									还剩库存:{{obj.stock}}，冻结库存: {{obj.freeze_stock}}
								</view>
				    		</view>
				    	</view>
				    </template>
				</uni-card>
			</template>
			<template v-if="userGrade.length > 0">
				<uni-card title="商品优惠"  extra="填入优惠差价">
				    <view :class="u === userGrade.length - 1 ? 'flex form-item no-border' : 'flex form-item' " v-for="(priceItem,u) in userGrade" :key="u">
				    	<view class="form-title">{{priceItem.name}}</view>
				    	<view class="flex">
				    		<text>￥</text>
				    		<input class="form-item-input" type="digit" placeholder="" v-model="form.goods_grade[priceItem.id]"/>
				    	</view>
				    </view>
				</uni-card>
			</template>
			<view class="flex space-between form-item no-border">
				<view>是否上架：</view>
				<switch :checked="isUp" style="transform:scale(0.7)" @change="isUp=!isUp"/>
			</view>
			<button type="primary" class="btn-block" @click="create">提交</button>
		</view>
	</view>
</template>

<script>
	let id_result = []
	let val_result = []
	export default {
		data() {
			return {
				title: '',
				form: {
					g_id: 0,
					name: '',
					goods_cat_id: 0,
					goods_type_id: 0,
					brief: "",
					images:[],
					// image_id: '',
					unit: '',
					costprice: '',		//成本价
					price: '',			//销售价
					mktprice: '',		//市场价
					fixStock: '',		//修改库存；为正数时，添加库存，负数时减少库存
					stock: 0,			//库存还有数量
					freeze_stock: 0,	//冻结库存数量
					marketable: 2,
					spes_desc: {},
					product: [],
					goods_grade: {}		//优惠价格集合
				},
				
				linkageVisibleCate: false,
				defaultRegionCate:[],
				cateList: [],
				defaultPropsCate:{
					label:"name",
					value:"id",
					children:"child"
				},
				cate_result:{result: "",value:[],obj:{}},
				
				selectorVisible: false,
				defaultRegionType: "",
				typeList: [],
				defaultPropsType:{
					label:"name",
					value:"id",
				},
				type_result:{result: "",value:"",obj:{}},
				switchChecked: false,
				
				specRel: [],
				spesDescList: [],
				
				userGrade: [],
				isUp: false				//是否上架
			}
		},
		computed: {
			isImage() {
				return function (image_max,images) {
					if(Array.isArray(images)){
						let num = image_max - images.length;
						if(num > 0) {
							return true;
						}else{
							return false;
						}
					}
				}
			}
		},
		onLoad: function (option) { //option为object类型，会序列化上个页面传递的参数
			this.getData(option)
		},
		onShow() {
			id_result = []
			val_result = []
		},
		onReady() {
			uni.setNavigationBarTitle({
				title: `${this.title}商品`
			});
		},
		methods: {
			async getData(option) {
				this.cateList = await this.getCateList()
				this.typeList = await this.getTypeList()
				this.userGrade = await this.getUserGrade()
				
				if(option.goods_id) {
					this.title = '修改'
					let detailData = await this.goodsDetail(option.goods_id)
					// this.form = detailData
					this.form.g_id = detailData.id
					this.form.name = detailData.name
					this.form.brief = detailData.brief
					this.form.goods_cat_id = detailData.goods_cat_id
					this.form.goods_type_id = detailData.goods_type_id
					this.form.unit = detailData.unit
					this.form.costprice = detailData.costprice
					this.form.price = detailData.price
					this.form.mktprice = detailData.mktprice
					this.form.marketable = detailData.marketable
					this.form.spes_desc = detailData.spes_desc
					this.form.product = detailData.product
					this.form.goods_grade = detailData.goods_grade
					this.form.stock = detailData.stock
					this.form.freeze_stock = detailData.freeze_stock
					//产品分类
					this.makeCateArr(detailData.category)
					this.cate_result = {
						result: val_result.join(''),
						value: id_result
					}
					//产品类型
					this.type_result = {
						result: detailData.type.name,
						value: detailData.type.id
					}
					//产品图片
					if(detailData.mast_image) {
						if(detailData.slave_image) {
							this.$set(this.form,'images',[detailData.mast_image].concat(detailData.slave_image))
						}else{
							this.$set(this.form,'images',[detailData.mast_image] )
						}
					}else{
						this.$set(this.form,'images',[] )
					}
					//产品规格
					if(this.form.spes_desc) {
						this.switchChecked = true
						this.specRel = await this.getSpecRelData();
						let finalArr = this.flatSpecIdArr(detailData.spes_desc)
						//给选中的规格赋选中样式checked=true
						finalArr.forEach((item1,key1) => {
							this.specRel.forEach((item2,key2) => {
								item2.get_spec_value.forEach((item3,key3) => {
									if(item3.id == item1) {
										item3.checked = true
									}
								})
							})
						})
						this.$nextTick(()=>{
							this.specRel.forEach((item,index)=>{
								/* 设置 复选框 */
								this.$refs.checkbox[index].set({
									type:'checkbox',
									list: item.get_spec_value
								});
							})
						})
						detailData.product.forEach((item,key) => {
							this.$set(this.form.product[key],'fixStock','')
							if(!item.images) {
								// item.images = []
								this.$set(this.form.product[key],'images',[])
							} else {
								// item.images = [item.images]
								this.$set(this.form.product[key],'images',[item.images])
							}
						})
					}
					// 上架状态
					this.isUp = this.form.marketable === 1 ?  true : false
					
				}else{
					this.userGrade.map((val,key) => {
						this.$set(this.form.goods_grade,val.id,'')
					})
					this.title = '新增'
				}
			},
			flatSpecIdArr(data) {
				let flatArr = []
				let value = Object.values(data)
				value.forEach((item,key) => {
					flatArr = flatArr.concat(Object.keys(item))
				})
				return flatArr
			},
			goodsDetail(id) {
				return new Promise((resolve,reject) => {
					this.$api.goodsDetail({goods_id: id},res => {
						resolve(res.data)
					})
				})
			},
			makeCateArr(data) {
				id_result.unshift(data.id)
				val_result.unshift(data.name)
				if(data.parents) {
					let newData = data.parents
					this.makeCateArr(newData)
				}
			},
			getCateList() {
				return new Promise((resolve, reject) => {
					this.$api.categories({}, res => {
						if (res.state) {
							resolve(res.data)
						} else {
							reject(res.data)
						}
					});
				})
			},
			getTypeList() {
				return new Promise((resolve, reject) => {
					this.$api.typegories({}, res => {
						if (res.state) {
							resolve(res.data)
						} else {
							reject(res.data)
						}
					});
				})
			},
			getUserGrade() {
				return new Promise((resolve, reject) => {
					this.$api.getUserGrade({}, res => {
						if (res.state) {
							resolve(res.data)
						} else {
							reject(res.data)
						}
					});
				})
			},
			bindTextAreaBlur: function (e) {
				console.log(e.detail.value)
			},
			onConfirmCate(res){
				this.cate_result = res;
				this.form.goods_cat_id = res.value[res.value.length - 1]
			},
			onConfirmType(res){
				this.type_result = res;
				this.form.goods_type_id = this.type_result.value
			},
			onCancel(){},
			//上传图片
			upImage(image_max,images) {
				let num = image_max - images.length;
				if(num > 0){
					this.$api.uploadImage(num, res => {
						if(res.state){
							images.push(res.data);
							this.$common.successToShow("上传成功");
						}else{
							this.$common.errorToShow(res.msg);
						}
					});
				}
			},
			//删除图片
			delImage(e,images) {
				// debugger
				for(var i = 0; i < images.length; i++) {
					if(images[i].id == e.id){
						images.splice(i,1)
						return true
					}
				}
			},
			// 图片点击放大
			clickImg (img) {
				// 预览图片
				uni.previewImage({
					urls: img.split()
				});
			},
			//开启规格开关，展示所有规格选项
			specRelSwitch(e) {
				this.switchChecked = e.target.value
				this.showSpecRel()
			},
			//展示所有规格选项，数据改为组件需要的格式
			async showSpecRel() {
				if(this.switchChecked) {
					this.specRel = await this.getSpecRelData();
					this.$nextTick(()=>{
						// this.fit(this.specRel)
						this.specRel.forEach((item,index)=>{
							/* 设置 复选框 */
							this.$refs.checkbox[index].set({
								type:'checkbox',
								list: item.get_spec_value
							});
						})
					})
				}
			},
			//请求类型对应的所有属性规格，原始数据
			getSpecRelData() {
				return new Promise((resolve,reject) => {
					this.$api.specRel({type_id: this.form.goods_type_id},res => {
						// 将原 value 替换为 text
						let data = JSON.parse(JSON.stringify(res.data).replace(/"value"/g,'"text"'));
						resolve(data)
					})
				})
			},
			//点击生成规格
			makeSpecRel() {
				this.getCheckedSpecRelData()
				if(this.spesDescList.length > 0) {
					this.form.product = this.transform(this.spesDescList)
				} else {
					this.$common.errorToShow('请选择规格')
				}
				// console.log(this.specRel,'specRel')
				// console.log(this.form.product,'product')
			},
			// 获取 已选项的值组合
			getCheckedSpecRelData() {
				this.spesDescList = []
				this.specRel.forEach((item,index) => {
					let data = this.$refs.checkbox[index].get();   // 组件返回的数据
					if(data) {
						let mid_data = JSON.parse(JSON.stringify(data))
						mid_data.forEach((val,key) => {
							val.text = `${item.name}:${val.text}`
						})
						this.spesDescList.push(mid_data)
					}
				})
			},
			//由选中规格生成product列表项
			transform(data, result = [], path = [], level = 0) {
				for (const { text } of data[level]) {
					path.push(text)
					if (level < data.length - 1) {
					  this.transform(data, result, path, level + 1)
					} else {
					  result.push({
						spes_desc: path.join(','),
						is_defalut: `${+!result.length}`,
						price:"",
						costprice:"",
						mktprice:"",
						fixStock: "",
						stock:"0",
						freeze_stock:"0",
						images: [],
						image_id:""
					  })
					}
					path.pop()
				}
				return result
			},
			//切换product默认项
			changeDefault(arr,key) {
				arr[key].is_defalut = "1"
				arr.map((item,j) => {
					if(j == key) {
						return arr[j].is_defalut = "1"    //1未默认2非默认
					}else{
						return arr[j].is_defalut = "2"
					}
				})
			},
			//删除一个规格组合
			delSpecRel(key,arr) {
				for(var i = 0; i < arr.length; i++) {
					if(i == key){
						arr.splice(i,1)
						return true
					}
				}
			},
			create() {
				if(this.checkData(this.form)) {
					// 处理this.form.spes_desc
					if(this.switchChecked) {
						this.form.spes_desc = {}
						this.specRel.forEach((item,key) => {
							let obj = {}
							item.get_spec_value.forEach((v,i) => {
								if(v.checked) {
									obj[v.id] = v.text
								}
							})
							if(JSON.stringify(obj) !== "{}") this.form.spes_desc[item.name] = obj;
						})
						// 将未开启时的单位和价格取消
						this.form.unit = ''
						this.form.costprice = ''
						this.form.price = ''
						this.form.mktprice = ''
						this.form.stock = ''
					}else{
						this.form.spes_desc = {}
						this.form.product = []
						this.specRel = []
						this.spesDescList = []
					}
					//是否上架
					this.isUp ? this.form.marketable = 1 : this.form.marketable = 2
					//处理优惠等级
					let goods_grade_keys = Object.keys(this.form.goods_grade)
					this.userGrade.map((val,key) => {
						if(goods_grade_keys.indexOf(String(val.id)) === -1) {
							this.form.goods_grade[val.id] = 0
						}
					})
					console.log(this.form,'this.form')
					this.$api.goodsInsert(this.form, res => {
							this.$common.successToShow('提交成功', result => {
								// uni.navigateBack({
								// 	url: '/pages/goods/index/index'
								// })
								uni.navigateBack({
									delta: 1
								});
							});
						},res => {}
					);
				}
			},
			isInteger(obj) {
				return obj !== null && obj !== undefined && obj !== NaN && obj%1 === 0
			},
			checkData(data) {
				if (!data.name) {
					this.$common.errorToShow('请输入商品名称')
					return false
				}
				if(!data.goods_cat_id) {
					this.$common.errorToShow('请选择商品分类')
					return false
				}
				if(!data.goods_type_id) {
					this.$common.errorToShow('请选择商品类型')
					return false
				}
				if(data.images.length==0) {
					this.$common.errorToShow('请上传商品图片')
					return false
				}
				if(!this.switchChecked && !this.isInteger(data.fixStock)) {
					this.$common.errorToShow('修改库存值不正确，应为整数')
					return false
				}
				if(this.switchChecked) {
					if(data.product.length == 0) {
						this.$common.errorToShow('请生成规格')
						return false
					}
					let c = true
					for(let i = 0; i < data.product.length; i++) {
						if(!this.isInteger(data.product[i].fixStock)) {
							c = false
							this.$common.errorToShow(`第${i+1}行规格商品，修改库存值不正确，应为整数`)
							break
						}
					}
					return c
				}else {
					if(!data.unit) {
						this.$common.errorToShow('请输入商品单位')
						return false
					}
					if(!data.price) {
						this.$common.errorToShow('请输入商品销售价')
						return false
					}
				}
				return true
			},
			valueChange(e) {
				// console.log(e,'ooooooooooooo')
			},
		}
	}

</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	.create{
		padding: 40upx 20upx;
		height: 100%;
	}
	.form-item {
		// margin-bottom : 20upx;
		padding: 10upx 0;
		border-bottom: 1px solid #eee;
		.form-title {
			padding: 10upx 0;
			width: 220upx;
		}
		.form-item-input {
			padding: 10upx;
			font-size: $fz14;
			flex: 1 1 auto;
		}
	}
	.form-item-other {
		border-bottom: 1px solid #eee;
		.form-title {
			padding-top: 26rpx;
			flex: 1 1 auto;
		}
		.form-image {
			flex-basis: 170upx;
			margin-top: 10upx;
		}
	}
	.form-image{
		overflow: hidden;
		text-align: right;
	}
	.upload-img{
		width: 146upx;
		height: 146upx;
		margin: 14upx;
		text-align: center;
		color: #999;
		font-size: 22upx;
		border: 2upx solid #eee;
		border-radius: 4upx;
		display: inline-block;
		padding: 24upx 0;
	}
	.img-item{
		width: 166upx;
		height: 166upx;
		padding: 10upx;
		float: left;
		position: relative;
	}
	.img-item:nth-child(4n){
		margin-right: 0;
	}
	.img-item image{
		width: 100%;
		height: 100%;
	}
	.del{
		width: 30upx !important;
		height: 30upx !important;
		position: absolute;
		right: 0;
		top: 0;
		z-index: 200;
	}
	.textarea {
		width: 100%;
		padding-right: 40upx;
		height: 120upx;
	}
	/deep/ .self > uni-view {
		padding: 10upx;
		margin: 0;
		.item {
			line-height: normal; 
			padding: 5px;
			&.active {
				color: #0099FF;
				border: 1px solid #0099FF;
				&::before {
					background-color: #0099ff;
				}
			}
		}
	}
	.contBox {
		width: 100%;
		padding: 10upx 10upx 10upx 0;
		border-radius: 16upx;
		border: 1upx solid $eee;
		margin: 20upx 0;
	}

	.logo {
		width: 50px;
		height: 50px;
		background-color: #eee;
		margin-right: 20upx;
	}
	.midBox {
		flex: 1 1 auto;
	}
	.price {
		width: 100upx;
		border: 1px solid $eee;
		padding: 8upx 10upx;
	}
	.uni-card {
		margin-left: 0;
		margin-right: 0;
	}
	/deep/ .uni-card__header-title-text {
		font-size: inherit;
	}
	
	.no-border {
		border: none;
	}
</style>
