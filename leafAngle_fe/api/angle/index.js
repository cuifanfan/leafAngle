import request from "../request"

export function uploadImg(params) {
	request({
		url: '/angle/uploadImg',
		method: 'POST',
		filePath: params.filePath,
		name: 'file',
	}).then(res => {
		params.success && params.success(res)

	}).catch(err => {
		params.fail && params.fail(err)
	})
}
export function chooseImg(params) {
	uni.chooseImage({
		/**
		 * @param {Number} count 最多可以选择的图片张数，默认9
		 * @param {Array} sizeType 可以指定是原图还是压缩图，默认二者都有
		 * @param {Array} sourceType album 从相册选图，camera 使用相机，默认二者都有
		 */
		count: params.count || 1,
		sizeType: params.sizeType || ['original', 'compressed'],
		sourceType: params.sourceType || ['album', 'camera'],
		success: params.success
	});
}

export function previewImg(img) {
	uni.previewImage({
		urls: [img],
	})
}

export function deleteImg(params) {
	uni.showModal({
		title: params.title || '删除图片',
		content: params.content || '确认删除图片？',
		success: params.success
	})
}
