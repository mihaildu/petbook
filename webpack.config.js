var debug = process.env.NODE_ENV !== "production";
var webpack = require('webpack');

module.exports = {
    context: __dirname,
    devtool: debug ? "inline-sourcemap" : false,
    entry: {
	welcome: "./src/welcome.js",
	index: "./src/index.js",
	user: "./src/user.js",
	explore: "./src/explore.js",
	quiz: "./src/quiz.js"
    },
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
	filename: debug ? "[name].js" : "[name].min.js"
    },
    plugins: debug ? [] : [
	new webpack.optimize.OccurrenceOrderPlugin(),
	new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]
};
