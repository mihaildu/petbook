var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : false,
    entry: "./src/root.js",
    module: {
	rules: [
	    {
		test: /\.js$/,
		exclude: /(node_modules|bower_components)/,
		use: {
		    loader: "babel-loader",
		    options: {
			presets: ["env", "react"]
		    }
		}
	    }
	]
    },
    output: {
	path: __dirname + "/public/js",
	filename: debug ? "bundle.js" : "bundle.min.js"
    },
    plugins: debug ? [] : [
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]
};
