const path = require('path')

module.exports = {
  // entry point of our application
  entry: [
    './src/js/index.js',
  ],

  // where to place the compiled bundle
  output: {
    path: __dirname,
    filename: './dist/js/phonon.js',
    publicPath: 'http://127.0.0.1:8080/',
  },

  devServer: {
    headers: { 'Access-Control-Allow-Origin': '*' },
  },

  module: {
    loaders: [
      {
        test: /\.json$/,
        loader: 'json',
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue',
      },
      {
        test: /\.js$/,
        loader: 'babel',

        query: {
          presets: ['es2015'],
        },
        // make sure to exclude 3rd party code in node_modules
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        // edit this for additional asset file types
        test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
        loader: 'url',
        query: {
          // inline files smaller then 10kb as base64 dataURL
          limit: 10000,
          // fallback to file-loader with this naming scheme
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },

  sassLoader: {
    includePaths: [path.resolve(__dirname, './sass')],
  },
}
