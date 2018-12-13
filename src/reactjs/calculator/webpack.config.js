/* execute webpack -w in vendor/canvas/Cms/Static/js/widgets/layout_widget
   folder. It will traverse parent dir to find ../node_modules. */

const webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const path = require('path');

module.exports = {
    entry: [
        __dirname + '/index.jsx'
    ],
    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: [path.resolve(__dirname, "../node_modules")],
                loader: "babel-loader"
            },
            {
                test: /\.jsx$/,
                exclude: [path.resolve(__dirname, "../node_modules")],
                loader: "babel-loader"
            },
            { test: /\.css$/, loader: "style-loader!css-loader" }

        ]

    },
    output: {
        filename: "react_bundle_calculator.js",
        path: __dirname + '/../../../public/js/bundles'
    },
    devtool: 'source-map',
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
}