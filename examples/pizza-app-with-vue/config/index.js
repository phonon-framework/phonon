// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,

    module: {
      loaders: [
        {
          test: /\.css$/,
          loader: "style-loader!css-loader"
        },
        {
          test: /\.js$/,
          loader: 'babel',
          query: {
            presets: ['es2015']
          },
          // make sure to exclude 3rd party code in node_modules
          exclude: /node_modules/
        },
        {
          // edit this for additional asset file types
          test: /\.(png|jpg|gif|woff|woff2|eot|ttf|svg)$/,
          loader: 'url',
          query: {
            // inline files smaller then 10kb as base64 dataURL
            limit: 10000,
            // fallback to file-loader with this naming scheme
            name: '[name].[ext]?[hash]'
          }
        }
      ]
    }
  }
}
