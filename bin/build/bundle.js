const typescript = require('rollup-plugin-typescript2');
const babel = require('rollup-plugin-babel');
const path = require('path');
const rollup = require('rollup');
const fs = require('fs');
const UglifyJS = require('uglify-js');
const banner = require('./banner');

const extensions = ['.js', '.ts'];
const format = 'umd';
const plugins = [
  typescript({
    tsconfigOverride: {
      compilerOptions: {
        declaration: false, // make sure to avoid components declaration
      },
    },
  }),
  babel({ extensions, include: ['src/**/*'] }),
];

// global Util
const Util = path.resolve(__dirname, '../../src/js/util.ts');

// package
const fileName = 'phonon';
const fileSrc = '../../src/js/phonon.ts';
const fileDest  = `${fileName}.js`
const fileDestMin = `${fileName}.min.js`

console.log(`Building ${fileName} package...`);

(async () => {
  try {
    const file = path.resolve(__dirname, `../../dist/js/${fileDest}`);
    const fileMin = path.resolve(__dirname, `../../dist/js/${fileDestMin}`);
    const fileMinMap = path.resolve(__dirname, `../../dist/js/${fileDestMin}.map`);

    const bundle = await rollup.rollup({
      input: path.resolve(__dirname, fileSrc),
      plugins,
    });

    await bundle.write({
      banner: banner(),
      file,
      format,
      name: 'phonon',
      name: fileName,
      sourcemap: true,
    });

    const result = UglifyJS.minify(fs.readFileSync(file, 'utf8'), {
      sourceMap: {
        filename: fileDestMin,
        url: `${fileDestMin}.map`,
      },
    });

    if (result.error) throw result.error;

    // minified file
    fs.writeFileSync(fileMin, result.code, 'utf8');

    // source map
    fs.writeFileSync(fileMinMap, result.map, 'utf8');
  } catch(err) {
    console.error(`${fileName}: ${err}`);
  }
})();
