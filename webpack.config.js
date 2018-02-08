const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin"); // 提取css文件
const autoprefixer = require('autoprefixer');

const config = {
    entry: {
        "babel-polyfill": "babel-polyfill",
        main: path.resolve(__dirname,'src/js/main.js'),
        vendor: [path.resolve(__dirname,'src/js/jquery.js'),path.resolve(__dirname,'src/js/a.js'),path.resolve(__dirname,'src/js/b.js')],
    },
    output: {
        path: path.resolve(__dirname,'dist'),
        filename: 'js/[name].js',
        publicPath: "/"
    },
    resolve:{
        alias: {
            'jquery': path.resolve(__dirname, 'src/js/jquery.js')
        }
    },
    module: {
        rules:[
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.(css|less)$/,
                exclude: /node_modules/,
                // loader: "style-loader!css-loader!postcss-loader!less-loader",
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader', // 当css没有被提取的loader
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'postcss-loader', // 浏览器兼容等
                            options: {
                                plugins: () => [autoprefixer(
                                    { browsers: ['iOS >= 7', 'Android >= 4.1',
                                        'last 10 Chrome versions', 'last 10 Firefox versions',
                                        'Safari >= 6', 'ie > 8']
                                    }
                                )],
                                minimize: true //css压缩
                            }
                        },
                        {
                            loader: 'less-loader',

                        }
                    ]
                })
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                exclude: /node_modules/,
                use:[
                    'url-loader?limit=10000&name=images/[name].[hash:5].[ext]',
                    {
                        loader: "image-webpack-loader",
                    }
                ],
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                exclude: /node_modules/,
                loader: 'url-loader?limit=10000&name=fonts/[name].[hash:5].[ext]'
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            date: new Date(),
            title: '首页',
            filename: 'index.html',
            favicon: '',
            template: path.resolve(__dirname,'src/index.html'),
            minify: {
                caseSensitive: false,
                collapseBooleanAttributes: true,
                collapseWhitespace: true
            },
            hash: true,
            cache: true,
            inject:'body',
            chunks: ['main','vendor']
        }),
        new HtmlWebpackPlugin({
            date: new Date(),
            title: '新闻页面',
            filename: 'news.html',
            favicon: '',
            template: path.resolve(__dirname,'src/news.html'),
            minify: {
                caseSensitive: false,
                collapseBooleanAttributes: true,
                collapseWhitespace: true
            },
            hash: true,
            cache: true,
            inject:'body',
            chunks: ['main','vendor']
        }),

        new webpack.ProvidePlugin({ //全局配置加载
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),

        new ExtractTextPlugin('css/[name].[hash:5].css'),

        new webpack.optimize.CommonsChunkPlugin({ //合并公共文件
            name: 'vendor',//对应于上面的entry的key
            // filename:"js/vendor.js",
            minChunks:2
        })
    ],
    devServer:{
        inline: true, //设置为true，代码有变化，浏览器端刷新。
        //设置基本目录结构
        contentBase:path.resolve(__dirname),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号
        port:1717,
        proxy: {

        }
    }
};

module.exports = config;

if(process.env.NODE_ENV == "prod") {
    //清空输出目录
    module.exports.plugins.push(new CleanPlugin(["./dist"], {
        "root": path.resolve(__dirname, ""),
        verbose: true,
        dry: false
    }));
    //代码压缩
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        })
    );

}else{
    //热加载插件
    module.exports.plugins.push(new webpack.HotModuleReplacementPlugin());
}