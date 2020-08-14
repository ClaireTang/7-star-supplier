<template>
	<view class="auth">
		<view class="form">
			<view class="flex form-item">
				<view class="form-title">商户名称</view>
				<input class="form-item-input" type="text" v-model="form.name"/>
			</view>
			<view class="flex form-item">
				<view class="form-title">负责人姓名</view>
				<input class="form-item-input" type="text" v-model="form.principal" />
			</view>
			<view class="flex form-item">
				<view class="form-title">负责人身份证</view>
				<input class="form-item-input" type="idcard" v-model="form.id_card"/>
			</view>
			<view class="flex form-item">
				<view class="form-title">收款账号</view>
				<input class="form-item-input" type="number" v-model="form.shroff_account_number"/>
			</view>
			<view class="flex form-item">
				<view class="form-title">省市区</view>
				<view class="flex space-between threeSelect">
					<picker mode="multiSelector" @columnchange="bindMultiPickerColumnChange" @change="sure" :value="multiIndex" :range="multiArray" range-key="name">
						<view v-if="!isChoose">请选择</view>
						<view class="uni-input" v-else>{{multiArray[0][multiIndex[0]].name}}，{{multiArray[1][multiIndex[1]].name}}，{{multiArray[2][multiIndex[2]].name}}</view>
					</picker>
					<!-- <uni-icons class="arrowright" type="arrowright" color="#8f8f94" size="16"/> -->
				</view>
			</view>
			<view class="flex form-item">
				<view class="form-title">详细地址</view>
				<input class="form-item-input" type="text" v-model="form.addre_detail"/>
			</view>
			<view class="flex form-item">
				<view class="form-title">打款周期</view>
				<!-- <view class="uni-list"> -->
					<radio-group @change="radioChange" class="flex">
						<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in cycleList" :key="item.value">
							<view>
								<radio :value="item.value" :checked="index === current" color="#FFCC33"/>
							</view>
							<view>{{item.name}}</view>
						</label>
					</radio-group>
				<!-- </view> -->
			</view>
			<view class="flex space-between align-items-top form-item-other">
				<view class="form-title">
					<view>商户营业执照</view>
					<view class="text-color-grey fsz24">照片清晰,不超过2M</view>
				</view>
				<view class="form-image">
					<view class="img-item" v-for="(item, key) in business_license_images" :key="key">
						<image class="del" src="/static/image/del.png" mode="" @click="delImage(item,business_license_images)"></image>
						<image class="" :src="item.url" mode="" @click="clickImg(item.url)"></image>
					</view>
					<view class="upload-img" v-show="isImage(business_license_image_max,business_license_images)" @click="upImage(business_license_image_max,business_license_images)">
						<image class="icon" src="/static/image/camera.png" mode=""></image>
						<view class="">上传照片</view>
					</view>
				</view>
			</view>
			<view class="flex space-between align-items-top form-item-other">
				<view class="form-title">
					<view>食品经营许可证</view>
					<view class="text-color-grey fsz24">照片清晰,不超过2M</view>
				</view>
				<view class="form-image">
					<view class="img-item" v-for="(item, key) in food_trade_permit_images" :key="key">
						<image class="del" src="/static/image/del.png" mode="" @click="delImage(item,food_trade_permit_images)"></image>
						<image class="" :src="item.url" mode="" @click="clickImg(item.url)"></image>
					</view>
					<view class="upload-img" v-show="isImage(food_trade_permit_image_max,food_trade_permit_images)" @click="upImage(food_trade_permit_image_max,food_trade_permit_images)">
						<image class="icon" src="/static/image/camera.png" mode=""></image>
						<view class="">上传照片</view>
					</view>
				</view>
			</view>
			<view class="flex space-between align-items-top form-item-other">
				<view class="form-title">
					<view>商户logo</view>
					<view class="text-color-grey fsz24">照片清晰,不超过2M</view>
				</view>
				<view class="form-image">
					<view class="img-item" v-for="(item, key) in logo_images" :key="key">
						<image class="del" src="/static/image/del.png" mode="" @click="delImage(item,logo_images)"></image>
						<image class="" :src="item.url" mode="" @click="clickImg(item.url)"></image>
					</view>
					<view class="upload-img" v-show="isImage(logo_image_max,logo_images)" @click="upImage(logo_image_max,logo_images)">
						<image class="icon" src="/static/image/camera.png" mode=""></image>
						<view class="">上传照片</view>
					</view>
				</view>
			</view>
		</view>
		<view class="btn-bottom">
			<view class="fsz24 text-center agreement">
				认证即代表你同意<text @click="goAgreement()" class="color-o">用户协议</text>
			</view>
			<button type="primary" class="btn-block"  @click="submitAuth" hover-class="btn-hover2" :disabled='submitStatus' :loading='submitStatus'>提交认证</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				business_license_images:[],
				business_license_image_max: 1,
				food_trade_permit_images:[],
				food_trade_permit_image_max: 1,
				logo_images: [],
				logo_image_max: 1,
				form: {
					id: 0,
					name: '',
					principal: '',
					id_card: '',
					shroff_account_number:'',
					business_license: '',
					food_trade_permit: '',
					logo: '',
					address: 0,
					addre_detail: '',
					bank_mobile: '',
					day: '30'
				},
				current: 2,
				isChoose: false,
				multiIndex: [0, 0, 0],
				multiArray: [],
				submitStatus: false,
				//打款周期列表
				cycleList: [
					// {
					// 	value: '7',
					// 	name: '7',
					// },
					{
						value: '15',
						name: '15',
					},
					{
						value: '30',
						name: '30',
						checked: true
					},
				]
			}
		},
		computed: {
			isImage() {
				return function (image_max,images) {
					let num = image_max - images.length;
					if(num > 0) {
						return true;
					}else{
						return false;
					}
				}
			}
		},
		onShow() {
			// 需要刷新的写这里
		},
		onLoad() {
			let that = this
			this.$api.userInfo({}, res => {
				if(res.state > 0) {
					this.form = res.data
					let address;
					if(res.data.address.province && res.data.address.city){
						address = res.data.address
					} else {
						address = {
							province: that.$db.get('ProvinceList')[0],
							city: that.$db.get('CityList')[0],
							country: that.$db.get('AreaList')[0],
						};
					}
					console.log(address)
					this.makeMultiArrayANDIndex(address)
					if(res.data.business_license) {
						this.business_license_images.push(res.data.business_license)
					}
					if(res.data.food_trade_permit) {
						this.food_trade_permit_images.push(res.data.food_trade_permit)
					}
					if(res.data.logo) {
						this.logo_images.push(res.data.logo)
					}
				}	
			})
		},
		methods: {
			// 获取省市区全部数据和默认id组合
			async makeMultiArrayANDIndex (address) {
				this.$set(this.multiArray, 0 , this.$db.get("ProvinceList"))
				this.$set(this.multiArray, 1 , await this.getList(address.province.id))
				this.$set(this.multiArray, 2 , await this.getList(address.city.id))
				this.makeMultiIndex(address)
				console.log(this.multiArray,'ooooo')
				console.log(this.multiIndex,'yyyyy')
				this.isChoose = true
			},
			makeMultiIndex(address) {
				this.$set(this.multiIndex, 0, this.getIndex(this.multiArray[0],address.province.id))
				this.$set(this.multiIndex, 1, this.getIndex(this.multiArray[1],address.city.id))
				this.$set(this.multiIndex, 2, this.getIndex(this.multiArray[2],address.country.id))
			},
			getIndex (arr,id) {
				let index = arr.findIndex((value, index, arr) => {
					return value.id == id
				})
				return index
			},
			async bindMultiPickerColumnChange (e) {
				console.log('修改的列为：' + e.detail.column + '，值为：' + e.detail.value)
				this.multiIndex[e.detail.column] = e.detail.value
				console.log(this.multiIndex,'ttttttt')
				
				switch (e.detail.column) {
					//拖动第1列
					case 0: 
						//获取市信息
						let provide_id = this.multiArray[0][e.detail.value].id
						let city_result = await this.getList(provide_id)
						this.$db.set("CityList", city_result)
						this.$set(this.multiArray,1,city_result)
						//获取区域信息
						let city_id_1 = city_result[0].id
						let area_result = await this.getList(city_id_1)
						this.$db.set("AreaList", area_result)
						this.$set(this.multiArray,2,area_result)
						
						this.multiIndex.splice(1, 1, 0)
						this.multiIndex.splice(2, 1, 0)
						break
					//拖动第2列
					case 1: 
						//获取区信息
						let city_id_2 = this.multiArray[1][e.detail.value].id
						
						let area_result_2 = await this.getList(city_id_2)
						this.$db.set("AreaList", area_result_2)
						this.$set(this.multiArray,2,area_result_2)
						
						this.multiIndex.splice(2, 1, 0)
						break
				}
				this.$forceUpdate()
			},
			// 获取单独省市区数据
			getList(id) {
				return new Promise((resolve, reject) => {
					this.$api.getAreaList({id:id}, res => {
						if (res.state) {
							resolve(res.data)
						} else {
							reject(res.data)
						}
					});
				})
			},
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
			// 信息验证  
			checkData (data) {
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				this.submitStatus = false;
				if (!data.name) {
					this.$common.errorToShow('请输入商户名称')
					return false
				}else if (!data.principal) {
					this.$common.errorToShow('请输入负责人姓名')
					return false
				}else if (reg.test(data.id_card) === false) {
					this.$common.errorToShow('请输入正确的身份证号')
					return false
				}else if (!data.shroff_account_number) {
					this.$common.errorToShow('请输入收款账号')
					return false
				}else if (!data.address) {
					this.$common.errorToShow('请选择省市区')
					return false
				}else if (!data.addre_detail) {
					this.$common.errorToShow('请输入商户地址详细信息')
					return false
				}else if (!data.business_license) {
					this.$common.errorToShow('请上传营业执照')
					return false
				} else {
					return true
				}
			},
			returnId (data) {
				if(data.length > 0) {
					return data[0].id
				}else{
					return ''
				}
			},
			//提交认证信息
			submitAuth() {
				this.submitStatus = true;
				// 处理省市区取最后的id
				this.form.address = this.multiArray[2][this.multiIndex[2]].id
				// 处理图片类
				this.form.business_license = this.returnId(this.business_license_images)
				this.form.food_trade_permit = this.returnId(this.food_trade_permit_images)
				this.form.logo = this.returnId(this.logo_images)
				//处理打款周期
				this.form.day = this.cycleList[this.current].value
				if(this.checkData(this.form)){
					this.$api.editBusinessInfo(this.form, res => {
							this.$common.successToShow('提交成功', result => {
								this.submitStatus = false;
								uni.navigateBack({
									delta: 2
								});
							});
						},res => {
							this.submitStatus = false;
						}
					);
				}
				
			},
			sure(e) {
				this.isChoose = true
			},
			radioChange: function(evt) {
				for (let i = 0; i < this.cycleList.length; i++) {
					if (this.cycleList[i].value === evt.target.value) {
						this.current = i;
						this.cycleList[i].checked = true
						break;
					} else {
						this.cycleList[i].checked = false
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '~@/static/css/common.scss';
	.auth{
		padding: 20upx;
		height: 100%;
	}
	.form-item {
		margin-bottom : 20upx;
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
		.form-title {
			padding-top: 26rpx;
			flex: 1 1 auto;
		}
		.form-image {
			flex-basis: 170upx;
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
		color: #999999;
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
		z-index: 999;
	}
	.btn-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		z-index: 66;
	}
	
	.agreement {
		padding: 20upx;
	}
	.threeSelect {
		flex: 1 1 auto;
		input {
			font-size: $fz12;
		}
		.arrowright {
			padding-top: 6upx;
		}
	}
	.uni-list {
	    background-color: #fff;
	    position: relative;
	    width: 100%;
	    display: flex;
	    // -webkit-box-orient: vertical;
	    flex-direction: column;
	}
	.uni-list-cell {
	    position: relative;
	    display: flex;
	    flex-direction: row;
	    justify-content: space-between;
	    align-items: center;
	}
	.uni-list-cell {
		justify-content: flex-start
	}
	.uni-list-cell-pd {
	    padding: 11px 15px;
	}
	/deep/ .auth .uni-radio-input.uni-radio-input-checked {
		background-color: #0099ff !important;
		border-color: #0099ff !important;
	}
</style>
