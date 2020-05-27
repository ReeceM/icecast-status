const path = require('path')
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
    entry: {
        'app': './src/app.js',
        'app.min': './src/app.js',
    },
    output: {
        path: path.resolve(__dirname, "public/dist"),
        filename: "[name].js",
        libraryTarget: 'umd',
    },
    mode: process.env.NODE_ENV,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,// Set loaders to transform files.
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],

                    }
                }
            },
        ],
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin(
            {
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
                include: /\.min\.js$/,
                sourceMap: false,
            }
        )],
    },
    plugins: [],
}
