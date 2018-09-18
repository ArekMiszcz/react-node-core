const webpack = require('webpack');
const path = require('path');

module.exports = env => ({
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
		new webpack.DefinePlugin({
			'JSON_SERVER': JSON.stringify(env.JSON_SERVER),
			'BASIC_AUTH': null
		})
	],
    output: {
        path: __dirname + '/../dist',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: __dirname + '/../dist',
        historyApiFallback: true
    }
});