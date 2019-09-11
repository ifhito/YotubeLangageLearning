var debug   = process.env.NODE_ENV !== "production";
var webpack = require('webpack');
var path    = require('path');
require("@babel/polyfill");
module.exports = {
  context: path.join(__dirname, "src"),
  entry: ['@babel/polyfill', './js/client.js'],
  module: {
    rules: [
      {
      test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react', '@babel/preset-env']
          }
        }]
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }]
    },
    
    output: {
      path: __dirname + "/src/",
      filename: "client.min.js"
    },
    plugins: debug ? [] : [
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ]
};