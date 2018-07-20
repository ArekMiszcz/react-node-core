const path = require('path');

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
    output: {
        path: __dirname + '/../dist',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: __dirname + '/../dist',
        historyApiFallback: true
    }
};