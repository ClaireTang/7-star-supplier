<template>
	<view class="content">
		<u-parse :content="info.content" @preview="preview" @navigate="navigate" style="background-color: #fff;"/>
	</view>
</template>
<script>
	//视频和文本解析组件
	import uParse from '@/components/gaoyia-parse/parse.vue'
	export default {
		components: {
			uParse
		},
		data() {
			return {
				info: {
					title: '',
					content: '',
				}
			}
		},
		created() {
			this.$api.getAgreement({}, res => {
				if (res.status) {
					this.info = res.data;
					uni.setNavigationBarTitle({
						title: this.info.title
					});
				} else {
					this.$common.errorToShow(res.msg, res => {
						uni.navigateBack({
							delta: 1
						});
					});
				}
			});
		},
		methods: {
			preview(src, e) {
				// do something
			},
			navigate(href, e) {
				// do something
			}
		}
	}
</script>
<style lang="scss">
	.content {
		padding: 30rpx;
	}
</style>