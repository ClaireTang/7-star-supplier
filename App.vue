<script>
import { apiBaseUrl } from '@/config/config.js'
export default {
	onLaunch: function() {
		console.log('App Launch');
		// #ifdef APP-PLUS
		var server = `${apiBaseUrl}merapi/Upgrade/getAllVersion`; //检查更新地址  
		var req = { //升级检测数据  
			"type": 'merchant',
			"appid": plus.runtime.appid,
			"version": plus.runtime.version
		};
		plus.runtime.getProperty(plus.runtime.appid, function(widgetInfo) {
		    uni.request({  
		        url: server,  
		        data: req,  
		        success: (result) => {  
		            var data = result.data;  
		            if (data.update && data.wgtUrl) {  
		                uni.downloadFile({  
		                    url: data.wgtUrl,  
		                    success: (downloadResult) => {  
		                        if (downloadResult.statusCode === 200) {  
		                            plus.runtime.install(downloadResult.tempFilePath, {  
		                                force: false  
		                            }, function() {  
		                                console.log('install success...');  
		                                plus.runtime.restart();  
		                            }, function(e) {  
		                                console.error('install fail...');  
		                            });  
		                        }  
		                    }  
		                });  
		            } else if(data.update && data.pkgUrl) {
						uni.showModal({ //提醒用户更新
							title: "更新提示",
							content: data.note,
							success: (res2) => {
								if (res2.confirm) {
									plus.runtime.openURL(data.pkgUrl);
								}
							}
						})
					}
		        }  
		    });  
		});
		// #endif 
		//获取省信息
		this.$api.getAreaList({id:0}, res => {
			if (res.state) {
				this.$db.set('ProvinceList', res.data)
			} 
		});
		//获取市信息
		this.$api.getAreaList({id:110000}, res => {
			if (res.state) {
				this.$db.set('CityList', res.data)
			} 
		});
		//获取区信息
		this.$api.getAreaList({id:110100}, res => {
			if (res.state) {
				this.$db.set('AreaList', res.data)
			} 
		});
	},
	onShow: function() {
		console.log('App Show');
		// 获取用户token
		let userToken = this.$db.get("userToken");
		if (!userToken) {
			// this.$common.jumpToLogin();
			// return false;
		} else {
			this.$api.userInfo({}, res => {
				if (res.state) {
					this.$store.commit('audiStatus',res.data.state)
					console.log(this.$store.state.audiStatus,'onAppShow')
				}
			})
		}
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */

/*每个页面公共css */
@import './static/css/style.css';

.bgf {
	background: #FFF;
}

.flc {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.flc-inline {
	display: inline-flex;
	align-items: center;
}

.g5 {
	color: $g5;
}

.fz12 {
	font-size: $fz12;
}

.uni-image {
	vertical-align: middle;
}
</style>
