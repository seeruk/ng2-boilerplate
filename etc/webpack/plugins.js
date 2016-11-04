"use strict";

const env = require("../env");
const path = require("path");
const webpack = require("webpack");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const plugins = [
    new webpack.ProgressPlugin(),
    new webpack.ContextReplacementPlugin(
        // For: https://github.com/angular/angular/issues/11580
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        path.join(process.cwd(), "src")
    )
];

if (!env.isTest) {
    plugins.push(
        new webpack.optimize.CommonsChunkPlugin({
            name: [ "vendor" ]
        }),
        new ExtractTextPlugin({
            filename: "styles.[hash].css"
        }),
        new HtmlWebpackPlugin({
            template: "./index.html",
            chunksSortMode: "dependency"
        })
    );
}

if (env.isTest) {
    plugins.push(
        new webpack.SourceMapDevToolPlugin({
            filename: null, // if no value is provided the sourcemap is inlined
            test: /\.(ts|js)($|\?)/i // process .js and .ts files only
        })
    );
}

if (env.isProd) {
    plugins.push(
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    );
}

if (env.isDist) {
    plugins.push(new CopyWebpackPlugin([
        { from: "assets", to: "assets" },
        { from: "favicon.ico" }
    ], { ignore: [ "**/.*" ] }))
}

module.exports = plugins;