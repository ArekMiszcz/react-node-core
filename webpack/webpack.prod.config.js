const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = env => {
	console.log(env);

	return {
		entry: [
			path.join(__dirname, '/../index.js')
		],
		module: {
			rules: [{
				test: /\.(js|jsx)$/,
					exclude: /node_modules/,
					loader: 'babel-loader'
				},{
					test: /\.less$/,
					loaders: ["style-loader", "css-loader", "less-loader"]
				}
			]
		},
		plugins: [
			new HtmlWebpackPlugin({
				template: 'tmpl/index.html'
			}),
			new webpack.DefinePlugin({ 
				'JSON_SERVER': JSON.stringify(env.JSON_SERVER),
				'BASIC_AUTH': JSON.stringify(env.BASIC_AUTH)
			})
		],
		output: {
			path: __dirname + '/../dist',
			filename: 'bundle.js'
		}
	}
};