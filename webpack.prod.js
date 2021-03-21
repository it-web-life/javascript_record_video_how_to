const { merge } = require('webpack-merge');
const common = require('./webpack.common');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const merged = merge(common, {
  mode: 'production',
  optimization: {
    minimizer: [
      // JSのminify
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            drop_console: true
          }
        }
      }),
      // CSSのminify
      new OptimizeCssAssetsPlugin({})
    ],
  }
});

// 確認用
console.log(merged);

module.exports = merged;
