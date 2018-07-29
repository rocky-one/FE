
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var path = require('path');
var webpackDevServer = require('webpack-dev-server');
// var setConfig = require('./webpack.base.config.js');
// var merge = require('webpack-merge');
var opn = require('opn');
// var config = setConfig('dlldev', 'development', 'main');
var { devport } = require('./constBase.js');
var dllDevConfig = {
	devtool: 'cheap-module-source-map',
	entry: {
		mvvm: path.resolve(__dirname, '../src/index.js'),
	},
	mode: 'development',
	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: '',
		filename: 'js/[name].[hash:8].js',
	},
	resolve: {
		extensions: ['.js', '.jsx', '.less'],
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env'],
					}
				}
			},
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			filename: 'index.html',
			template: path.resolve(__dirname, '../src/index.html'),
			inject: true
		})
	]
};
var newConfig = dllDevConfig;
//  热替换
Object.keys(newConfig.entry).forEach(function (name) {
	newConfig.entry[name] = [
		//'webpack-hot-middleware/client?path=http://localhost:'+devport+'/__webpack_hmr',
		`webpack-dev-server/client?http://localhost:${devport}/`,
		"webpack/hot/only-dev-server"
	].concat(newConfig.entry[name])
});
console.log(devport,'newConfig')
var compiler = webpack(newConfig);
var server = new webpackDevServer(compiler, {
	hot: true,
	port: devport,
	publicPath: '/',
	contentBase: path.join(__dirname, '../dist'),
	stats: {
		colors: true,
		modules: false,
		children: false,
		chunks: false,
		chunkModules: false,
		performance: false,
	},
});


opn(`http://localhost:${devport}/`);
server.listen(devport, function () {
	opn(`http://localhost:${devport}/`);
});

