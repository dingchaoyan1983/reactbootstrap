var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path');
var src = 'src';
var dist = 'dist';
var cssLoader = 'css?sourceMap&-minimize';

if(process.env.NODE_ENV === 'production') {
  cssLoader = 'css?-sourceMap&minimize';
}

var config = {
  devtool: 'cheap-module-source-map',
  entry: {
    app: path.join(__dirname, src, 'index.jsx'),
    vendor: ['react', 'react-dom', 'react-bootstrap']
  },
  output: {
    path: path.join(__dirname, dist),
    filename: '[name].[hash].js',
    pathinfo: true
  },
  module: {
    preLoaders: [
      { test: /\.(js|jsx)$/, loader: "eslint", exclude: /node_modules/}
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /(node_modules|bower_components)/,
        query: {
          cacheDirectory: true
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style', cssLoader)
      },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file' },
      { test: /\.(woff|woff2)$/, loader:'url?prefix=font/&limit=5000' },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=application/octet-stream' },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?limit=10000&mimetype=image/svg+xml' }
    ]
  },
  debug: true,
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, src, 'index.html'),
      hash: false,
      filename: 'index.html',
      inject: 'body',
      favicon: path.join(__dirname, src, 'static/favicon.png'),
      minify: {
        collapseWhitespace: false
      }
    }),
    new CleanWebpackPlugin([path.join(__dirname, dist)]),
    new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor']
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.BannerPlugin('This file is created by dding')
  ],
  devServer: {
    inline: true,
    hot: true
  },
  eslint: {
    failOnError: true,
    configFile: path.join(__dirname, '.eslintrc')
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({
    compress: {
      unused: true,
      dead_code: true,
      warnings: false
    },
    sourceMap: false
  }));
}

module.exports = config;
