const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, "dist"),
    filename: "main.js"
  },
  devtool: 'source-map',
  devServer: {
    contentBase: './dist',
    compress: true,
    port: 8000
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: 'ts-loader',
      exclude: /node_modules/
    },
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ["@babel/env", "@babel/react"]
        }
      }
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    ]
  },
  plugins: [new HtmlWebpackPlugin({
    template: 'public/index.html'
  })],
  resolve: { extensions: [".js", '.ts', ".jsx", '.tsx'] },
}