/*
	用于将我们css中对图片的调用改为相对引用
*/

module.exports = function (source, map) {
	console.log(arguments, map)
	if (process.env.NODE_ENV === 'production') {
		console.log('- ',source)
		return source.replace('__webpack_public_path__ + "contents', '"..')
	} else {
		return source
	}
}