const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ['@babel/polyfill', __dirname + '/src/script/index.js'],
  output: {
    path: __dirname + '/dist/',
    filename: 'bandle.js',
  },
  module: {
    rules: [
      // Babel設定
      {
        test: /\.js$/,
        exclude: '/node_modules/',
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [[
                '@babel/preset-env',
                {
                  useBuiltIns: 'entry',
                }
              ]]
            }
          }
        ]
      },
      // SASS SCSS CSS設定
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          'sass-loader'
        ]
      }
    ]
  },
  // スタイルをCSSファイルに分離する設定
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
    })
  ]
};
