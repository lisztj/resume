// webpack.production.config.js
const path = require('path');
const webpack = require('webpack');
const HtmlwebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require("clean-webpack-plugin");
// const CopyWebpackPlugin = require('copy-webpack-plugin');

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
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            },
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel-loader',
                exclude: __dirname + '/node_modules/',
                include: __dirname + '/src/js',
                query: {
                    presets: ['react', 'es2015'],
                    plugins: [
                        'react-html-attrs', ["import", {
                            libraryName: "antd",
                            style: "css"
                        }]
                    ]
                }
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("css-loader")
            }, {
                // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
                // 如下配置，将小于8192byte的图片转成base64码
                // test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|jpe?g|png|gif|ico)$/,
                test: /\.(jpe?g|png|gif)$/,
                loaders: [
                    // 小于10KB的图片会自动转成dataUrl
                    'url-loader?limit=1024&name=images/[name]-[hash:5].[ext]',
                    // 'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'
                ]
            },
            {
                test: /\.(ico)$/,
                loaders: [
                    // 小于10KB的图片会自动转成dataUrl
                    'url-loader?limit=1024&name=[name]-[hash:5].[ext]',
                    // 'image-webpack-loader?{optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}, mozjpeg: {quality: 65}}'


                ]
            },
            {
                test: /\.((woff2?|svg)(\?v=[0-9]\.[0-9]\.[0-9])|(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(woff2?|svg|ttf|eot)$/,
                loader: 'url-loader?limit=1024&name=fonts/[hash:8].[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            template: __dirname + "/src/index.html",
            filename: 'index.html',
            title: 'My App',
            inject: 'body',
            favicon: __dirname + '/src/favicon.ico',
            minify: true,
            hash: true,
            cache: false,
            showErrors: false,
            "chunks": {
                // "head": {
                //     "entry": "js/index.js",
                //     "css": ["bundle.css"]
                // },
                xhtml: false
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
            },
        }),
        new webpack.BannerPlugin('copyright by liszt'),

        // new HtmlwebpackPlugin({
        //     template: __dirname + "/src/index.tmpl.html" //new 一个这个插件的实例，并传入相关的参数
        // }),
        new webpack.HotModuleReplacementPlugin(), //热加载插件
        new webpack.optimize.OccurrenceOrderPlugin(),
        // new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.optimize.UglifyJsPlugin({ //压缩js
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new ExtractTextPlugin("bundle.css"),
        new CleanWebpackPlugin(['build/*.*', 'build/images/*.*', 'build/fonts/*.*'], {
            root: __dirname,
            verbose: true,
            dry: false
        })
    ]
};