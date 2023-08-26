<template>
	<view class="uni-container">

		<view class="control">
			<view class="control_item">
				<text>筛选</text>
			</view>
			<view class="control_item">
				<uni-collapse>
					<uni-collapse-item title="开始时间">
						<view class="content">
							<text class="text"></text>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view class="control_item">
				<uni-collapse>
					<uni-collapse-item title="结束时间">
						<view class="content">
							<text class="text"></text>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
			<view class="control_item">
				<uni-collapse>
					<uni-collapse-item title="地点">
						<view class="content">
							<text class="text"></text>
						</view>
					</uni-collapse-item>
				</uni-collapse>
			</view>
		</view>

		<uni-table ref="table" :loading="loading" border stripe type="selection" emptyText="暂无更多数据"
			@selection-change="selectionChange">
			<uni-tr>
				<uni-th align="center">植株id</uni-th>
				<uni-th align="center">角度大小</uni-th>
				<uni-th align="center">测量地点</uni-th>
				<uni-th align="center">测量时间</uni-th>
				<uni-th align="center">测量部位</uni-th>
				<uni-th align="center">备注</uni-th>
				<uni-th align="center">查看图片</uni-th>
			</uni-tr>
			<uni-tr v-for="(item, index) in tableData" :key="index">
				<uni-td align="center">{{ item.id }}</uni-td>
				<uni-td>
					<view align="center">{{ item.angle }}°</view>
				</uni-td>
				<uni-td align="center">{{ item.address }}</uni-td>
				<uni-td align="center">{{ item.date }}</uni-td>
				<uni-td align="center">{{ item.part }}</uni-td>
				<uni-td align="center">{{ item.desc }}</uni-td>
				<uni-td align="center">

					<view class="uni-group">
						<button class="uni-button" size="mini"
							style="background-color:#5fb585;color: aliceblue;">用户</button>
						<button class="uni-button" size="mini"
							style="background-color:#2dc4cd;color: aliceblue;">模型</button>
					</view>
				</uni-td>
			</uni-tr>
		</uni-table>
		<view class="uni-pagination-box">
			<uni-pagination show-icon :page-size="pageSize" :current="pageCurrent" :total="total" @change="change" />
		</view>
		<view class="export">
			<view class="export_options">
				<view>
					<uni-data-checkbox v-model="selectedOptions" multiple :localdata="excelOptions" />
				</view>
				<view style="margin-top: 4rpx ; margin-left: -35rpx;margin-right: 50rpx;">
					<label for="pet-select" class="export_count">下载页数：</label>
					<select name="" id="pet-select" style="outline: none;">
						<option value="1">10</option>
						<option value="2">2</option>
					</select>
				</view>
			</view>
			<view class="export_excel">
				<button class="uni-button" size="mini"
					style="background-color:#5fb585;color: aliceblue;">导出为Excel</button>
			</view>
		</view>
	</view>
	</view>
</template>
</template>

<script>
	import tableData from './tableData.js'
	export default {
		data() {
			return {
				searchVal: '',
				tableData: [],
				// 每页数据量
				pageSize: 9,
				// 当前页
				pageCurrent: 1,
				// 数据总量
				total: 0,
				loading: false,
				excelOptions: [{
					text: '下载图像',
					value: 0
				}],
				selectedOptions: [],
				count: 0,
			}
		},
		onLoad() {
			this.selectedIndexs = []
			this.getData(1)
		},
		methods: {
			// 多选处理
			selectedItems() {
				return this.selectedIndexs.map(i => this.tableData[i])
			},
			// 多选
			selectionChange(e) {
				console.log(e.detail.index)
				this.selectedIndexs = e.detail.index
			},
			//批量删除
			delTable() {
				console.log(this.selectedItems())
			},
			// 分页触发
			change(e) {
				this.$refs.table.clearSelection()
				this.selectedIndexs.length = 0
				this.getData(e.current)
			},
			// 搜索
			search() {
				this.getData(1, this.searchVal)
			},
			// 获取数据
			getData(pageCurrent, value = '') {
				this.loading = true
				this.pageCurrent = pageCurrent
				this.request({
					pageSize: this.pageSize,
					pageCurrent: pageCurrent,
					value: value,
					success: res => {
						// console.log('data', res);
						this.tableData = res.data
						this.total = res.total
						this.loading = false
					}
				})
			},
			// 伪request请求
			request(options) {
				const {
					pageSize,
					pageCurrent,
					success,
					value
				} = options
				let total = tableData.length
				let data = tableData.filter((item, index) => {
					const idx = index - (pageCurrent - 1) * pageSize
					return idx < pageSize && idx >= 0
				})
				if (value) {
					data = []
					tableData.forEach(item => {
						if (item.name.indexOf(value) !== -1) {
							data.push(item)
						}
					})
					total = data.length
				}

				setTimeout(() => {
					typeof success === 'function' &&
						success({
							data: data,
							total: total
						})
				}, 500)
			}
		}
	}
</script>


<style lang="less">
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}

	.export {
		display: flex;
		padding: 20rpx 30rpx;

		.export_options {
			display: flex;
		}

		.export_count {
			color: #555;
			font-size: 28rpx;

		}
	}

	.uni-group {
		display: flex;
		justify-content: space-around;
	}

	.control {
		display: flex;

		.control_item {
			flex: 1;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
