// webpack.production.config.js
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");

module.exports = {
    devtool: 'eval-source-map',
    //项目的文件夹 可以直接用文件夹名称 默认会找index.js 也可以确定是哪个文件名字
    entry: __dirname + '/src/js',
    //输出的文件名 合并以后的js会命名为bundle.js
    output: {
        path: __dirname + "/build",
        filename: 'bundle-[hash].js'
    },
    devServer: {
        contentBase: "./src", //本地服务器所加载的页面所在的目录
        historyApiFallback: true, //不跳转
        hot: true,
        inline: true, //实时刷新
        progress: true,
    },
    module: {
        rules: [{
                test: /(\.jsx|\.js)$/,
                use: {
                    loader: "babel-loader"
                },
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [{
                    loader: "style-loader"
                }, {
                    loader: "css-loader",
                    options: {
                        modules: true, // 指定启用css modules
                        localIdentName: '[name]__[local]--[hash:base64:5]' // 指定css的类名格式
                    }
                }, {
                    loader: "postcss-loader"
                }]
            }
        ]
    },
    plugins: [
        new webpack.BannerPlugin('copyright by liszt'),
        new HtmlwebpackPlugin({
            template: __dirname + "/src/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
        }),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.optimize.UglifyJsPlugin(),
        new ExtractTextPlugin("style.css"),
        new CleanWebpackPlugin('build/*.*', {
            root: __dirname,
            verbose: true,
            dry: false
        })
    ]
};