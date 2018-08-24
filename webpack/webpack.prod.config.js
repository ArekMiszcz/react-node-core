const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
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
		})
	],
    output: {
        path: __dirname + '/../dist',
        filename: 'bundle.js'
    }
};