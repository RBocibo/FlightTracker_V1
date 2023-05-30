const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: "development",
    entry:{
        main: path.resolve(__dirname, "./src/index.js"),
    },
    output: {
        filename: "[name].[contenthash].js",
        path: path.resolve(__dirname, "./dist"),
        clean: true,
        assetModuleFilename: '[name][ext]'
    },
    module: {
        rules: [
          {
            test: /\.css$/i,
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(png|svg|jpg|jpeg|gif)$/i,
            type: 'asset/resource',
          },
        ],
    },
    plugins: [
        new HTMLWebpackPlugin ({
            title: "Flight Tracker V1",
            filename: "index.html",
            template: "src/template.html",
        }),
    ]
};