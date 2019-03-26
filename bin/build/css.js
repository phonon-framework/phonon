const fs = require('fs');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const sass = require('node-sass');
const CleanCSS = require('clean-css');

// configuration
const inputCSSFile = './src/scss/phonon.scss';
const outputDir = './dist/css';
const outputCSSFile = `${outputDir}/phonon.css`;
const outputSourceMapFile = `${outputCSSFile}.map`;
const outputCSSFileMinified = `${outputDir}/phonon.min.css`;
const outputSourceMapFileMinified = `${outputCSSFileMinified}.map`;

module.exports = async function () {
  console.log('Building CSS...');

  try {
    const sassResult = sass.renderSync({
      file: inputCSSFile,
      sourceMap: true,
      outFile: outputCSSFile, // keep file path for source map
    });

    // auto
    const cssResult = await postcss([ autoprefixer ]).process(sassResult.css, {
      from: outputCSSFile,
      to: outputCSSFile,
      map: { inline: false } // not embedded in the output CSS
    });

    cssResult.warnings().forEach(function (warn) {
      console.warn(warn.toString());
    });

    // Real disk write

    // CSS
    fs.writeFileSync(outputCSSFile, cssResult.css);

    // SourceMap
    fs.writeFileSync(outputSourceMapFile, cssResult.map);

    // minify CSS
    const output = new CleanCSS({sourceMap: true, rebaseTo: outputDir}).minify(cssResult.css, cssResult.map.toString());

    // write minified CSS
    fs.writeFileSync(outputCSSFileMinified, output.styles);

    // Source maps
    fs.writeFileSync(outputSourceMapFileMinified, output.sourceMap);
  } catch (e) {
    console.trace(e);
  }
}
