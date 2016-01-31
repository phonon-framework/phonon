var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: './main.js',
	output: {
		path: path.resolve(__dirname, './dist'),
		publicPath: '/dist/',
		filename: 'build.js'
	},

	resolve: {
		root: [
			path.resolve('./../../dist/css'),
		]
	},

	module: {
		loaders: [
			{
				test: /\.vue$/,
				loader: 'vue'
			},
			{
				test: /\.js$/,
				loader: 'babel',
				query: {
					presets: ['es2015']
				},
				exclude: /node_modules/
			},
			{
				test: /\.json$/,
				loader: 'json'
			},
			{
				test: /\.(png|jpg|jpeg|gif|svg)$/,
				loader: 'url',
				query: {
					limit: 10000,
					name: '[name].[ext]?[hash]'
				}
			}
		]
	},
	devServer: {
		historyApiFallback: true,
		noInfo: true
	},
	devtool: 'eval-source-map'
};

if (process.env.NODE_ENV === 'production') {
	module.exports.devtool = 'source-map';
	// http://vuejs.github.io/vue-loader/workflow/production.html
	module.exports.plugins = (module.exports.plugins || []).concat([
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"'
			}
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			}
		}),
		new webpack.optimize.OccurenceOrderPlugin()
	]);
}
